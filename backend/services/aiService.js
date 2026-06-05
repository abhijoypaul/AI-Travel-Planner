import { GoogleGenAI } from '@google/genai';

// Initialize for standard AI Studio keys (Handles the new AQ. prefix seamlessly)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY.trim()
});

const buildPrompt = ({ destination, startDate, endDate, travelers, budget, interests, travelStyle }) => {
  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  return `Create a highly customized, realistic day-by-day travel plan for ${destination} from ${startDate} to ${endDate}.
  Travel details:
  - Travelers: ${travelers}
  - Total Budget: $${budget}
  - Travel Style: ${travelStyle || 'adventure'}
  - Core Interests: ${interestList}

  CRITICAL: You must generate a distinct entries array block for EVERY single day between ${startDate} and ${endDate}. Do not hardcode a single day. Map real points of interest, authentic dining options, and actual pricing options specific to ${destination}.

  Return a valid JSON object ONLY (absolutely no markdown, no \`\`\`json wrappers, and no conversational prose) adhering strictly to this structural blueprint:
  {
    "destination": "${destination}",
    "estimatedBudget": { 
      "total": ${budget}, 
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

    // FIXES THE 404: Updated to the native SDK target layout model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Studio Error:", error.message);
    throw new Error(`Gemini connection failed: ${error.message}`);
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    console.error("Gemini Chat Error:", error.message);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try messaging me again in a moment!";
  }
};