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

    // 4. Last resort: OpenStreetMap static map
    if (lat && lng) {
      const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=700x450&markers=${lat},${lng},red-pushpin`;
      console.log(`[place-photo] Falling back to OSM map: ${url}`);
      return res.json({ url, title: name, source: 'OpenStreetMap' });
    }

    // Ultimate fallback: Premium scenic travel photo
    console.log(`[place-photo] Using scenic fallback photo`);
    return res.json({ url: fallbackUrl, title: name, source: 'Wanderlust Scenic Fallback' });

  } catch (err) {
    console.error('[place-photo] Error during search:', err?.message);
    if (!res.headersSent) {
      return res.json({ url: fallbackUrl, title: name, source: 'Wanderlust Scenic Fallback (Error)' });
    }
  }
});

export default router;
