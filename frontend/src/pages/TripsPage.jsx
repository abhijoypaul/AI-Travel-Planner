import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Trash2,
  Plus,
  ChevronRight,
  Globe,
  Clock,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { tripAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";

const STYLE_COLORS = {
  adventure: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
  relaxing:  { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-400"   },
  cultural:  { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" },
  family:    { bg: "bg-green-50",  text: "text-green-600",  dot: "bg-green-400"  },
  romantic:  { bg: "bg-pink-50",   text: "text-pink-600",   dot: "bg-pink-400"   },
  luxury:    { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  budget:    { bg: "bg-slate-50",  text: "text-slate-600",  dot: "bg-slate-400"  },
};

export function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripAPI.getAll()
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;
    await tripAPI.delete(id);
    setTrips((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Your journeys</p>
            <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
          </div>
          <Link to="/create-trip">
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Trip
            </button>
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Trips", value: trips.length, icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
              { label: "Destinations", value: new Set(trips.map(t => t.destination.split(",")[0])).size, icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Days Planned", value: trips.reduce((acc, t) => {
                  const diff = Math.round((new Date(t.endDate) - new Date(t.startDate)) / 86400000);
                  return acc + (isNaN(diff) ? 0 : diff);
                }, 0), icon: Clock, color: "text-violet-500", bg: "bg-violet-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="wander-card p-5 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trip List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="wander-card p-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No trips yet</h3>
            <p className="text-slate-500 text-sm mb-5">Start planning your next adventure with AI</p>
            <Link to="/create-trip">
              <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Plan Your First Trip
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => {
              const style = STYLE_COLORS[trip.travelStyle] || STYLE_COLORS.adventure;
              const days = Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000);
              return (
                <div key={trip._id} className="wander-card p-5 flex items-center gap-4 hover:shadow-md transition-all group">
                  {/* Color indicator */}
                  <div className={`h-12 w-12 rounded-2xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                    <MapPin className={`h-6 w-6 ${style.text}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{trip.destination}</h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${style.bg} ${style.text} capitalize`}>
                        {trip.travelStyle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </span>
                      {!isNaN(days) && days > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {days} {days === 1 ? "day" : "days"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Link to={`/trip/${trip._id}`}>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
