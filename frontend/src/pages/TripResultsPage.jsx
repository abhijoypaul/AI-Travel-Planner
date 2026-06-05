import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Download,
  Share2,
  ArrowLeft,
  DollarSign,
  Lightbulb,
  Check,
  ChevronDown,
  X,
  Image,
  Car,
  Utensils,
  Hotel,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  Star,
  Heart,
  Bot,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TripMap } from "@/components/maps/TripMap";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { WeatherWidget } from "@/components/trip/WeatherWidget";
import { ExpenseTracker } from "@/components/trip/ExpenseTracker";
import { ChatAssistant } from "@/components/trip/ChatAssistant";
import { ChecklistWidget } from "@/components/trip/ChecklistWidget";
import { CurrencyConverter } from "@/components/trip/CurrencyConverter";
import { RecommendationCards } from "@/components/trip/RecommendationCards";
import { tripAPI } from "@/services/api";
import { formatDate, formatCurrency } from "@/lib/utils";

export function TripResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPhoto, setLocationPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary");
  const mapSectionRef = useRef(null);

  useEffect(() => {
    tripAPI
      .getById(id)
      .then((res) => setTrip(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const { data } = await tripAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `trip-${trip.destination}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/share/${trip.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchLocationPhoto = useCallback(async (loc) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    setPhotoLoading(true);
    setLocationPhoto(null);
    try {
      const params = new URLSearchParams({ name: loc.name, exact: "true" });
      if (loc.lat) params.set("lat", loc.lat);
      if (loc.lng) params.set("lng", loc.lng);
      const res = await fetch(`${API_URL}/place-photo?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLocationPhoto({
          url: data.url,
          credit: data.source,
          title: data.title || loc.name,
        });
      } else {
        setLocationPhoto(null);
      }
    } catch (error) {
      console.error("Failed to fetch location photo:", error);
      setLocationPhoto(null);
    }
    setPhotoLoading(false);
  }, []);

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    fetchLocationPhoto(loc);
    if (mapSectionRef.current) {
      const rect = mapSectionRef.current.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-5 py-6">
          <Skeleton className="h-14 w-72 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-[500px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-4 space-y-5">
              <Skeleton className="h-[380px] w-full rounded-2xl" />
              <Skeleton className="h-[200px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-indigo-400" />
          </div>
          <p className="text-slate-500 font-medium mb-4">Trip not found</p>
          <Link to="/dashboard">
            <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const budget = trip.estimatedBudget;

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-650 hover:text-slate-900 hover:border-slate-350 transition-all shadow-sm animate-pulse-slow"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
              Your Trip
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{trip.destination}</h1>
            <p className="text-sm text-slate-700 font-semibold mt-0.5">
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)} · {trip.travelers} travelers ·{" "}
              <span className="capitalize">{trip.travelStyle}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-750 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-750 hover:bg-slate-50 shadow-sm transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8/12) */}
          <div className="lg:col-span-8 space-y-5 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-11 rounded-xl p-1" style={{ background: "#eef0f6" }}>
                {["itinerary", "recommendations", "tools", "assistant"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-lg text-xs font-bold text-slate-700 capitalize data-[state=active]:bg-white data-[state=active]:text-indigo-650 data-[state=active]:shadow-sm transition-all"
                  >
                    {tab === "assistant" ? "AI Assistant" : tab === "tools" ? "Travel Tools" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="itinerary" className="mt-4">
                <div className="wander-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Full Itinerary</h2>
                  </div>
                  <div className="space-y-8">
                    {(trip.itinerary || []).map((day) => (
                      <DayTimeline
                        key={day.day}
                        day={day}
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={selectedLocation}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <RecommendationCards
                  trip={trip}
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </TabsContent>

              <TabsContent value="tools" className="mt-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <WeatherWidget weather={trip.weather} />
                  <ExpenseTracker trip={trip} onUpdate={setTrip} />
                  <ChecklistWidget trip={trip} onUpdate={setTrip} />
                  <CurrencyConverter />
                </div>
              </TabsContent>

              <TabsContent value="assistant" className="mt-4 max-w-2xl">
                <ChatAssistant tripId={trip._id} />
              </TabsContent>
            </Tabs>

            {/* Travel Tips */}
            {trip.travelTips?.length > 0 && (
              <div className="wander-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-amber-600 fill-amber-400" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Travel Tips</h2>
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {trip.travelTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-750 font-medium">
                      <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Plus className="h-3 w-3 text-indigo-500" />
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (4/12) - STICKY CONTAINER */}
          <div className="lg:col-span-4 space-y-5 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 lg:sticky lg:top-0 custom-scrollbar">
            {/* Map Panel */}
            <div ref={mapSectionRef} className="wander-card overflow-hidden">
              {/* Map Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Interactive Map
                </h2>
                {selectedLocation && (
                  <div className="flex items-center gap-1.5 max-w-[160px] truncate rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="truncate">{selectedLocation.name}</span>
                  </div>
                )}
              </div>

              <TripMap
                trip={trip}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                className="rounded-none"
              />

              {/* Map Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-750 font-bold">
                {[
                  { icon: MapPin, label: "Attractions", color: "text-indigo-500" },
                  { icon: Utensils, label: "Restaurants", color: "text-orange-500" },
                  { icon: Hotel, label: "Hotels", color: "text-rose-500" },
                  { icon: Car, label: "Transport", color: "text-emerald-500" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className="flex items-center gap-1">
                    <Icon className={`h-3 w-3 ${color}`} />
                    {label}
                  </span>
                ))}
                <span className="ml-auto text-slate-600 italic text-[10px] font-bold">
                  Click a place to focus
                </span>
              </div>

              {/* Photo Panel */}
              {selectedLocation && (photoLoading || locationPhoto) && (
                <div className="border-t border-slate-100">
                  <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Image className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedLocation.name}
                    </div>
                    <button
                      onClick={() => { setSelectedLocation(null); setLocationPhoto(null); }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: 200 }}>
                    {photoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                          <p className="text-xs text-slate-700 font-bold">Loading…</p>
                        </div>
                      </div>
                    )}
                    {locationPhoto && (
                      <>
                        <img
                          src={locationPhoto.url}
                          alt={locationPhoto.title || selectedLocation.name}
                          className="w-full h-full object-cover"
                          style={{ maxHeight: 200 }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                          <p className="text-white text-xs font-semibold truncate">
                            {locationPhoto.title || selectedLocation.name}
                          </p>
                          <p className="text-white/70 text-[10px]">📷 {locationPhoto.credit}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Budget Summary */}
            {budget && (
              <div className="wander-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-650" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Estimated Budget</h2>
                </div>
                <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100">
                  <p className="text-sm text-slate-700 font-bold">Total estimated cost</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(budget.total)}
                  </p>
                </div>
                {budget.breakdown && (
                  <div className="space-y-2">
                    {Object.entries(budget.breakdown).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <p className="capitalize text-slate-700 font-bold">{key}</p>
                        <p className="font-extrabold text-slate-900">{formatCurrency(val)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI Customize tip */}
            <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
              <div className="absolute -right-6 -top-6 h-24 w-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-white mb-0.5">Need changes?</p>
                  <p className="text-[11px] text-white font-bold opacity-90">
                    AI can customize this itinerary for you
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("assistant"); }}
                  className="bg-white text-indigo-600 hover:bg-slate-50 rounded-xl text-xs font-bold px-3.5 py-2 transition-all flex-shrink-0"
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
