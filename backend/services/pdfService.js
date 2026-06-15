import PDFDocument from 'pdfkit';

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  INR: '₹',
  CAD: 'C$',
  THB: '฿'
};

const formatCurrencyPdf = (amount, currency) => {
  const symbol = SYMBOLS[currency] || '$';
  return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const generateTripPDF = async (trip, res, currency = 'INR') => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=trip-${trip.destination.replace(/\s+/g, '-')}.pdf`);
  doc.pipe(res);

  // Title & Header Info
  doc.fontSize(24).text(`AI Travel Planner - ${trip.destination}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(11).text(`Dates: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`);
  doc.text(`Travelers: ${trip.travelers} | Target Budget: ${formatCurrencyPdf(trip.budget, currency)} | Travel Style: ${trip.travelStyle}`);
  doc.text(`Interests: ${(trip.interests || []).join(', ')}`);
  doc.moveDown();

  // Budget & Savings
  if (trip.estimatedBudget) {
    doc.fontSize(14).text('Budget Breakdown', { underline: true });
    doc.fontSize(11).text(`Estimated Total Cost: ${formatCurrencyPdf(trip.estimatedBudget.total, currency)}`);
    if (trip.budget > trip.estimatedBudget.total) {
      doc.text(`Potential Budget Savings: ${formatCurrencyPdf(trip.budget - trip.estimatedBudget.total, currency)}`);
    }
    const b = trip.estimatedBudget.breakdown;
    if (b) {
      doc.text(`Accommodation: ${formatCurrencyPdf(b.accommodation, currency)} | Food: ${formatCurrencyPdf(b.food, currency)} | Activities: ${formatCurrencyPdf(b.activities, currency)} | Transport: ${formatCurrencyPdf(b.transport, currency)}`);
    }
    doc.moveDown();
  }

  // Day-by-Day Itinerary
  doc.fontSize(16).text('Day-by-Day Itinerary', { underline: true });
  doc.moveDown(0.5);

  for (const day of trip.itinerary || []) {
    doc.fontSize(13).text(`Day ${day.day}: ${day.title || day.date}`);
    doc.fontSize(10).text(`Cost Estimate: ${formatCurrencyPdf(day.estimatedCost || 0, currency)} | Travel Time: ${day.travelTime || 'N/A'}`);
    
    if (day.tips && day.tips.length) {
      doc.fontSize(9).text(`Tips: ${day.tips.join(', ')}`, { italic: true });
    }
    doc.moveDown(0.3);

    if (day.hotels?.length) {
      doc.fontSize(11).text('Lodging / Stay:');
      day.hotels.forEach((h) => {
        let text = `  • ${h.name}`;
        if (h.estimatedCost) text += ` (${formatCurrencyPdf(h.estimatedCost, currency)})`;
        if (h.notes) text += ` - ${h.notes}`;
        doc.fontSize(9).text(text);
      });
      doc.moveDown(0.2);
    }

    if (day.attractions?.length) {
      doc.fontSize(11).text('Attractions / Activities:');
      day.attractions.forEach((a) => {
        let text = `  • ${a.time ? `[${a.time}] ` : ''}${a.name}`;
        if (a.estimatedCost) text += ` (${formatCurrencyPdf(a.estimatedCost, currency)})`;
        if (a.notes) text += ` - ${a.notes}`;
        doc.fontSize(9).text(text);
      });
      doc.moveDown(0.2);
    }

    if (day.restaurants?.length) {
      doc.fontSize(11).text('Dining / Restaurants:');
      day.restaurants.forEach((r) => {
        let text = `  • ${r.time ? `[${r.time}] ` : ''}${r.name}`;
        if (r.estimatedCost) text += ` (${formatCurrencyPdf(r.estimatedCost, currency)})`;
        if (r.notes) text += ` - ${r.notes}`;
        doc.fontSize(9).text(text);
      });
      doc.moveDown(0.2);
    }
    doc.moveDown(0.8);
  }

  // Recommendations
  if (trip.recommendedAttractions?.length || trip.recommendedRestaurants?.length || trip.recommendedHotels?.length) {
    doc.addPage();
    doc.fontSize(14).text('Recommendations', { underline: true });
    doc.moveDown(0.5);

    if (trip.recommendedHotels?.length) {
      doc.fontSize(12).text('Hotels:');
      trip.recommendedHotels.slice(0, 5).forEach((h) => {
        doc.fontSize(9).text(`  • ${h.name} - ${h.address || ''}${h.notes ? ` (${h.notes})` : ''}`);
      });
      doc.moveDown(0.3);
    }

    if (trip.recommendedAttractions?.length) {
      doc.fontSize(12).text('Attractions:');
      trip.recommendedAttractions.slice(0, 5).forEach((a) => {
        doc.fontSize(9).text(`  • ${a.name} - ${a.address || ''}${a.notes ? ` (${a.notes})` : ''}`);
      });
      doc.moveDown(0.3);
    }

    if (trip.recommendedRestaurants?.length) {
      doc.fontSize(12).text('Restaurants:');
      trip.recommendedRestaurants.slice(0, 5).forEach((r) => {
        doc.fontSize(9).text(`  • ${r.name} - ${r.address || ''}${r.notes ? ` (${r.notes})` : ''}`);
      });
      doc.moveDown(0.3);
    }
  }

  // Tracked Expenses
  if (trip.expenses && trip.expenses.length) {
    doc.moveDown();
    doc.fontSize(14).text('Tracked Expenses', { underline: true });
    doc.moveDown(0.5);
    const totalSpent = trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    trip.expenses.forEach((e) => {
      doc.fontSize(10).text(`• [${e.category}] ${e.description}: ${formatCurrencyPdf(e.amount, currency)}`);
    });
    doc.fontSize(11).text(`Total Tracked Expenses Spent: ${formatCurrencyPdf(totalSpent, currency)}`);
    doc.moveDown();
  }

  // Checklist
  if (trip.checklist && trip.checklist.length) {
    doc.moveDown();
    doc.fontSize(14).text('Pre-trip Checklist', { underline: true });
    doc.moveDown(0.5);
    trip.checklist.forEach((item) => {
      doc.fontSize(10).text(`${item.completed ? '[x]' : '[ ]'} ${item.item}`);
    });
    doc.moveDown();
  }

  // Travel Tips
  if (trip.travelTips?.length) {
    doc.moveDown();
    doc.fontSize(14).text('Travel Tips', { underline: true });
    doc.moveDown(0.5);
    trip.travelTips.forEach((tip) => doc.fontSize(10).text(`• ${tip}`));
  }

  doc.end();
};
