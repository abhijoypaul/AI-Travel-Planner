import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { connectDB } from './config/db.js';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import utilityRoutes from './routes/utilityRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
configurePassport();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Remove trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api', utilityRoutes);

// ADD THESE HERE 👇
app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend Running');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is healthy'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`AI Travel Planner API running on port ${PORT}`);
});
