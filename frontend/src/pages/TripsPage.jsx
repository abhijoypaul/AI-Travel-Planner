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
import { useNotification } from "@/context/NotificationContext";

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
  const { addNotification } = useNotification();

  useEffect(() => {
    tripAPI.getAll()
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const handleDelete = async (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      await tripAPI.delete(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      addNotification("Success", "Trip deleted successfully", "success");
    } catch (err) {
      console.error(err);
      addNotification(
        "Error",
        "Failed to delete the trip. Please try again.",
        "error"
      );
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Trips", value: trips.length, icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
              { label: "Destinations", value: new Set(trips.map(t => t.destination.split(",")[0])).size, icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Days Planned", value: trips.reduce((acc, t) => {
                  const diff = Math.round((new Date(t.endDate) - new Date(t.startDate)) / 86400000);
                  return acc + (isNaN(diff) ? 0 : diff);
                }, 0), icon: Clock, color: "text-violet-500", bg: "bg-violet-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="wander-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{label}</p>
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
                <div key={trip._id} className="wander-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                    {/* Color indicator */}
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                      <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 ${style.text}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[140px] xs:max-w-none">{trip.destination}</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold ${style.bg} ${style.text} capitalize flex-shrink-0`}>
                          {trip.travelStyle}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                        </span>
                        {!isNaN(days) && days > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {days} {days === 1 ? "day" : "days"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 relative z-10">
                    <button
                      onClick={(e) => handleDelete(trip._id, e)}
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-650 hover:bg-red-50 bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link to={`/trip/${trip._id}`} className="block w-full sm:w-auto">
                      <button className="h-9 px-4 sm:px-0 sm:w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 bg-slate-50 transition-colors cursor-pointer w-full gap-1">
                        <span className="inline sm:hidden text-xs font-bold">View Details</span>
                        <ChevronRight className="h-4.5 w-4.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
