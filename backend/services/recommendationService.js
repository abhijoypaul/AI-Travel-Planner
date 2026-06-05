import { searchPlaces } from './mapsService.js';

const calculateScore = (place, centerLat, centerLng) => {
  const ratingScore = (place.rating || 3) / 5;
  const reviewScore = Math.min((place.reviewCount || 0) / 1000, 1);
  const distance = place.lat && place.lng
    ? Math.sqrt(Math.pow(place.lat - centerLat, 2) + Math.pow(place.lng - centerLng, 2))
    : 0.05;
  const distanceScore = Math.max(0, 1 - distance * 10);
  const popularityScore = place.rating >= 4.5 ? 1 : place.rating >= 4 ? 0.7 : 0.4;

  return ratingScore * 0.4 + reviewScore * 0.3 + distanceScore * 0.2 + popularityScore * 0.1;
};

const rankPlaces = (places, centerLat, centerLng, limit = 10) => {
  return places
    .map((place) => ({ ...place, score: calculateScore(place, centerLat, centerLng) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getRecommendations = async (destination, coordinates) => {
  const { lat, lng } = coordinates;

  const [attractions, restaurants, hotels] = await Promise.all([
    searchPlaces({ query: `top attractions in ${destination}`, location: { lat, lng }, type: 'tourist_attraction' }),
    searchPlaces({ query: `best restaurants in ${destination}`, location: { lat, lng }, type: 'restaurant' }),
    searchPlaces({ query: `hotels in ${destination}`, location: { lat, lng }, type: 'lodging' }),
  ]);

  return {
    attractions: rankPlaces(attractions, lat, lng),
    restaurants: rankPlaces(restaurants, lat, lng),
    hotels: rankPlaces(hotels, lat, lng),
  };
};

export const mergeAIWithPlaces = (aiPlaces, googlePlaces) => {
  const merged = [...aiPlaces];

  for (const gp of googlePlaces) {
    const exists = merged.some(
      (m) => m.name?.toLowerCase() === gp.name?.toLowerCase()
    );
    if (!exists) merged.push(gp);
  }

  return merged.slice(0, 10);
};
