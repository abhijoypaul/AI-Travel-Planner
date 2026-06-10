import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  Star,
  Heart,
  Trash2,
  Plus,
  Sparkles,
  Filter,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PexelsImage } from "@/components/ui/PexelsImage";

const CATEGORIES = ["All", "Attractions", "Restaurants", "Hotels", "Experiences"];

const SAVED_PLACES = [
  { id: 1, name: "Eiffel Tower", location: "Paris, France", cat: "Attractions", rating: "4.8", reviews: "32k", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", note: "Visit at sunset for best photos" },
  { id: 2, name: "Le Jules Verne", location: "Paris, France", cat: "Restaurants", rating: "4.6", reviews: "2.1k", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", note: "Book 2 weeks in advance" },
  { id: 3, name: "Hôtel Plaza Athénée", location: "Paris, France", cat: "Hotels", rating: "4.9", reviews: "8.4k", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd", note: "Eiffel Tower view rooms available" },
  { id: 4, name: "Louvre Museum", location: "Paris, France", cat: "Attractions", rating: "4.7", reviews: "28k", img: "https://images.unsplash.com/photo-1503152394-c571994fd383", note: "Book skip-the-line tickets" },
  { id: 5, name: "Seine River Cruise", location: "Paris, France", cat: "Experiences", rating: "4.9", reviews: "15k", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a", note: "Evening cruise is magical" },
  { id: 6, name: "Montmartre Walking Tour", location: "Paris, France", cat: "Experiences", rating: "4.8", reviews: "6.2k", img: "https://images.unsplash.com/photo-1554939437-ecc492c67b78", note: "Go early morning for fewer crowds" },
];

const CAT_COLORS = {
  Attractions: { bg: "bg-indigo-50", text: "text-indigo-600" },
  Restaurants: { bg: "bg-orange-50", text: "text-orange-600" },
  Hotels: { bg: "bg-violet-50", text: "text-violet-600" },
  Experiences: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

const formatReviews = (val) => {
  if (val === undefined || val === null) return "0";
  if (typeof val === "string" && (val.includes("k") || val.includes("m"))) return val;
  const num = parseInt(val.toString().replace(/,/g, ""), 10);
  if (isNaN(num)) return val.toString();
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export function SavedPlacesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [saved, setSaved] = useState(SAVED_PLACES);
  const [savedDetails, setSavedDetails] = useState({});

  useEffect(() => {
    // Fetch real place details from backend on mount
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    saved.forEach((place) => {
      fetch(`${API_URL}/place-details?name=${encodeURIComponent(place.name)}`)
        .then(res => res.json())
        .then(detailsData => {
          if (detailsData) {
            setSavedDetails(prev => ({
              ...prev,
              [place.name]: {
                rating: detailsData.rating,
                reviewCount: detailsData.reviewCount
              }
            }));
          }
        })
        .catch(err => console.error("Failed to fetch saved place details:", err));
    });
  }, []);

  const filtered =
    activeCategory === "All"
      ? saved
      : saved.filter((p) => p.cat === activeCategory);

  const remove = (id) => setSaved((prev) => prev.filter((p) => p.id !== id));

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Wishlist</p>
            <h1 className="text-2xl font-bold text-slate-900">Saved Places</h1>
          </div>
          <Link to="/explore">
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Discover More
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({SAVED_PLACES.filter((p) => p.cat === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="wander-card p-16 text-center">
            <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No saved places in this category</p>
            <Link to="/explore">
              <button className="mt-3 text-sm text-indigo-600 font-semibold hover:underline">
                Browse Destinations
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((place) => {
              const catStyle = CAT_COLORS[place.cat] || {};
              return (
                <div key={place.id} className="wander-card overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <PexelsImage
                      query={place.name}
                      fallbackUrl={`${place.img}?auto=format&fit=crop&q=80&w=500`}
                      alt={place.name}
                      exact={true}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => remove(place.id)}
                      className="recommended-badge hover:bg-red-50 hover:text-red-500"
                      title="Remove from saved"
                    >
                      <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                    </button>
                    <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${catStyle.bg} ${catStyle.text}`}>
                      {place.cat}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{place.name}</h3>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px] text-slate-500">{place.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {(() => {
                        const details = savedDetails[place.name] || {};
                        const displayRating = details.rating ? details.rating.toFixed(1) : place.rating;
                        const displayReviews = details.reviewCount !== undefined ? formatReviews(details.reviewCount) : place.reviews;
                        return (
                          <>
                            <span className="text-xs font-bold text-slate-800">{displayRating}</span>
                            <span className="text-[10px] text-slate-400">({displayReviews})</span>
                          </>
                        );
                      })()}
                    </div>
                    {place.note && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                        <Sparkles className="h-3 w-3 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-indigo-700 font-medium">{place.note}</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => remove(place.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                      <Link to="/create-trip" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors">
                          <Sparkles className="h-3.5 w-3.5" />
                          Plan Trip
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
