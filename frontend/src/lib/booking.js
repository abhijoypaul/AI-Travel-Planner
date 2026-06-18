/**
 * Utility functions for generating search redirect URLs with prefilled parameters
 * for MakeMyTrip, Goibibo, and Booking.com.
 */

export function formatDateMMT(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateDDMMYYYY(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateReadable(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }); // e.g. "18 Jun 2026"
}

export function formatDateBooking(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

export function formatDateGoibibo(d) {
  if (!d || isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}${month}${day}`;
}

export function getCheckoutDate(checkinInput, daysCount = 1) {
  if (!checkinInput) return "";
  const d = new Date(checkinInput);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + daysCount);
  return formatDateBooking(d);
}

/**
 * Resolves a city name to its 3-letter IATA airport/city code
 */
export function getAirportCode(cityName) {
  if (!cityName) return "";
  const clean = cityName.toLowerCase().trim();
  
  if (clean.length === 3 && /^[a-z]{3}$/.test(clean)) {
    return clean.toUpperCase();
  }
  
  const codes = {
    "delhi": "DEL",
    "new delhi": "DEL",
    "mumbai": "BOM",
    "bombay": "BOM",
    "bangalore": "BLR",
    "bengaluru": "BLR",
    "goa": "GOI",
    "kolkata": "CCU",
    "calcutta": "CCU",
    "chennai": "MAA",
    "madras": "MAA",
    "hyderabad": "HYD",
    "pune": "PNQ",
    "ahmedabad": "AMD",
    "jaipur": "JAI",
    "udaipur": "UDR",
    "kochi": "COK",
    "cochin": "COK",
    "agra": "AGR",
    "manali": "KUV",
    "leh": "IXL",
    "srinagar": "SXR",
    "amritsar": "ATQ",
    "singapore": "SIN",
    "dubai": "DXB",
    "london": "LHR",
    "paris": "CDG",
    "bangkok": "BKK",
    "tokyo": "NRT",
    "new york": "JFK",
    "nyc": "JFK",
    "maldives": "MLE",
    "male": "MLE",
    "bali": "DPS",
    "denpasar": "DPS",
    "phuket": "HKT",
    "sydney": "SYD",
    "melbourne": "MEL",
    "san francisco": "SFO",
    "los angeles": "LAX",
    "rome": "FCO",
    "milan": "MXP",
    "venice": "VCE",
    "florence": "FLR",
    "kyoto": "KIX",
    "osaka": "KIX",
    "munich": "MUC",
    "frankfurt": "FRA",
    "berlin": "BER",
    "barcelona": "BCN",
    "madrid": "MAD",
    "amsterdam": "AMS",
    "brussels": "BRU",
    "vienna": "VIE",
    "zurich": "ZRH",
    "geneva": "GVA",
    "athens": "ATH",
    "cairo": "CAI",
    "cape town": "CPT",
    "toronto": "YYZ",
    "vancouver": "YVR",
    "seoul": "ICN",
    "hong kong": "HKG",
    "shanghai": "PVG",
    "beijing": "PEK",
    "kuala lumpur": "KUL",
    "manila": "MNL",
    "jakarta": "CGK",
    "ho chi minh": "SGN",
    "hanoi": "HAN"
  };

  for (const [key, value] of Object.entries(codes)) {
    if (clean.includes(key)) {
      return value;
    }
  }

  return "";
}

/**
 * Resolves a city name to its railway station code for MakeMyTrip Train Search
 */
export function getTrainStation(cityName) {
  if (!cityName) return null;
  const clean = cityName.toLowerCase().trim();
  
  const stations = {
    "delhi": { city: "Delhi", code: "NDLS" },
    "new delhi": { city: "New Delhi", code: "NDLS" },
    "mumbai": { city: "Mumbai", code: "MMCT" },
    "bombay": { city: "Mumbai", code: "MMCT" },
    "bangalore": { city: "Bengaluru", code: "SBC" },
    "bengaluru": { city: "Bengaluru", code: "SBC" },
    "kolkata": { city: "Kolkata", code: "HWH" },
    "calcutta": { city: "Kolkata", code: "HWH" },
    "chennai": { city: "Chennai", code: "MAS" },
    "madras": { city: "Chennai", code: "MAS" },
    "hyderabad": { city: "Hyderabad", code: "SC" },
    "pune": { city: "Pune", code: "PUNE" },
    "ahmedabad": { city: "Ahmedabad", code: "ADI" },
    "jaipur": { city: "Jaipur", code: "JP" },
    "udaipur": { city: "Udaipur", code: "UDZ" },
    "kochi": { city: "Kochi", code: "ERS" },
    "cochin": { city: "Kochi", code: "ERS" },
    "agra": { city: "Agra", code: "AGC" },
    // Region / State fallbacks to main travel hubs
    "kerala": { city: "Kochi", code: "ERS" },
    "keral": { city: "Kochi", code: "ERS" },
    "goa": { city: "Madgaon", code: "MAO" },
    "rajasthan": { city: "Jaipur", code: "JP" }
  };

  for (const [key, value] of Object.entries(stations)) {
    if (clean.includes(key)) {
      return value;
    }
  }
  return null;
}

/**
 * Generates flight booking search redirect URL on MakeMyTrip
 */
export function getFlightBookingUrl(origin, destination, date, travelers = 1) {
  const formattedDate = formatDateMMT(date);
  
  // Extract city name before resolving (e.g. "Paris, France" -> "Paris")
  const cleanOriginVal = String(origin || "").split(',')[0].trim();
  const cleanDestVal = String(destination || "").split(',')[0].trim();
  
  const cleanOrigin = getAirportCode(cleanOriginVal);
  const cleanDest = getAirportCode(cleanDestVal);
  
  // If either code cannot be resolved to a valid 3-letter IATA code, MakeMyTrip search page fails.
  // We fall back to Google Search redirect to let Google's indexing route them correctly.
  if (!cleanOrigin || !cleanDest || cleanOrigin.length !== 3 || cleanDest.length !== 3) {
    const searchQuery = `MakeMyTrip flights from ${cleanOriginVal} to ${cleanDestVal} on ${formattedDate} for ${travelers} travelers`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  }
  
  // List of domestic Indian airport codes to determine international search routing
  const domesticCodes = ["DEL", "BOM", "BLR", "GOI", "CCU", "MAA", "HYD", "PNQ", "AMD", "JAI", "UDR", "COK", "AGR", "KUV", "IXL", "SXR", "ATQ"];
  const isIntl = !domesticCodes.includes(cleanOrigin) || !domesticCodes.includes(cleanDest);
  
  return `https://www.makemytrip.com/flight/search?tripType=O&itinerary=${cleanOrigin}-${cleanDest}-${formattedDate}&paxType=A-${travelers}_C-0_I-0&intl=${isIntl}&cabinClass=E`;
}

/**
 * Generates train booking search redirect URL on MakeMyTrip
 */
export function getTrainBookingUrl(origin, destination, date) {
  const formattedDate = formatDateReadable(date);
  
  // Extract city names
  const cleanOriginVal = String(origin || "").split(',')[0].trim();
  const cleanDestVal = String(destination || "").split(',')[0].trim();
  
  // Optimized natural search query that resolves directly to prefilled MakeMyTrip routes
  const searchQuery = `MakeMyTrip trains from ${cleanOriginVal} to ${cleanDestVal} on ${formattedDate}`;
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
}

/**
 * Generates hotel booking search redirect URL
 */
export function getHotelBookingUrl(hotelName, destination, checkin, checkout, travelers = 1, provider = 'booking') {
  const checkinDateObj = new Date(checkin);
  const checkoutDateObj = checkout ? new Date(checkout) : new Date(checkinDateObj.getTime() + 86400000);
  
  const checkinStr = formatDateBooking(checkin);
  const checkoutStr = checkout ? formatDateBooking(checkout) : getCheckoutDate(checkin);
  
  const checkinReadable = formatDateReadable(checkinDateObj);
  const checkoutReadable = formatDateReadable(checkoutDateObj);
  
  const rooms = Math.max(1, Math.ceil(travelers / 2));
  const cleanCityName = String(destination || "").split(',')[0].trim();

  switch (provider) {
    case 'booking':
      return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName + ", " + destination)}&checkin=${checkinStr}&checkout=${checkoutStr}&group_adults=${travelers}&no_rooms=${rooms}`;
    
    case 'makemytrip': {
      const searchQuery = `MakeMyTrip hotels ${hotelName} in ${cleanCityName} checkin ${checkinReadable} checkout ${checkoutReadable} for ${travelers} guests`;
      return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    
    case 'goibibo': {
      const searchQuery = `Goibibo hotels ${hotelName} in ${cleanCityName} checkin ${checkinReadable} checkout ${checkoutReadable} for ${travelers} guests`;
      return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    
    case 'direct':
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(hotelName + " " + destination + " official website booking")}`;
  }
}
