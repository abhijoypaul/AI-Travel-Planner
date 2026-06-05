import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Plane,
  Building2,
  Car,
  Clock,
  Calendar,
  MapPin,
  Plus,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const BOOKING_TYPES = [
  { key: "flights", label: "Flights", icon: Plane },
  { key: "hotels", label: "Hotels", icon: Building2 },
  { key: "transfers", label: "Transfers", icon: Car },
  { key: "activities", label: "Activities", icon: Ticket },
];

// Sample placeholder bookings data
const SAMPLE_BOOKINGS = [
  {
    id: 1,
    type: "flights",
    title: "Paris CDG → New York JFK",
    detail: "Air France AF 007 · Economy",
    date: "May 25, 2025 · 10:30 AM",
    status: "confirmed",
    price: "$640",
    ref: "AF-8821XQ",
  },
  {
    id: 2,
    type: "hotels",
    title: "Hôtel des Arts Montmartre",
    detail: "Superior Room · 5 nights",
    date: "May 20–25, 2025",
    status: "confirmed",
    price: "$875",
    ref: "HTL-2291",
  },
  {
    id: 3,
    type: "activities",
    title: "Eiffel Tower Skip-the-Line",
    detail: "2 adults · Summit access",
    date: "May 21, 2025 · 9:00 AM",
    status: "pending",
    price: "$62",
    ref: "ACT-5512",
  },
  {
    id: 4,
    type: "transfers",
    title: "CDG Airport → City Hotel",
    detail: "Private transfer · 4 passengers",
    date: "May 20, 2025 · 2:00 PM",
    status: "confirmed",
    price: "$48",
    ref: "TRF-0093",
  },
];

const STATUS_STYLES = {
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, label: "Confirmed" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: AlertCircle, label: "Pending" },
};

const TYPE_ICONS = { flights: Plane, hotels: Building2, transfers: Car, activities: Ticket };
const TYPE_COLORS = {
  flights: { bg: "bg-blue-50", text: "text-blue-600" },
  hotels: { bg: "bg-violet-50", text: "text-violet-600" },
  transfers: { bg: "bg-emerald-50", text: "text-emerald-600" },
  activities: { bg: "bg-orange-50", text: "text-orange-600" },
};

export function BookingsPage() {
  const [activeType, setActiveType] = useState("all");

  const filtered =
    activeType === "all"
      ? SAMPLE_BOOKINGS
      : SAMPLE_BOOKINGS.filter((b) => b.type === activeType);

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Manage</p>
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          </div>
          <Link to="/create-trip">
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Plan New Trip
            </button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeType === "all"
                ? "bg-[#6366f1] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200"
            }`}
          >
            All Bookings
          </button>
          {BOOKING_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeType === key
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        <div className="space-y-3">
          {filtered.map((booking) => {
            const TypeIcon = TYPE_ICONS[booking.type];
            const typeColor = TYPE_COLORS[booking.type];
            const status = STATUS_STYLES[booking.status];
            const StatusIcon = status.icon;
            return (
              <div key={booking.id} className="wander-card p-5 flex items-center gap-4">
                {/* Type icon */}
                <div className={`h-12 w-12 rounded-2xl ${typeColor.bg} flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className={`h-6 w-6 ${typeColor.text}`} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{booking.title}</h3>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${status.bg} ${status.text}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{booking.detail}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {booking.date}
                    </span>
                    <span className="font-mono">Ref: {booking.ref}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-slate-900">{booking.price}</p>
                  <p className="text-[10px] text-slate-400">per booking</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming-soon note */}
        <div className="mt-6 wander-card p-5 flex items-center gap-4 border-dashed border-2 border-indigo-100 bg-indigo-50/30">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Real booking integration coming soon</p>
            <p className="text-xs text-slate-500">Connect flights, hotels and activities directly from your AI-generated itinerary.</p>
          </div>
          <Link to="/create-trip">
            <button className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0">
              <Plus className="h-3.5 w-3.5" />
              Plan a Trip
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
