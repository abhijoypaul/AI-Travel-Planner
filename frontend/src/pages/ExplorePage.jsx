import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Sparkles,
  Mountain,
  Palmtree,
  Building2,
  Waves,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PexelsImage } from "@/components/ui/PexelsImage";

const CATEGORIES = [
  { key: "all", label: "All", icon: Globe },
  { key: "trending", label: "Trending", icon: TrendingUp },
  { key: "beach", label: "Beach", icon: Waves },
  { key: "mountain", label: "Mountain", icon: Mountain },
  { key: "city", label: "City", icon: Building2 },
  { key: "tropical", label: "Tropical", icon: Palmtree },
];

const DESTINATIONS = [
  { name: "Paris, France", rating: "4.9", reviews: "128k", cat: "city", desc: "City of lights & romance", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", trending: true },
  { name: "Bali, Indonesia", rating: "4.8", reviews: "96k", cat: "tropical", desc: "Tropical paradise & temples", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4", trending: true },
  { name: "Santorini, Greece", rating: "4.9", reviews: "84k", cat: "beach", desc: "Volcanic caldera views", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff", trending: false },
  { name: "Tokyo, Japan", rating: "4.8", reviews: "112k", cat: "city", desc: "Ultra-modern meets ancient", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", trending: true },
  { name: "Swiss Alps", rating: "4.9", reviews: "62k", cat: "mountain", desc: "Pristine alpine scenery", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", trending: false },
  { name: "Maldives", rating: "4.9", reviews: "78k", cat: "beach", desc: "Crystal-clear lagoons", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", trending: true },
  { name: "New York, USA", rating: "4.7", reviews: "200k", cat: "city", desc: "The city that never sleeps", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9", trending: false },
  { name: "Patagonia, Chile", rating: "4.8", reviews: "31k", cat: "mountain", desc: "Dramatic end-of-the-world landscapes", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b", trending: false },
];

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState({});

  const filtered = DESTINATIONS.filter((d) => {
    const matchesCat =
      activeCategory === "all" ||
      (activeCategory === "trending" ? d.trending : d.cat === activeCategory);
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Discover</p>
          <h1 className="text-2xl font-bold text-slate-900">Explore Destinations</h1>
        </div>

        {/* Search + Categories */}
        <div className="wander-card p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2.5 px-4 h-10 rounded-xl bg-slate-50 border border-slate-200">
            <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === key
                    ? "bg-[#6366f1] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {filtered.map((dest, i) => (
            <div
              key={i}
              className="wander-card overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <PexelsImage
                  query={dest.name}
                  fallbackUrl={`${dest.img}?auto=format&fit=crop&q=80&w=500`}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {dest.trending && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#6366f1] text-white rounded-lg text-[10px] font-bold shadow-sm">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </div>
                )}
                <button
                  className="recommended-badge"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
                  }}
                >
                  <Heart className={`h-3.5 w-3.5 ${liked[i] ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{dest.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                  <span className="text-[10px] text-slate-400">({dest.reviews} reviews)</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 truncate">{dest.desc}</p>
                <Link to="/create-trip">
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors">
                    <Sparkles className="h-3.5 w-3.5" />
                    Plan Trip Here
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="wander-card p-16 text-center">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No destinations found for "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="mt-3 text-sm text-indigo-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
