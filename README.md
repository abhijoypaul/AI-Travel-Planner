# AI Travel Planner

A modern full-stack AI-powered travel planning web application. Generate personalized itineraries, visualize trips on Google Maps, and manage your travel with smart recommendations.

## Features

- **AI Itinerary Generation** — GPT-4o or Google Gemini creates day-by-day plans
- **Google Maps Integration** — Interactive maps, markers, route optimization
- **Recommendation Engine** — Top 10 attractions, restaurants, hotels ranked by rating, reviews, distance, and popularity
- **JWT + Google OAuth** — Secure authentication
- **Advanced Tools** — Weather forecast, expense tracker, currency converter, PDF export, share links, AI chat assistant, travel checklist

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Shadcn-style UI, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| APIs | Google Maps, Places, Directions, Geocoding, OpenAI/Gemini, OpenWeatherMap |

## Project Structure

```
ai-travel-planner/
├── backend/          # Express API server
│   ├── config/       # DB, Passport OAuth
│   ├── models/       # User, Trip schemas
│   ├── routes/       # Auth, trips, utilities
│   ├── services/     # AI, Maps, recommendations, weather, PDF
│   └── server.js
├── frontend/         # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- API keys (see below)

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment

**Backend (`backend/.env`):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-travel-planner
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GOOGLE_MAPS_API_KEY=...

AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

OPENWEATHER_API_KEY=...
```

**Frontend (`frontend/.env`):**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=...
```

### 3. Google Cloud Setup

Enable these APIs in [Google Cloud Console](https://console.cloud.google.com/):

- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

Create OAuth 2.0 credentials for Google login with redirect URI:
`http://localhost:5000/api/auth/google/callback`

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

> Without API keys, the app runs in demo mode with fallback AI itineraries and placeholder maps.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/google` | Google OAuth |
| POST | `/api/trips/generate` | Generate AI itinerary |
| GET | `/api/trips` | List user trips |
| GET | `/api/trips/:id` | Get trip details |
| GET | `/api/trips/share/:token` | Public shared trip |
| POST | `/api/trips/:id/chat` | AI travel assistant |
| GET | `/api/trips/:id/pdf` | Export PDF |
| GET | `/api/currency` | Currency converter |

## Deployment

### Backend
Deploy to Railway, Render, or Heroku. Set all environment variables.

### Frontend
```bash
cd frontend
npm run build
```
Deploy `dist/` to Vercel, Netlify, or any static host. Set `VITE_API_URL` to your production API URL.

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) for production database.

## License

MIT
