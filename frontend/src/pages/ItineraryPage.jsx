import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Plus,
  Globe,
  Utensils,
  Hotel,
  DollarSign,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { tripAPI } from "@/services/api";
import { formatDate, formatCurrency } from "@/lib/utils";

const ITEM_COLORS = {
  attraction: { bg: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700 border border-indigo-100" },
  restaurant: { bg: "bg-orange-500", badge: "bg-orange-50 text-orange-700 border border-orange-100" },
  hotel: { bg: "bg-violet-500", badge: "bg-violet-50 text-violet-700 border border-violet-100" },
  transportation: { bg: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
};

function getColor(type = "") {
  return ITEM_COLORS[type.toLowerCase()] || { bg: "bg-slate-500", badge: "bg-slate-50 text-slate-700 border border-slate-200" };
}

export function ItineraryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openDay, setOpenDay] = useState(1);

  useEffect(() => {
    tripAPI
      .getAll()
      .then((res) => {
        const t = res.data;
        setTrips(t);
        if (t.length > 0) setSelectedTrip(t[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderLocationItem = (item, type) => {
    const color = getColor(type);
    return (
      <div key={item.name} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition-all">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color.badge}`}>
          {type === 'attraction' && <MapPin className="h-5 w-5" />}
          {type === 'restaurant' && <Utensils className="h-5 w-5" />}
          {type === 'hotel' && <Hotel className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 capitalize ${color.badge}`}>
              {type}
            </span>
          </div>
          {item.address && (
            <p className="text-[12px] text-slate-700 mt-1 leading-relaxed">
              {item.address}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-700 font-medium">
            {item.time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {item.time}
              </div>
            )}
            {item.estimatedCost > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                {formatCurrency(item.estimatedCost)}
              </div>
            )}
            {item.rating && (
              <div className="flex items-center gap-0.5 text-slate-700">
                <span>⭐</span>
                <span>{item.rating}</span>
              </div>
            )}
          </div>
          {item.notes && (
            <p className="text-[11px] text-slate-600 italic mt-1.5 border-l-2 border-slate-200 pl-2">
              "{item.notes}"
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-6 space-y-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (trips.length === 0) {
    return (
      <Layout>
        <div className="py-6 animate-fade-in-up">
          <div className="mb-6">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Plan</p>
            <h1 className="text-2xl font-bold text-slate-900">Itinerary</h1>
          </div>
          <div className="wander-card p-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No itineraries yet</h3>
            <p className="text-slate-700 text-sm mb-5">Generate a trip to see your day-by-day plan here</p>
            <Link to="/create-trip">
              <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Create an AI Itinerary
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const itinerary = selectedTrip?.itinerary || [];

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Day-by-day plan</p>
            <h1 className="text-2xl font-bold text-slate-900">Itinerary</h1>
          </div>
          <Link to="/create-trip">
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Trip
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trip selector */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1 mb-3">Select Trip</p>
            {trips.map((trip) => (
              <button
                key={trip._id}
                onClick={() => { setSelectedTrip(trip); setOpenDay(1); }}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                  selectedTrip?._id === trip._id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-750 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedTrip?._id === trip._id ? "bg-indigo-100" : "bg-slate-100"}`}>
                    <Globe className={`h-4 w-4 ${selectedTrip?._id === trip._id ? "text-indigo-600" : "text-slate-500"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate text-slate-800">{trip.destination}</p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Itinerary timeline */}
          <div className="lg:col-span-9">
            {selectedTrip && (
              <div className="wander-card overflow-hidden">
                {/* Trip header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedTrip.destination}</h2>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {formatDate(selectedTrip.startDate)} – {formatDate(selectedTrip.endDate)} ·{" "}
                      {selectedTrip.travelers} travelers
                    </p>
                  </div>
                  <Link to={`/trip/${selectedTrip._id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-750 text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                      View Full Trip
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>

                {/* Days accordion */}
                <div className="divide-y divide-slate-150">
                  {itinerary.map((day) => {
                    const totalItems = (day.activities?.length || 0) + (day.attractions?.length || 0) + (day.restaurants?.length || 0) + (day.hotels?.length || 0);
                    return (
                      <div key={day.day}>
                        {/* Day header */}
                        <button
                          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDay((p) => (p === day.day ? null : day.day))}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${openDay === day.day ? "bg-indigo-600 shadow-sm" : "bg-slate-100"}`}>
                              <CalendarDays className={`h-4 w-4 ${openDay === day.day ? "text-white" : "text-slate-650"}`} />
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-bold text-slate-900">Day {day.day}</span>
                              {day.date && (
                                <span className="text-xs text-slate-600 font-bold ml-2">· {day.date}</span>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                              {totalItems} details
                            </span>
                          </div>
                          {openDay === day.day ? (
                            <ChevronDown className="h-4.5 w-4.5 text-slate-700" />
                          ) : (
                            <ChevronRight className="h-4.5 w-4.5 text-slate-700" />
                          )}
                        </button>

                        {/* Day details */}
                        {openDay === day.day && (
                          <div className="px-6 pb-5 space-y-4 bg-slate-50/50 pt-2 border-t border-slate-100">
                            {/* Day Title */}
                            {day.title && (
                              <h3 className="text-sm font-bold text-slate-800">{day.title}</h3>
                            )}

                            {/* Schedule Summary (activities) */}
                            {day.activities && day.activities.length > 0 && (
                              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Schedule Summary</h4>
                                <ul className="space-y-2">
                                  {day.activities.map((act, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                                      <span className="text-indigo-600 mt-0.5">•</span>
                                      {act}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Attractions, Restaurants, Hotels */}
                            {((day.attractions && day.attractions.length > 0) ||
                              (day.restaurants && day.restaurants.length > 0) ||
                              (day.hotels && day.hotels.length > 0)) ? (
                              <div className="space-y-3">
                                {day.attractions?.map((item) => renderLocationItem(item, "attraction"))}
                                {day.restaurants?.map((item) => renderLocationItem(item, "restaurant"))}
                                {day.hotels?.map((item) => renderLocationItem(item, "hotel"))}
                              </div>
                            ) : (
                              (!day.activities || day.activities.length === 0) && (
                                <p className="text-sm text-slate-750 text-center py-6">No details planned for this day</p>
                              )
                            )}

                            {/* Tips */}
                            {day.tips && day.tips.length > 0 && (
                              <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                                  Useful Tips
                                </h4>
                                <ul className="space-y-1.5">
                                  {day.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-850">
                                      <span className="text-indigo-600 mt-0.5">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {itinerary.length === 0 && (
                    <div className="p-12 text-center">
                      <CalendarDays className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 text-sm font-medium">No itinerary data available for this trip</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

