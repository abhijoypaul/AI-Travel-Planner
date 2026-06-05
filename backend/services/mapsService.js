import axios from 'axios';

const API_KEY = () => process.env.GOOGLE_MAPS_API_KEY;

export const geocodeDestination = async (address) => {
  if (!API_KEY()) return { lat: 40.7128, lng: -74.006, formattedAddress: address };

  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address, key: API_KEY() },
  });

  if (data.results?.[0]) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng, formattedAddress: data.results[0].formatted_address };
  }
  throw new Error('Could not geocode destination');
};

export const searchPlaces = async ({ query, location, type, radius = 5000 }) => {
  if (!API_KEY()) return [];

  const params = {
    key: API_KEY(),
    query: query || type,
    location: `${location.lat},${location.lng}`,
    radius,
  };
  if (type) params.type = type;

  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { params });

  return (data.results || []).map((place) => ({
    name: place.name,
    address: place.formatted_address,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    placeId: place.place_id,
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    type,
  }));
};

export const getPlaceDetails = async (placeId) => {
  if (!API_KEY() || !placeId) return null;

  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,user_ratings_total,photos,website,opening_hours',
      key: API_KEY(),
    },
  });

  const place = data.result;
  if (!place) return null;

  return {
  name: place.name,
  address: place.formatted_address,
  lat: place.geometry.location.lat,
  lng: place.geometry.location.lng,
  rating: place.rating,
  reviewCount: place.user_ratings_total,
  placeId,

  photoUrl:
    place.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY()}`
      : null,

  website: place.website || null,
  openingHours: place.opening_hours?.weekday_text || [],
};
};

export const getDirections = async (origin, destination, waypoints = []) => {
  if (!API_KEY()) return { polyline: '', duration: 'N/A', distance: 'N/A' };

  const params = {
    origin: typeof origin === 'object' ? `${origin.lat},${origin.lng}` : origin,
    destination: typeof destination === 'object' ? `${destination.lat},${destination.lng}` : destination,
    key: API_KEY(),
    optimize: true,
  };

  if (waypoints.length > 0) {
    params.waypoints = `optimize:true|${waypoints.map((w) => `${w.lat},${w.lng}`).join('|')}`;
  }

  const { data } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', { params });

  if (data.routes?.[0]) {
    const route = data.routes[0];
    const leg = route.legs[0];
    return {
      polyline: route.overview_polyline.points,
      duration: route.legs.reduce((sum, l) => sum + l.duration.value, 0),
      durationText: route.legs.map((l) => l.duration.text).join(' + '),
      distance: route.legs.map((l) => l.distance.text).join(' + '),
      bounds: route.bounds,
    };
  }

  return { polyline: '', duration: 0, durationText: 'N/A', distance: 'N/A' };
};

export const geocodeLocations = async (locations) => {
  const results = [];
  for (const loc of locations) {
    if (loc.lat && loc.lng) {
      results.push(loc);
      continue;
    }
    try {
      if (!API_KEY()) {
        results.push({ ...loc, lat: 40.7128 + Math.random() * 0.1, lng: -74.006 + Math.random() * 0.1 });
        continue;
      }
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: loc.address || loc.name, key: API_KEY() },
      });
      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        results.push({ ...loc, lat, lng, address: data.results[0].formatted_address });
      } else {
        results.push(loc);
      }
    } catch {
      results.push(loc);
    }
  }
  return results;
};
