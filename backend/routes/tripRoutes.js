import express from 'express';
import crypto from 'crypto';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/auth.js';
import { generateItinerary, chatWithAssistant } from '../services/aiService.js';
import { geocodeDestination, geocodeLocations, getDirections } from '../services/mapsService.js';
import { getRecommendations, mergeAIWithPlaces } from '../services/recommendationService.js';
import { getWeatherForecast } from '../services/weatherService.js';
import { generateTripPDF } from '../services/pdfService.js';

const router = express.Router();

const enrichItineraryWithCoords = async (itinerary, coords, destination) => {
  const enriched = [];
  for (const day of itinerary) {
    enriched.push({
      ...day,
      attractions: await geocodeLocations(day.attractions || [], coords, destination),
      restaurants: await geocodeLocations(day.restaurants || [], coords, destination),
      hotels: await geocodeLocations(day.hotels || [], coords, destination),
    });
  }
  return enriched;
};

const collectWaypoints = (itinerary) => {
  const waypoints = [];
  for (const day of itinerary) {
    for (const loc of [...(day.attractions || []), ...(day.restaurants || [])]) {
      if (loc.lat && loc.lng) waypoints.push(loc);
    }
  }
  return waypoints;
};

const parseTravelTips = (tips) => {
  if (!tips) return [];
  let rawTips = [];
  if (Array.isArray(tips)) {
    rawTips = tips;
  } else if (typeof tips === 'string') {
    rawTips = [tips];
  } else {
    try {
      rawTips = [JSON.stringify(tips)];
    } catch {
      rawTips = [];
    }
  }

  const cleaned = [];
  for (const tip of rawTips) {
    if (typeof tip === 'string') {
      const parts = tip.split(/\n+/);
      for (let part of parts) {
        part = part.replace(/^[-*•\d\.\s]+/, '').trim();
        if (part) {
          cleaned.push(part);
        }
      }
    } else if (tip && typeof tip === 'object') {
      // If tip is an object (e.g. { tip: "..." }), extract values
      const values = Object.values(tip).filter(v => typeof v === 'string');
      cleaned.push(...values);
    }
  }
  return cleaned;
};

router.post('/generate', protect, async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      currency = req.user.settings?.currency || 'INR',
      travelers,
      travelStyle,
      interests,
    } = req.body;

    const aiResult = await generateItinerary({
      destination,
      startDate,
      endDate,
      budget,
      currency,
      travelers,
      travelStyle,
      interests,
    });

    const coords = await geocodeDestination(destination);
    const recommendations = await getRecommendations(destination, coords);
    const weather = await getWeatherForecast(coords.lat, coords.lng);

    const itinerary = await enrichItineraryWithCoords(aiResult.days || [], coords, destination);
    const waypoints = collectWaypoints(itinerary);

    let routePolyline = '';
    if (waypoints.length >= 2) {
      const route = await getDirections(waypoints[0], waypoints[waypoints.length - 1], waypoints.slice(1, -1));
      routePolyline = route.polyline;
    }

    const trip = await Trip.create({
      userId: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      currency,
      travelers,
      travelStyle,
      interests,
      itinerary,
      recommendedAttractions: mergeAIWithPlaces(aiResult.recommendedAttractions || [], recommendations.attractions, 'attraction'),
      recommendedRestaurants: mergeAIWithPlaces(aiResult.recommendedRestaurants || [], recommendations.restaurants, 'restaurant'),
      recommendedHotels: mergeAIWithPlaces(aiResult.recommendedHotels || [], recommendations.hotels, 'hotel'),
      estimatedBudget: aiResult.estimatedBudget,
      coordinates: coords,
      routePolyline,
      weather,
      travelTips: parseTravelTips(aiResult.travelTips),
      checklist: (aiResult.checklist || []).map((item) => ({ item, completed: false })),
      shareToken: crypto.randomBytes(16).toString('hex'),
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Generate trip error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate trip' });
  }
});

router.get('/', protect, async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(trips);
});

router.get('/dashboard', protect, async (req, res) => {
  const now = new Date();
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const savedTrips = trips.filter((t) => t.status !== 'completed');
  const upcomingTrips = trips.filter((t) => new Date(t.startDate) >= now);
  const recentSearches = trips.slice(0, 5).map((t) => ({
    destination: t.destination,
    createdAt: t.createdAt,
    _id: t._id,
  }));

  res.json({ savedTrips, upcomingTrips, recentSearches, totalTrips: trips.length });
});

router.get('/share/:token', async (req, res) => {
  const trip = await Trip.findOne({ shareToken: req.params.token }).populate('userId', 'name');
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
});

router.get('/:id', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
});

router.put('/:id', protect, async (req, res) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
});

router.delete('/:id', protect, async (req, res) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json({ message: 'Trip deleted' });
});

router.post('/:id/expenses', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  trip.expenses.push(req.body);
  await trip.save();
  res.json(trip);
});

router.patch('/:id/checklist/:itemId', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  const item = trip.checklist.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.completed = req.body.completed ?? !item.completed;
  await trip.save();
  res.json(trip);
});

router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const currency = trip.currency || req.query.currency || req.user.settings?.currency || 'INR';
    await generateTripPDF(trip, res, currency);
  } catch (error) {
    console.error('PDF generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  }
});

router.post('/:id/chat', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  const reply = await chatWithAssistant(req.body.message, {
    destination: trip.destination,
    budget: trip.budget,
    currency: trip.currency || req.user.settings?.currency || 'INR',
    dates: { start: trip.startDate, end: trip.endDate },
  });
  res.json({ reply });
});

router.get('/:id/nearby', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  const { lat, lng } = trip.coordinates || {};
  if (!lat) return res.status(400).json({ message: 'No coordinates for trip' });
  const recommendations = await getRecommendations(trip.destination, { lat, lng });
  res.json(recommendations);
});

router.post('/:id/route', protect, async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  const waypoints = collectWaypoints(trip.itinerary);
  if (waypoints.length < 2) return res.status(400).json({ message: 'Not enough locations' });
  const route = await getDirections(waypoints[0], waypoints[waypoints.length - 1], waypoints.slice(1, -1));
  trip.routePolyline = route.polyline;
  await trip.save();
  res.json(route);
});

export default router;
