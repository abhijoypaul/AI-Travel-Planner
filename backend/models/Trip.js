import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    lat: Number,
    lng: Number,
    placeId: String,
    type: { type: String, enum: ['attraction', 'restaurant', 'hotel', 'other'] },
    rating: Number,
    reviewCount: Number,
    estimatedCost: Number,
    time: String,
    notes: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: Number,
    date: String,
    title: String,
    attractions: [locationSchema],
    restaurants: [locationSchema],
    hotels: [locationSchema],
    estimatedCost: Number,
    travelTime: String,
    activities: [String],
    tips: [String],
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    description: String,
    amount: Number,
    category: String,
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    travelers: { type: Number, required: true, default: 1 },
    travelStyle: {
      type: String,
      enum: ['luxury', 'budget', 'adventure', 'family', 'solo', 'romantic'],
      default: 'adventure',
    },
    interests: [{ type: String }],
    itinerary: [daySchema],
    recommendedAttractions: [locationSchema],
    recommendedRestaurants: [locationSchema],
    recommendedHotels: [locationSchema],
    estimatedBudget: {
      total: Number,
      breakdown: {
        accommodation: Number,
        food: Number,
        activities: Number,
        transport: Number,
      },
    },
    savedLocations: [locationSchema],
    coordinates: { lat: Number, lng: Number },
    routePolyline: String,
    weather: [{ date: String, temp: Number, description: String, icon: String }],
    expenses: [expenseSchema],
    checklist: [{ item: String, completed: { type: Boolean, default: false } }],
    shareToken: { type: String, unique: true, sparse: true },
    travelTips: [String],
    status: { type: String, enum: ['draft', 'planned', 'completed'], default: 'planned' },
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ shareToken: 1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
