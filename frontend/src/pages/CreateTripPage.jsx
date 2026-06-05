import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ChevronLeft,
  Tag,
  Palette,
  Plane,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { tripAPI } from "@/services/api";

const TRAVEL_STYLES = [
  "adventure",
  "relaxing",
  "cultural",
  "family",
  "romantic",
  "luxury",
  "budget",
];
const INTERESTS = [
  "beaches",
  "history",
  "food",
  "nature",
  "shopping",
  "nightlife",
  "museums",
  "hiking",
  "art",
  "music",
];

const SLIDESHOW_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1533900298318-6bda08a523e?auto=format&fit=crop&q=80&w=800",
    title: "Positano, Amalfi Coast",
    desc: "Cliffside Mediterranean charm"
  },
  {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    title: "Kyoto Temple, Japan",
    desc: "Ancient pathways and autumn colors"
  },
  {
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    title: "Oia, Santorini",
    desc: "White-washed houses overlooking the blue caldera"
  },
  {
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800",
    title: "Taj Mahal, India",
    desc: "A monument of eternal beauty"
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    title: "Paris Eiffel Tower, France",
    desc: "The timeless Capital of Romance"
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    title: "Zermatt, Swiss Alps",
    desc: "Breathtaking peak views"
  }
];

export function CreateTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Pre-fill from dashboard search widget query params
  const durationDays = parseInt(searchParams.get("duration") || "0");
  const today = new Date();
  const defaultEnd = durationDays > 0
    ? new Date(today.getTime() + durationDays * 86400000).toISOString().split("T")[0]
    : "";

  const [form, setForm] = useState({
    destination: searchParams.get("destination") || "",
    startDate: durationDays > 0 ? today.toISOString().split("T")[0] : "",
    endDate: defaultEnd,
    budget: parseInt(searchParams.get("budget") || "2000"),
    travelers: parseInt(searchParams.get("travelers") || "2"),
    travelStyle: "adventure",
    interests: [],
  });

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await tripAPI.generate(form);
      navigate(`/trip/${data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg mb-6">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            AI is crafting your itinerary…
          </h2>
          <p className="text-slate-500 mb-10">
            Finding attractions and optimizing routes
          </p>
          <div className="w-full max-w-sm space-y-3">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-4/5 rounded-full mx-auto" />
            <Skeleton className="h-4 w-3/5 rounded-full mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
              New adventure
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Plan your trip</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <div className="wander-card p-7 h-full flex flex-col justify-between bg-white">
              <div>
                {/* Card header */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Trip Details</h2>
                    <p className="text-xs text-slate-500">
                      Fill in your preferences for a personalized itinerary
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Destination */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Destination
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                      <input
                        id="destination"
                        className="input-field pl-11"
                        placeholder="e.g. Paris, France"
                        value={form.destination}
                        onChange={(e) =>
                          setForm({ ...form, destination: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Start Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <input
                          id="startDate"
                          type="date"
                          className="input-field pl-11"
                          value={form.startDate}
                          onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        End Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <input
                          id="endDate"
                          type="date"
                          className="input-field pl-11"
                          value={form.endDate}
                          onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                          }
                          required
                          min={form.startDate}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget + Travelers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Budget ($)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <input
                          id="budget"
                          type="number"
                          className="input-field pl-11"
                          value={form.budget}
                          onChange={(e) =>
                            setForm({ ...form, budget: Number(e.target.value) })
                          }
                          required
                          min={100}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Travelers
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        <input
                          id="travelers"
                          type="number"
                          className="input-field pl-11"
                          value={form.travelers}
                          onChange={(e) =>
                            setForm({ ...form, travelers: Number(e.target.value) })
                          }
                          required
                          min={1}
                          max={20}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel Style */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">
                      <Palette className="inline-block h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                      Travel Style
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {TRAVEL_STYLES.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setForm({ ...form, travelStyle: style })}
                          className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all border ${
                            form.travelStyle === style
                              ? "bg-[#6366f1] text-white border-[#6366f1] shadow-md"
                              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">
                      <Tag className="inline-block h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                      Interests{" "}
                      <span className="text-slate-400 font-normal">(pick at least one)</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all border ${
                            form.interests.includes(interest)
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || form.interests.length === 0}
                    className="btn-primary w-full h-12 text-sm font-bold rounded-xl gap-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4 fill-white" />
                    {loading ? "Generating…" : "Generate AI Itinerary"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Slideshow of beautiful places */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="wander-card overflow-hidden h-full min-h-[600px] relative flex flex-col justify-end p-8 text-white bg-slate-900">
              {SLIDESHOW_IMAGES.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === slideIndex ? "opacity-90 scale-100" : "opacity-0 scale-105"
                  }`}
                  style={{ transitionProperty: "opacity, transform" }}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/35" />
                </div>
              ))}
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                  Dream Destination
                </span>
                <h3 className="text-xl font-bold leading-tight text-white drop-shadow-md">
                  {SLIDESHOW_IMAGES[slideIndex].title}
                </h3>
                <p className="text-xs text-white/80 font-medium leading-relaxed drop-shadow-sm">
                  {SLIDESHOW_IMAGES[slideIndex].desc}
                </p>
                <div className="flex gap-1.5 pt-2">
                  {SLIDESHOW_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === slideIndex ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
