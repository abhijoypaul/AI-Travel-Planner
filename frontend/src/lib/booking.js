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

export function formatDateBooking(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

export function getCheckoutDate(checkinInput, daysCount = 1) {
  if (!checkinInput) return "";
  const d = new Date(checkinInput);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + daysCount);
  return formatDateBooking(d);
}

/**
 * Generates flight booking search redirect URL on MakeMyTrip
 */
export function getFlightBookingUrl(origin, destination, date, travelers = 1) {
  const formattedDate = formatDateMMT(date);
  const cleanOrigin = String(origin || "DEL").trim().toUpperCase();
  const cleanDest = String(destination || "").trim().toUpperCase();
  
  // If destination is a full name or does not look like a 3-letter IATA code, we fallback to Google Search
  // which will route them to MakeMyTrip with the prefilled search parameters.
  if (cleanOrigin.length !== 3 || cleanDest.length !== 3) {
    const searchQuery = `MakeMyTrip flights from ${origin} to ${destination} on ${formattedDate} for ${travelers} travelers`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  }
  
  return `https://www.makemytrip.com/flight/search?tripType=O&itinerary=${cleanOrigin}-${cleanDest}-${formattedDate}&paxType=A-${travelers}_C-0_I-0&intl=false&cabinClass=E`;
}

/**
 * Generates train booking search redirect URL on MakeMyTrip
 */
export function getTrainBookingUrl(origin, destination, date) {
  const formattedDate = formatDateMMT(date);
  // Train search URL parameters on MakeMyTrip are highly session/station-code dependent,
  // so redirecting via search is extremely reliable.
  const searchQuery = `MakeMyTrip trains from ${origin} to ${destination} on ${formattedDate}`;
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
}

/**
 * Generates hotel booking search redirect URL
 */
export function getHotelBookingUrl(hotelName, destination, checkin, checkout, travelers = 1, provider = 'booking') {
  const checkinStr = formatDateBooking(checkin);
  const checkoutStr = checkout ? formatDateBooking(checkout) : getCheckoutDate(checkin);
  const rooms = Math.max(1, Math.ceil(travelers / 2));

  switch (provider) {
    case 'booking':
      return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName + ", " + destination)}&checkin=${checkinStr}&checkout=${checkoutStr}&group_adults=${travelers}&no_rooms=${rooms}`;
    
    case 'makemytrip': {
      const searchQuery = `MakeMyTrip hotels ${hotelName} in ${destination} checkin ${checkinStr} checkout ${checkoutStr} for ${travelers} guests`;
      return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    
    case 'goibibo': {
      const searchQuery = `Goibibo hotels ${hotelName} in ${destination} checkin ${checkinStr} checkout ${checkoutStr} for ${travelers} guests`;
      return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    
    case 'direct':
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(hotelName + " " + destination + " official website booking")}`;
  }
}
