import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/currency', async (req, res) => {
  const { from = 'USD', to = 'EUR', amount = 1 } = req.query;
  try {
    const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const rate = data.rates[to];
    if (!rate) return res.status(400).json({ message: 'Invalid currency' });
    res.json({ from, to, amount: Number(amount), rate, converted: Number(amount) * rate });
  } catch {
    res.json({ from, to, amount: Number(amount), rate: 0.92, converted: Number(amount) * 0.92 });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/place-photo', async (req, res) => {
  const { name, lat, lng, limit = 1, exact } = req.query;

  // CORS — allow frontend dev server
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!name) return res.status(400).json({ message: 'name param required' });

  console.log(`[place-photo] Searching for: "${name}" (limit: ${limit}, exact: ${exact})`);

  // Scenic Unsplash fallback images list
  const fallbacks = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80", // Road trip
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80", // Boat on lake
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", // Tropical beach
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80"  // Sydney Opera House
  ];
  const hash = Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const fallbackUrl = fallbacks[hash % fallbacks.length];

  try {
    const skipPexels = exact === 'true';

    // 0. Pexels API first (if key configured and not skipped)
    const pexelsApiKey = process.env.PEXELS_API_KEY;
    if (pexelsApiKey && !skipPexels) {
      try {
        console.log(`[place-photo] Querying Pexels API for "${name}"`);
        const limitNum = parseInt(limit) || 1;
        const { data: pexelsData } = await axios.get('https://api.pexels.com/v1/search', {
          params: { query: name, per_page: limitNum },
          headers: { Authorization: pexelsApiKey },
          timeout: 4500,
        });
        
        if (limitNum > 1) {
          const urls = pexelsData.photos?.map(p => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean) || [];
          console.log(`[place-photo] Found ${urls.length} Pexels photos`);
          return res.json({ urls, source: 'Pexels' });
        }

        const photo = pexelsData.photos?.[0];
        if (photo) {
          const url = photo.src?.large2x || photo.src?.large || photo.src?.original;
          if (url) {
            console.log(`[place-photo] Found Pexels photo: ${url}`);
            return res.json({ url, title: name, source: `Pexels (Photo by ${photo.photographer})` });
          }
        }
      } catch (pErr) {
        console.error('[place-photo] Pexels API error:', pErr?.message);
      }
    }

    // 1. Google Places API (if key configured)
    const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (mapsApiKey) {
      try {
        console.log(`[place-photo] Querying Google Places API for "${name}"`);
        const { data: searchData } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
          params: { query: name, key: mapsApiKey },
          timeout: 4500,
        });
        const place = searchData.results?.[0];
        if (place && place.photos?.[0]) {
          const photoRef = place.photos[0].photo_reference;
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${mapsApiKey}`;
          console.log(`[place-photo] Found Google Places photo: ${url}`);
          return res.json({ url, title: place.name, source: 'Google Places' });
        }
      } catch (gErr) {
        console.error('[place-photo] Google Places API error:', gErr?.message);
      }
    }

    // 2. Wikipedia page image search
    console.log(`[place-photo] Trying Wikipedia for "${name}"...`);
    const wikiRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        generator: 'search',
        gsrsearch: name,
        gsrlimit: 5,
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: 800,
        format: 'json',
        origin: '*',
      },
      headers: { 'User-Agent': 'AITravelPlanner/1.0' },
      timeout: 5000,
    });

    const pages = wikiRes.data?.query?.pages || {};
    const withPhoto = Object.values(pages).find(p => p.thumbnail?.source);

    if (withPhoto) {
      const url = withPhoto.thumbnail.source.replace(/\/\d+px-/, '/800px-');
      console.log(`[place-photo] Found Wikipedia photo: ${url}`);
      return res.json({ url, title: withPhoto.title, source: 'Wikipedia' });
    }

    // 3. Wikimedia Commons direct image search
    console.log(`[place-photo] Trying Wikimedia Commons...`);
    const commonsRes = await axios.get('https://commons.wikimedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: name,
        srnamespace: 6,
        srlimit: 5,
        format: 'json',
        origin: '*',
      },
      headers: { 'User-Agent': 'AITravelPlanner/1.0' },
      timeout: 5000,
    });

    const results = commonsRes.data?.query?.search || [];
    if (results.length > 0) {
      const title = results[0].title;
      const infoRes = await axios.get('https://commons.wikimedia.org/w/api.php', {
        params: {
          action: 'query',
          titles: title,
          prop: 'imageinfo',
          iiprop: 'url|mime|thumburl',
          iiurlwidth: 800,
          format: 'json',
          origin: '*',
        },
        headers: { 'User-Agent': 'AITravelPlanner/1.0' },
        timeout: 5000,
      });

      const infoPages = infoRes.data?.query?.pages || {};
      const file = Object.values(infoPages)[0];
      const info = file?.imageinfo?.[0];
      const mime = info?.mime || '';

      if (info && mime.startsWith('image/') && !mime.includes('svg')) {
        const url = info.thumburl || info.url;
        console.log(`[place-photo] Found Commons photo: ${url}`);
        return res.json({ url, title: file.title?.replace('File:', ''), source: 'Wikimedia Commons' });
      }
    }

    // 3.5. Fallback to Pexels if other methods failed
    if (pexelsApiKey) {
      try {
        console.log(`[place-photo] Querying Pexels API in fallback for "${name}"`);
        const limitNum = parseInt(limit) || 1;
        const { data: pexelsData } = await axios.get('https://api.pexels.com/v1/search', {
          params: { query: name, per_page: limitNum },
          headers: { Authorization: pexelsApiKey },
          timeout: 4500,
        });
        
        if (limitNum > 1) {
          const urls = pexelsData.photos?.map(p => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean) || [];
          if (urls.length > 0) {
            console.log(`[place-photo] Found ${urls.length} Pexels photos in fallback`);
            return res.json({ urls, source: 'Pexels' });
          }
        } else {
          const photo = pexelsData.photos?.[0];
          if (photo) {
            const url = photo.src?.large2x || photo.src?.large || photo.src?.original;
            if (url) {
              console.log(`[place-photo] Found Pexels photo in fallback: ${url}`);
              return res.json({ url, title: name, source: `Pexels (Photo by ${photo.photographer})` });
            }
          }
        }
      } catch (pErr) {
        console.error('[place-photo] Pexels API fallback error:', pErr?.message);
      }
    }

    // 4. Last resort: OpenStreetMap static map
    if (lat && lng) {
      const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=700x450&markers=${lat},${lng},red-pushpin`;
      console.log(`[place-photo] Falling back to OSM map: ${url}`);
      return res.json({ url, title: name, source: 'OpenStreetMap' });
    }

    // Ultimate fallback: Premium scenic travel photo
    console.log(`[place-photo] Using scenic fallback photo`);
    return res.json({ url: fallbackUrl, title: name, source: 'OdysseyX Scenic Fallback' });

  } catch (err) {
    console.error('[place-photo] Error during search:', err?.message);
    if (!res.headersSent) {
      return res.json({ url: fallbackUrl, title: name, source: 'OdysseyX Scenic Fallback (Error)' });
    }
  }
});const FAMOUS_PLACES_STATS = {
  "Eiffel Tower": { rating: 4.8, reviewCount: 382488, address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France" },
  "Louvre Museum": { rating: 4.7, reviewCount: 288741, address: "Rue de Rivoli, 75001 Paris, France" },
  "Montmartre": { rating: 4.7, reviewCount: 119362, address: "75018 Paris, France" },
  "Seine River Cruise": { rating: 4.6, reviewCount: 15478, address: "Port de la Bourdonnais, 75007 Paris, France" },
  "Le Jules Verne": { rating: 4.6, reviewCount: 2100, address: "Avenue Gustave Eiffel, 2ème, 75007 Paris, France" },
  "Hôtel Plaza Athénée": { rating: 4.7, reviewCount: 8400, address: "25 Av. Montaigne, 75008 Paris, France" },
  "Paris, France": { rating: 4.9, reviewCount: 128000, address: "Paris, France" },
  "Bali, Indonesia": { rating: 4.8, reviewCount: 96000, address: "Bali, Indonesia" },
  "Santorini, Greece": { rating: 4.9, reviewCount: 84000, address: "Santorini, Greece" },
  "Tokyo, Japan": { rating: 4.8, reviewCount: 112000, address: "Tokyo, Japan" },
  "Swiss Alps": { rating: 4.9, reviewCount: 62000, address: "Switzerland" },
  "Maldives": { rating: 4.9, reviewCount: 78000, address: "Maldives" },
  "New York, USA": { rating: 4.8, reviewCount: 200000, address: "New York, NY, USA" },
  "Patagonia, Chile": { rating: 4.8, reviewCount: 31000, address: "Patagonia, Chile" },
};

const getSeededStats = (name) => {
  const matchedKey = Object.keys(FAMOUS_PLACES_STATS).find(key => name.toLowerCase().includes(key.toLowerCase()));
  if (matchedKey) {
    return FAMOUS_PLACES_STATS[matchedKey];
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  const rating = 4.3 + (hash % 7) * 0.1;
  const reviewCount = 1200 + (hash % 84) * 1000 + (hash % 10) * 100;
  return { rating, reviewCount, address: `${name}, Travel Zone` };
};

router.get('/explore-search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (mapsApiKey) {
    try {
      console.log(`[explore-search] Searching Google Places for "${query}"`);
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: { query, key: mapsApiKey },
        timeout: 4500,
      });

      const results = (data.results || []).slice(0, 8).map((place) => {
        const stats = getSeededStats(place.name);
        return {
          name: place.name,
          rating: place.rating ? place.rating.toFixed(1) : stats.rating.toFixed(1),
          reviews: place.user_ratings_total ? place.user_ratings_total.toLocaleString() : stats.reviewCount.toLocaleString(),
          desc: place.formatted_address || "Amazing travel location",
          img: place.photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${mapsApiKey}`
            : null,
          trending: false,
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng,
        };
      });

      if (results.length > 0) {
        return res.json(results);
      }
    } catch (err) {
      console.error('[explore-search] Google Places search error:', err.message);
    }
  }

  // Fallback to stable seeded placeholder results
  const simulatedPlaces = [
    { name: `${query} Central Park`, desc: `Scenic park in ${query}` },
    { name: `Grand Plaza Hotel ${query}`, desc: `Luxury stay option` },
    { name: `Trattoria ${query}`, desc: `Top local cuisine spot` }
  ].map(p => {
    const stats = getSeededStats(p.name);
    return {
      name: p.name,
      rating: stats.rating.toFixed(1),
      reviews: stats.reviewCount.toLocaleString(),
      desc: p.desc,
      img: null,
      trending: false
    };
  });
  res.json(simulatedPlaces);
});

router.get('/place-details', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'name param required' });

  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (mapsApiKey) {
    try {
      let { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: { query: name, key: mapsApiKey },
        timeout: 4500,
      });
      let place = data.results?.[0];
      
      // If the place has no rating or reviews (e.g. it is a city/locality/country),
      // fetch a top attraction in that place to get real Google Places ratings/reviews.
      if (place && (!place.rating || !place.user_ratings_total)) {
        console.log(`[place-details] "${name}" has no rating. Querying top attraction for real Google Places data.`);
        const attrRes = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
          params: { query: `top attraction in ${name}`, key: mapsApiKey },
          timeout: 4500,
        });
        if (attrRes.data.results?.[0] && attrRes.data.results[0].rating) {
          place = attrRes.data.results[0];
          console.log(`[place-details] Resolved "${name}" to landmark "${place.name}" (${place.rating} rating, ${place.user_ratings_total} reviews)`);
        }
      }

      if (place) {
        return res.json({
          name: place.name,
          rating: place.rating || 4.5,
          reviewCount: place.user_ratings_total || 120,
          address: place.formatted_address
        });
      }
    } catch (err) {
      console.error('[place-details] Error:', err.message);
    }
  }

  const stats = getSeededStats(name);
  res.json({
    name,
    rating: stats.rating,
    reviewCount: stats.reviewCount,
    address: stats.address
  });
});

export default router;
