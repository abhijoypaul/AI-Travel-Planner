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
  Sparkles,
  Users,
  Compass,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { PexelsImage } from "@/components/ui/PexelsImage";
import { tripAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { useNotification } from "@/context/NotificationContext";

const STYLE_COLORS = {
  adventure: { bg: "bg-orange-50/80", text: "text-orange-700", border: "border-orange-100", gradient: "from-orange-500/10 to-orange-500/0" },
  relaxing:  { bg: "bg-blue-50/80",   text: "text-blue-700",   border: "border-blue-100",   gradient: "from-blue-500/10 to-blue-500/0"   },
  cultural:  { bg: "bg-purple-50/80", text: "text-purple-700", border: "border-purple-100", gradient: "from-purple-500/10 to-purple-500/0" },
  family:    { bg: "bg-emerald-50/80",  text: "text-emerald-700", border: "border-emerald-100",  gradient: "from-emerald-500/10 to-emerald-500/0"  },
  romantic:  { bg: "bg-pink-50/80",   text: "text-pink-700",   border: "border-pink-100",   gradient: "from-pink-500/10 to-pink-500/0"   },
  luxury:    { bg: "bg-amber-50/80", text: "text-amber-800", border: "border-amber-100", gradient: "from-amber-500/10 to-amber-500/0" },
  budget:    { bg: "bg-slate-50/80",  text: "text-slate-700",  border: "border-slate-150",  gradient: "from-slate-500/10 to-slate-500/0"  },
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
      <div className="py-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Compass className="h-4.5 w-4.5 text-indigo-600 animate-spin" style={{ animationDuration: '20s' }} />
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Your personal travel board</p>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Trips</h1>
          </div>
          <Link to="/create-trip">
            <button className="btn-primary px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/25 active:scale-[0.98] transition-all">
              <Plus className="h-4.5 w-4.5" />
              Plan New Trip
            </button>
          </Link>
        </div>

        {/* Stats Section */}
        {!loading && trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Trips", value: trips.length, icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
              { label: "Destinations", value: new Set(trips.map(t => t.destination.split(",")[0])).size, icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
              { label: "Days Planned", value: trips.reduce((acc, t) => {
                  const diff = Math.round((new Date(t.endDate) - new Date(t.startDate)) / 86400000) + 1;
                  return acc + (isNaN(diff) ? 0 : diff);
                }, 0), icon: Clock, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <div key={label} className={`relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm hover:shadow transition-all duration-300`}>
                <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[280px] w-full rounded-2xl border border-slate-100 bg-white/80 p-4 space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="wander-card p-20 text-center bg-white/80 border border-slate-200/80 rounded-3xl shadow-sm max-w-xl mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Globe className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Adventure Awaits!</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">You don't have any planned trips yet. Let our artificial intelligence plan the perfect itinerary for you.</p>
            <Link to="/create-trip">
              <button className="btn-primary px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-md">
                <Sparkles className="h-4.5 w-4.5 fill-white" />
                Plan Your First Trip
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const style = STYLE_COLORS[trip.travelStyle] || STYLE_COLORS.adventure;
              const days = Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1;
              const cleanCity = trip.destination.split(",")[0].trim();
              
              return (
                <div 
                  key={trip._id} 
                  className="group relative flex flex-col justify-between overflow-hidden bg-white rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Photo Header */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-900">
                    <PexelsImage
                      query={cleanCity}
                      fallbackUrl="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80"
                      alt={trip.destination}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Floating Style Badge */}
                    <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border} shadow-sm backdrop-blur-sm`}>
                      {trip.travelStyle}
                    </span>

                    {/* Trash Button */}
                    <button
                      onClick={(e) => handleDelete(trip._id, e)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-black/40 hover:bg-red-600 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Destination Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-extrabold leading-tight truncate drop-shadow">
                        {cleanCity}
                      </h3>
                      {trip.destination.includes(",") && (
                        <p className="text-[10px] text-white/80 font-bold truncate mt-0.5 drop-shadow-sm">
                          {trip.destination.split(",").slice(1).join(",").trim()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        {!isNaN(days) && days > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            <span>{days} {days === 1 ? "day" : "days"}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-indigo-400" />
                          <span>{trip.travelers} {trip.travelers === 1 ? "Traveler" : "Travelers"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Budget limit</span>
                        <p className="text-sm font-extrabold text-slate-800">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: trip.currency || 'INR', maximumFractionDigits: 0 }).format(trip.budget)}
                        </p>
                      </div>
                      <Link to={`/trip/${trip._id}`}>
                        <button className="h-10 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-[0.98] shadow-sm">
                          Explore Itinerary
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
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
