import { GoogleGenAI } from '@google/genai';

// Initialize for standard AI Studio keys (Handles the new AQ. prefix seamlessly)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY.trim()
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const errorMessage = error.message || '';
      const isTransient = 
        errorMessage.includes('503') || 
        errorMessage.includes('UNAVAILABLE') || 
        errorMessage.includes('429') || 
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        error.status === 503 ||
        error.status === 429;

      if (!isTransient || i === retries - 1) {
        throw error;
      }
      console.warn(`Transient error encountered: ${errorMessage}. Retrying in ${delay}ms (attempt ${i + 1}/${retries})...`);
      await wait(delay);
      delay *= 2; // exponential backoff
    }
  }
};

const generateContentWithFallback = async (options) => {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError;

  for (const model of modelsToTry) {
    try {
      return await retryWithBackoff(async () => {
        console.log(`Attempting content generation with model: ${model}`);
        const response = await ai.models.generateContent({
          ...options,
          model: model
        });
        return response;
      });
    } catch (error) {
      console.error(`Failed with model ${model}:`, error.message || error);
      lastError = error;
      // Continue to try the next model
    }
  }
  throw lastError;
};

const buildPrompt = ({ destination, startDate, endDate, travelers, budget, currency = 'INR', interests, travelStyle }) => {
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  const currencyCode = String(currency || 'INR').toUpperCase();
  return `Create a highly customized, realistic day-by-day travel plan for ${destination} from ${startDate} to ${endDate}.
  Travel details:
  - Travelers: ${travelers}
  - Total Budget limit / target: ${currencyCode} ${budget}
  - Currency for every price and budget field: ${currencyCode}
  - Travel Style: ${travelStyle || 'adventure'}
  - Core Interests: ${interestList}

  CRITICAL PRICING & COST GUIDELINES:
  1. Generate highly realistic, authentic costs for that specific destination and travel style (Luxury, Budget, Adventure, Family, Solo, Romantic) in ${currencyCode}.
  2. Do not convert the user's budget into USD or any other currency. Treat ${budget} as ${currencyCode}, and return every numeric cost field in ${currencyCode}.
  3. The costs of attractions, restaurants, and hotels MUST reflect real-world prices in ${currencyCode}. For example, if ${currencyCode} is INR, output Indian Rupee amounts such as 2500 instead of dollar-based amounts.
  4. Transport costs must also be realistic in ${currencyCode}, including local taxis, trains, flights, or rental car costs where applicable.
  5. If the destination's realistic cost for this trip is LOWER than the user's maximum budget limit (${currencyCode} ${budget}), do NOT artificially inflate the costs to match the budget. Instead, estimate the genuine realistic cost and output it in estimatedBudget.total. This will show the traveler their potential savings!

  CRITICAL: You must generate a distinct entries array block for EVERY single day between ${startDate} and ${endDate}. Do not hardcode a single day. Map real points of interest, authentic dining options, and actual pricing options specific to ${destination}.

  Return a valid JSON object ONLY (absolutely no markdown, no \`\`\`json wrappers, and no conversational prose) adhering strictly to this structural blueprint:
  {
    "destination": "${destination}",
    "currency": "${currencyCode}",
    "estimatedBudget": { 
      "total": number, 
      "breakdown": { "accommodation": number, "food": number, "activities": number, "transport": number } 
    },
    "travelTips": ["Dynamic tip 1 specific to area", "Dynamic tip 2"],
    "checklist": ["Custom item 1", "Custom item 2"],
    "days": [
      {
        "day": 1,
        "date": "YYYY-MM-DD",
        "title": "Exciting Day Title",
        "activities": ["Detailed morning activity description", "Detailed afternoon activity"],
        "attractions": [{ "name": "Real Landmark Name", "address": "Actual Location/Area", "estimatedCost": number, "time": "9:00 AM", "notes": "Helpful insider tip" }],
        "restaurants": [{ "name": "Real Eatery Name", "address": "Neighborhood", "estimatedCost": number, "time": "1:00 PM", "notes": "Must-try dish" }],
        "hotels": [{ "name": "Real Accommodation Options", "address": "Area", "estimatedCost": number, "notes": "Why stay here" }],
        "estimatedCost": number,
        "travelTime": "e.g. 45 mins total travel",
        "tips": ["Local advice for today"]
      }
    ],
    "recommendedAttractions": [{ "name": "Landmark", "address": "Location", "notes": "Why go" }], 
    "recommendedRestaurants": [{ "name": "Eatery", "address": "Location", "notes": "Vibe" }], 
    "recommendedHotels": [{ "name": "Hotel", "address": "Location", "notes": "Amenities" }]
  }`;
};

export const generateItinerary = async (tripData) => {
  const prompt = buildPrompt(tripData);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in your backend/.env file!");
  }

  try {
    console.log("Routing via public AI Studio Gateway with AQ token...");

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Studio Error:", error.message || error);
    throw new Error(`Gemini connection failed: ${error.message || error}`);
  }
};

export const chatWithAssistant = async (message, tripContext) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    // Stringify the current itinerary data so the AI knows exactly what trip the user is looking at
    const contextString = tripContext
      ? `Current Itinerary Context: ${JSON.stringify(tripContext)}`
      : "No trip context available yet.";

    console.log("Routing chat message via public AI Studio Gateway...");

    const response = await generateContentWithFallback({
      contents: [
        {
          role: 'user',
          parts: [{
            text: `You are an expert AI Travel Assistant. Use the following itinerary details to answer the user's specific questions accurately. Be concise, helpful, and suggest practical local alternatives if they want to modify their plans.
            
            ${contextString}
            
            User Message: "${message}"`
          }]
        }
      ],
      config: {
        temperature: 0.7
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error.message || error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try messaging me again in a moment!";
  }
};
