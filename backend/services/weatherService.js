import axios from 'axios';

export const getWeatherForecast = async (lat, lng, days = 5) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      temp: 22 + Math.floor(Math.random() * 8),
      description: ['Sunny', 'Partly cloudy', 'Clear'][i % 3],
      icon: '01d',
    }));
  }

  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { lat, lon: lng, appid: apiKey, units: 'metric', cnt: days * 8 },
    });

    const daily = {};
    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) {
        daily[date] = {
          date,
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    }

    return Object.values(daily).slice(0, days);
  } catch {
    return [];
  }
};
