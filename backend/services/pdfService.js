import PDFDocument from 'pdfkit';

export const generateTripPDF = (trip, res) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=trip-${trip.destination.replace(/\s+/g, '-')}.pdf`);
  doc.pipe(res);

  doc.fontSize(24).text(`AI Travel Planner - ${trip.destination}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Dates: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`);
  doc.text(`Travelers: ${trip.travelers} | Budget: $${trip.budget}`);
  doc.text(`Style: ${trip.travelStyle} | Interests: ${(trip.interests || []).join(', ')}`);
  doc.moveDown();

  if (trip.estimatedBudget) {
    doc.fontSize(14).text('Estimated Budget', { underline: true });
    doc.fontSize(11).text(`Total: $${trip.estimatedBudget.total}`);
    const b = trip.estimatedBudget.breakdown;
    if (b) {
      doc.text(`Accommodation: $${b.accommodation} | Food: $${b.food} | Activities: $${b.activities} | Transport: $${b.transport}`);
    }
    doc.moveDown();
  }

  for (const day of trip.itinerary || []) {
    doc.fontSize(16).text(`Day ${day.day}: ${day.title || day.date}`, { underline: true });
    doc.fontSize(11).text(`Estimated cost: $${day.estimatedCost || 0} | Travel time: ${day.travelTime || 'N/A'}`);
    doc.moveDown(0.5);

    if (day.attractions?.length) {
      doc.fontSize(12).text('Attractions:');
      day.attractions.forEach((a) => doc.fontSize(10).text(`  • ${a.name} - ${a.time || ''} ($${a.estimatedCost || 0})`));
    }
    if (day.restaurants?.length) {
      doc.fontSize(12).text('Restaurants:');
      day.restaurants.forEach((r) => doc.fontSize(10).text(`  • ${r.name} - ${r.time || ''} ($${r.estimatedCost || 0})`));
    }
    doc.moveDown();
  }

  if (trip.travelTips?.length) {
    doc.fontSize(14).text('Travel Tips', { underline: true });
    trip.travelTips.forEach((tip) => doc.fontSize(10).text(`• ${tip}`));
  }

  doc.end();
};
