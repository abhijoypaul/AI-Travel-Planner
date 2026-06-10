import axios from 'axios';

const API_KEY = () => process.env.GOOGLE_MAPS_API_KEY;

export const geocodeDestination = async (address) => {
  if (!API_KEY()) return { lat: 40.7128, lng: -74.006, formattedAddress: address };

  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address, key: API_KEY() },
      timeout: 5000,
    });

    if (data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      const countryComp = data.results[0].address_components?.find(c => c.types.includes('country'));
      const countryCode = countryComp ? countryComp.short_name : null;
      return { lat, lng, formattedAddress: data.results[0].formatted_address, countryCode };
    }
  } catch (gErr) {
    console.warn('[geocode] Google Geocoding failed, trying Nominatim...', gErr.message);
  }

  // Fallback to OpenStreetMap Nominatim API (100% Free, no keys)
  try {
    console.log(`[geocode] Querying Nominatim for "${address}"`);
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1, addressdetails: 1 },
      headers: { 'User-Agent': 'OdysseyXTravelPlanner/1.0' },
      timeout: 5000,
    });

    if (data?.[0]) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      const countryCode = data[0].address?.country_code?.toUpperCase();
      return { lat, lng, formattedAddress: data[0].display_name, countryCode };
    }
  } catch (nErr) {
    console.error('[geocode] Nominatim fallback failed:', nErr.message);
  }

  // Last resort fallback so it does not crash trip generation
  return { lat: 48.8566, lng: 2.3522, formattedAddress: address };
};

// Simple Haversine distance calculation in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const geocodeWithNominatim = async (queryAddress, biasCoords) => {
  try {
    const params = { q: queryAddress, format: 'json', limit: 1, addressdetails: 1 };
    if (biasCoords) {
      if (biasCoords.countryCode) {
        params.countrycodes = biasCoords.countryCode.toLowerCase();
      }
      if (biasCoords.lat && biasCoords.lng) {
        // viewbox format: left,top,right,bottom
        params.viewbox = `${biasCoords.lng - 0.5},${biasCoords.lat + 0.5},${biasCoords.lng + 0.5},${biasCoords.lat - 0.5}`;
        params.bounded = 1;
      }
    }
    const nomRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params,
      headers: { 'User-Agent': 'OdysseyXTravelPlanner/1.0' },
      timeout: 3000,
    });
    if (nomRes.data?.[0]) {
      return {
        lat: parseFloat(nomRes.data[0].lat),
        lng: parseFloat(nomRes.data[0].lon),
        address: nomRes.data[0].display_name
      };
    }
  } catch {}
  return null;
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

  return (data.results || []).map((place) => {
    let mappedType = type;
    if (type === 'tourist_attraction') mappedType = 'attraction';
    else if (type === 'lodging') mappedType = 'hotel';

    return {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      placeId: place.place_id,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      type: mappedType,
    };
  });
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
    photoUrl: place.photos?.[0]
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

export const geocodeLocations = async (locations, biasCoords = null, biasDestination = '') => {
  const results = [];
  for (const loc of locations) {
    if (loc.lat && loc.lng) {
      if (biasCoords && biasCoords.lat && biasCoords.lng) {
        const dist = getDistance(loc.lat, loc.lng, biasCoords.lat, biasCoords.lng);
        if (dist < 300) { // within 300km is acceptable, otherwise re-geocode
          results.push(loc);
          continue;
        }
      } else {
        results.push(loc);
        continue;
      }
    }
    
    let queryAddress = loc.address || loc.name;
    if (biasDestination && !queryAddress.toLowerCase().includes(biasDestination.toLowerCase())) {
      queryAddress = `${queryAddress}, ${biasDestination}`;
    }

    try {
      if (!API_KEY()) {
        const baseLat = biasCoords?.lat || 40.7128;
        const baseLng = biasCoords?.lng || -74.006;
        results.push({ ...loc, lat: baseLat + (Math.random() - 0.5) * 0.05, lng: baseLng + (Math.random() - 0.5) * 0.05 });
        continue;
      }

      const params = { address: queryAddress, key: API_KEY() };
      if (biasCoords) {
        if (biasCoords.countryCode) {
          params.components = `country:${biasCoords.countryCode}`;
        }
        if (biasCoords.lat && biasCoords.lng) {
          params.bounds = `${biasCoords.lat - 0.5},${biasCoords.lng - 0.5}|${biasCoords.lat + 0.5},${biasCoords.lng + 0.5}`;
        }
      }

      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params,
        timeout: 4000,
      });

      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        // Verify distance if biasCoords is available
        if (biasCoords && biasCoords.lat && biasCoords.lng) {
          const dist = getDistance(lat, lng, biasCoords.lat, biasCoords.lng);
          if (dist > 300) {
            // If the geocoded location is wildly far (>300km), fallback to a randomized offset near the destination center
            const randomOffsetLat = biasCoords.lat + (Math.random() - 0.5) * 0.02;
            const randomOffsetLng = biasCoords.lng + (Math.random() - 0.5) * 0.02;
            results.push({ ...loc, lat: randomOffsetLat, lng: randomOffsetLng, address: biasDestination });
            continue;
          }
        }
        results.push({ ...loc, lat, lng, address: data.results[0].formatted_address });
      } else {
        const nomLoc = await geocodeWithNominatim(queryAddress, biasCoords);
        if (nomLoc) {
          results.push({ ...loc, ...nomLoc });
        } else {
          const baseLat = biasCoords?.lat || 40.7128;
          const baseLng = biasCoords?.lng || -74.006;
          results.push({ ...loc, lat: baseLat + (Math.random() - 0.5) * 0.02, lng: baseLng + (Math.random() - 0.5) * 0.02 });
        }
      }
    } catch (err) {
      const nomLoc = await geocodeWithNominatim(queryAddress, biasCoords);
      if (nomLoc) {
        results.push({ ...loc, ...nomLoc });
      } else {
        const baseLat = biasCoords?.lat || 40.7128;
        const baseLng = biasCoords?.lng || -74.006;
        results.push({ ...loc, lat: baseLat + (Math.random() - 0.5) * 0.02, lng: baseLng + (Math.random() - 0.5) * 0.02 });
      }
    }
  }
  return results;
};
