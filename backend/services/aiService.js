import { GoogleGenAI } from '@google/genai';

// Initialize for standard AI Studio keys (Handles the new AQ. prefix seamlessly)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY.trim()
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (error) => {
  const errorMessage = error.message || '';
  try {
    const match = errorMessage.match(/\{.*\}/s);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const details = parsed.error?.details || parsed.details;
      if (Array.isArray(details)) {
        const retryInfo = details.find(d => d.retryDelay || d['@type']?.includes('RetryInfo'));
        if (retryInfo && retryInfo.retryDelay) {
          const seconds = parseFloat(retryInfo.retryDelay);
          if (!isNaN(seconds)) {
            return seconds * 1000;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Failed to parse retry delay JSON:", e);
  }
  
  try {
    const match = errorMessage.match(/retry in ([\d\.]+)s/i);
    if (match && match[1]) {
      return parseFloat(match[1]) * 1000;
    }
  } catch {}
  
  return null;
};

const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
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

      let waitTime = delay;
      const serverRequestedDelay = getRetryDelay(error);
      if (serverRequestedDelay) {
        // Add 1.5 seconds safety buffer
        waitTime = serverRequestedDelay + 1500;
        console.warn(`Gemini API rate limit hit. Waiting ${waitTime}ms for quota reset (attempt ${i + 1}/${retries})...`);
      } else {
        console.warn(`Transient error encountered: ${errorMessage.substring(0, 120)}... Retrying in ${waitTime}ms (attempt ${i + 1}/${retries})...`);
      }

      await wait(waitTime);
      
      if (!serverRequestedDelay) {
        delay *= 2;
      }
    }
  }
};

const generateContentWithRetry = async (options) => {
  return await retryWithBackoff(async () => {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    console.log(`Attempting content generation with model: ${modelName}`);
    const response = await ai.models.generateContent({
      ...options,
      model: modelName
    });
    return response;
  }, 5, 1000); // Retry up to 5 times (exponential backoff)
};

const generateMockItinerary = (tripData) => {
  const { destination, startDate, endDate, travelers, budget, currency = 'INR', interests, travelStyle } = tripData;
  const currencyCode = String(currency || 'INR').toUpperCase();
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const mockAttractions = [
    { name: "Historical Downtown & Old Square", address: "Old City Center" },
    { name: "Central Fine Arts Museum", address: "Museum Boulevard" },
    { name: "Scenic Botanical Gardens", address: "Green Hill Park" },
    { name: "City Skyline Viewpoint & Tower", address: "High Ridge Road" },
    { name: "Traditional Arts & Crafts Market", address: "Market Lane" },
    { name: "Lakeside Walking Promenade", address: "Waterfront Wharf" },
    { name: "Historic Fortress & Castle Ruins", address: "North Citadel" },
    { name: "Modern Science & Space Pavilion", address: "Innovation Park" }
  ];

  const mockRestaurants = [
    { name: "The Heritage Bistro", address: "Gastronomy Street" },
    { name: "Local Spices Cafe", address: "Spices Avenue" },
    { name: "The Gourmet Terrace", address: "Rooftop Heights" },
    { name: "Seafood & Grill House", address: "Coastal Harbor" },
    { name: "Grand Feast Tavern", address: "Bazaar Square" },
    { name: "The Green Garden Cafe", address: "Eco Park Road" }
  ];

  const mockHotels = [
    { name: "Grand Central Resort", address: "Main Boulevard" },
    { name: "Boutique Heritage Suites", address: "Historical Quarter" },
    { name: "Riverside Comfort Inn", address: "Waterfront District" },
    { name: "Skyline View Hotel", address: "Financial Center" }
  ];
  
  const days = [];
  for (let i = 1; i <= diffDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + (i - 1));
    const dateStr = currentDate.toISOString().split('T')[0];

    const att = mockAttractions[(i - 1) % mockAttractions.length];
    const rest = mockRestaurants[(i - 1) % mockRestaurants.length];
    const hotel = mockHotels[(i - 1) % mockHotels.length];
    
    days.push({
      day: i,
      date: dateStr,
      title: `Day ${i}: Exploring ${destination} - Section ${String.fromCharCode(64 + i)}`,
      activities: [
        `Morning: Head to the ${att.name} to see the unique architecture and local history.`,
        `Afternoon: Enjoy lunch at ${rest.name} and explore the neighboring shops and cafes.`,
        `Evening: Return to the area around ${hotel.name} for a relaxed walk and evening entertainment.`
      ],
      attractions: [
        {
          name: `${destination} ${att.name}`,
          address: `${att.address}, ${destination}`,
          estimatedCost: Math.round(budget * 0.05),
          time: "09:30 AM",
          notes: "Arrive early. Great photo opportunities here!"
        }
      ],
      restaurants: [
        {
          name: `${rest.name} of ${destination}`,
          address: `${rest.address}, ${destination}`,
          estimatedCost: Math.round(budget * 0.03),
          time: "01:00 PM",
          notes: "Be sure to try their signature local dish."
        }
      ],
      hotels: [
        {
          name: `${destination} ${hotel.name}`,
          address: `${hotel.address}, ${destination}`,
          estimatedCost: Math.round(budget * 0.15),
          notes: "Comfortable rooms, excellent location and service."
        }
      ],
      estimatedCost: Math.round(budget * 0.23),
      travelTime: `${30 + (i * 10)} mins total transit`,
      tips: [
        `Ask the hotel desk for local transit passes.`,
        `Comfortable walking shoes are highly recommended today.`
      ]
    });
  }
  
  const destLower = destination.toLowerCase();
  let customTips = [
    `Plan your local transport routes and purchase passes in advance in ${destination}.`,
    `Try to visit the top popular sightseeing spots early in the morning to beat the crowds.`,
    `Make reservations for popular restaurants and attractions ahead of time.`,
    `Keep some local cash (${currencyCode}) handy, as smaller vendors might not accept cards.`
  ];

  if (destLower.includes("japan") || destLower.includes("tokyo") || destLower.includes("kyoto") || destLower.includes("osaka")) {
    customTips = [
      "Purchase a Suica or Pasmo IC Card for seamless train and bus travel.",
      "Many traditional restaurants and temples are cash-only, so always carry Japanese Yen.",
      "Respect local etiquette: avoid eating or speaking loudly while riding public transit.",
      "Rent a Pocket Wi-Fi or set up an eSIM before arrival for constant navigation access.",
      "Tipping is not customary in Japan; exceptional service is standard and included."
    ];
  } else if (destLower.includes("france") || destLower.includes("paris")) {
    customTips = [
      "Learn a few basic French phrases like 'Bonjour' and 'Merci'—it goes a long way with locals.",
      "Validate your metro/bus tickets immediately upon boarding to avoid hefty fines.",
      "Always say 'Bonjour' when entering shops or ordering food.",
      "Watch out for pickpockets in crowded tourist spots like the Eiffel Tower and Louvre.",
      "Water is free in restaurants; ask for a 'carafe d'eau' instead of bottled water."
    ];
  } else if (destLower.includes("italy") || destLower.includes("rome") || destLower.includes("florence") || destLower.includes("venice")) {
    customTips = [
      "Dress appropriately when visiting churches: cover shoulders and knees.",
      "Validate your train or bus tickets at the station machine before boarding.",
      "Copin (coperto) is a standard cover charge added to sit-down restaurant bills.",
      "Carry reusable water bottles; Rome has hundreds of public drinking fountains (nasoni).",
      "Avoid eating or drinking near historical monuments to respect conservation laws."
    ];
  } else if (destLower.includes("india") || destLower.includes("delhi") || destLower.includes("mumbai") || destLower.includes("taj mahal")) {
    customTips = [
      "Only drink bottled or purified water; avoid ice in local street establishments.",
      "Carry cash (INR) as local markets and auto-rickshaws rarely accept card payment.",
      "Dress modestly when entering religious sites and remove footwear where required.",
      "Download ride-hailing apps like Uber or Ola for safe and reliable city transportation.",
      "Be prepared to negotiate/haggle politely at local street markets."
    ];
  } else if (destLower.includes("uk") || destLower.includes("london") || destLower.includes("england")) {
    customTips = [
      "Use contactless payment or Oyster cards on London Underground and buses.",
      "Always stand on the right side of the escalators in Tube stations.",
      "Check the weather daily and carry a compact umbrella or raincoat.",
      "Service charges (usually 12.5%) are often added automatically to restaurant bills.",
      "Keep to the left side when walking on busy sidewalks."
    ];
  }

  return {
    destination,
    currency: currencyCode,
    estimatedBudget: {
      total: Math.round(budget * 0.8),
      breakdown: {
        accommodation: Math.round(budget * 0.4),
        food: Math.round(budget * 0.2),
        activities: Math.round(budget * 0.1),
        transport: Math.round(budget * 0.1)
      }
    },
    travelTips: customTips,
    checklist: [
      "Check weather forecast",
      "Pack essential travel documents",
      "Confirm hotel bookings"
    ],
    days,
    recommendedAttractions: [
      { name: `${destination} Culture Museum`, address: `Museum Quarter, ${destination}`, notes: "Great for learning history." }
    ],
    recommendedRestaurants: [
      { name: `Bistro ${destination}`, address: `Food Street, ${destination}`, notes: "Great ambiance and local wine." }
    ],
    recommendedHotels: [
      { name: `Central Plaza Inn`, address: `Midtown, ${destination}`, notes: "Convenient location near transit." }
    ]
  };
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

  CRITICAL GEOGRAPHIC DISTRIBUTION & TRANSPORTATION GUIDELINES:
  1. Geographically spread out the itinerary! Do not concentrate all activities in a single neighborhood or local area. Plan activities, attractions, and accommodations across different sub-regions, districts, or distinct parts of the destination.
  2. Plan logical transit routes between these spread-out areas (e.g. traveling from East district to West district).
  3. Detail the transport options (e.g. taxi, train, bus, rental car, ferry, or walking) inside the daily activities or daily tips (for example: "Take the train to the historic district (~50 INR)" or "Hire a local taxi for sightseeing").
  4. Always include realistic estimated transport costs in the daily "estimatedCost" and the global "estimatedBudget.breakdown.transport" field in ${currencyCode}.

  CRITICAL ITINERARY DIVERSITY GUIDELINES:
  1. DO NOT REPEAT the same attractions, restaurants, hotels, or activities across different days. Every day must feature completely different, unique real-world places, names, dining options, and sights specific to ${destination}.
  2. DO NOT use placeholder names from the blueprint (like "Real Landmark Name" or "Real Eatery Name"). Replace them with actual, specific names of tourist spots, restaurants, and hotels in ${destination}.
  3. DO NOT output or include separate recommendation lists (like recommendedAttractions, recommendedRestaurants, or recommendedHotels). If you want to suggest or recommend a landmark, restaurant, or hotel, integrate it directly into the day-by-day itinerary days array with all required details, routes, and costs.

  CRITICAL TRAVEL TIPS GUIDELINES:
  1. The "travelTips" field at the end must contain highly specific, actionable advice directly related to the generated itinerary, the locations chosen, and the specific timing of the visits (for example: "To visit Nara Park on Day 2, start by 9:00 AM when the deer are most active and crowds are thin," or "Buy train tickets by 8:30 AM on Day 3 for the scenic route").
  2. Do not output generic advice. Ensure every tip is tightly coupled with your generated daily activities and locations.

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
    ]
  }`;
};

export const generateItinerary = async (tripData) => {
  const prompt = buildPrompt(tripData);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in your backend/.env file!");
  }

  try {
    console.log("Routing via public AI Studio Gateway with AQ token...");

    const response = await generateContentWithRetry({
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
    
    const isQuotaExceeded = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuotaExceeded) {
      console.warn("Quota limit hit. Generating a high-quality fallback mock itinerary...");
      return generateMockItinerary(tripData);
    }
    
    throw new Error(`Gemini connection failed: ${error.message || error}`);
  }
};

export const chatWithAssistant = async (message, tripContext) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const contextString = tripContext
      ? `Current Itinerary Context: ${JSON.stringify(tripContext)}`
      : "No trip context available yet.";

    console.log("Routing chat message via public AI Studio Gateway...");

    const response = await generateContentWithRetry({
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
    const isQuotaExceeded = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuotaExceeded) {
      return "Hi there! It looks like our AI service is currently receiving a lot of traffic (API quota exhausted). I'm temporarily running in fallback mode, but please ask me anything and I'll do my best to help you with your plans!";
    }
    return "Sorry, I'm having trouble connecting to my brain right now. Please try messaging me again in a moment!";
  }
};
