import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ChevronRight,
  Star,
  Heart,
  Clock,
  ChevronDown,
  Bot,
  Compass,
  Utensils,
  Building2,
  Camera,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { tripAPI } from "@/services/api";

// ─── Static sample data displayed when no real trip data exists ───
const SAMPLE_ITINERARY = [
  {
    day: 1,
    date: "May 20",
    items: [
      {
        time: "9:00 AM – 11:00 AM",
        name: "Eiffel Tower",
        cat: "Attraction",
        color: "indigo",
        img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600",
      },
      {
        time: "12:30 PM – 2:00 PM",
        name: "Le Jules Verne",
        cat: "Restaurant",
        color: "orange",
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
      },
      {
        time: "3:00 PM – 5:00 PM",
        name: "Louvre Museum",
        cat: "Attraction",
        color: "teal",
        img: "https://images.unsplash.com/photo-1597910037318-f7d1141818e8?auto=format&fit=crop&q=80&w=600",
      },
    ],
  },
  { day: 2, date: "May 21", items: [] },
  { day: 3, date: "May 22", items: [] },
];

const RECOMMENDATIONS = [
  {
    name: "Eiffel Tower",
    rating: "4.8",
    reviews: "32,488",
    desc: "Iconic iron tower",
    img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Louvre Museum",
    rating: "4.7",
    reviews: "28,741",
    desc: "World's largest art museum",
    img: "https://images.unsplash.com/photo-1597910037318-f7d1141818e8?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Montmartre",
    rating: "4.6",
    reviews: "9,362",
    desc: "Historic district & basilica",
    img: "https://images.unsplash.com/photo-1554939437-ecc492c67b78?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Seine River Cruise",
    rating: "4.9",
    reviews: "15,478",
    desc: "Romantic river experience",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600",
  },
];

const FILTER_TABS = [
  { key: "attractions", label: "Attractions", icon: Compass },
  { key: "restaurants", label: "Restaurants", icon: Utensils },
  { key: "hotels", label: "Hotels", icon: Building2 },
  { key: "experiences", label: "Experiences", icon: Camera },
];

const MAP_LEGEND = [
  { label: "Attractions", color: "#6366f1" },
  { label: "Restaurants", color: "#f97316" },
  { label: "Hotels", color: "#3b82f6" },
  { label: "Experiences", color: "#ec4899" },
];

function DayBadge({ color }) {
  const colors = {
    indigo: "bg-indigo-500",
    orange: "bg-orange-400",
    teal: "bg-teal-500",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full flex-shrink-0 mt-2 ${colors[color] || "bg-slate-400"}`}
    />
  );
}

function CatBadge({ cat, color }) {
  const styles = {
    indigo: "bg-[#eef2ff] text-[#6366f1]",
    orange: "bg-[#fff7ed] text-[#f97316]",
    teal: "bg-[#f0fdfa] text-[#0d9488]",
  };
  return (
    <span
      className={`flex-shrink-0 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${styles[color] || "bg-slate-100 text-slate-650"}`}
    >
      {cat}
    </span>
  );
}

// Helper to resolve high quality photos for places
function getPlacePhoto(name, type) {
  const hash = Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const pics = {
    attraction: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80"
    ],
    restaurant: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80"
    ],
    hotel: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80"
    ]
  };
  const category = type?.toLowerCase() || "attraction";
  const list = pics[category] || pics.attraction;
  return list[hash % list.length];
}

// Helper to resolve slideshow photo sets based on destination country
function getDestinationPhotos(destination = "") {
  const destLower = destination.toLowerCase();
  
  const library = {
    paris: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=1000&auto=format&fit=crop&q=80"
    ],
    france: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80", // Paris
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=80", // Provence Lavender
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80", // French Riviera (Nice)
      "https://images.unsplash.com/photo-1563810452668-52c6f1165a26?w=1000&auto=format&fit=crop&q=80"  // Mont Saint-Michel
    ],
    italy: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000&auto=format&fit=crop&q=80", // Rome Colosseum
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1000&auto=format&fit=crop&q=80", // Venice Canals
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1000&auto=format&fit=crop&q=80", // Amalfi Coast Positano
      "https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=1000&auto=format&fit=crop&q=80"  // Florence Duomo
    ],
    london: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529655683826-09571830febe?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"
    ],
    uk: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&auto=format&fit=crop&q=80", // London Big Ben
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1000&auto=format&fit=crop&q=80", // Scotland Highlands
      "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1000&auto=format&fit=crop&q=80"  // Stonehenge
    ],
    tokyo: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80"
    ],
    japan: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80", // Kyoto pagoda
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1000&auto=format&fit=crop&q=80", // Mount Fuji
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80", // Tokyo Neon Streets
      "https://images.unsplash.com/photo-1590253509399-0a6b29af0f67?w=1000&auto=format&fit=crop&q=80"  // Osaka Castle
    ],
    india: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80", // Taj Mahal Agra
      "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=1000&auto=format&fit=crop&q=80", // Hawa Mahal Jaipur
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000&auto=format&fit=crop&q=80", // Kerala Backwaters
      "https://images.unsplash.com/photo-1596760405808-8ad758ed571a?w=1000&auto=format&fit=crop&q=80", // Ladakh Himalayas
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80"  // Goa beaches
    ],
    usa: [
      "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?w=1000&auto=format&fit=crop&q=80", // Grand Canyon
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&auto=format&fit=crop&q=80", // New York Skyline
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1000&auto=format&fit=crop&q=80", // San Francisco Gate
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1000&auto=format&fit=crop&q=80"  // Yosemite Valley
    ]
  };

  const match = Object.keys(library).find(key => destLower.includes(key));
  if (match) return library[match];
  
  return [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1000&auto=format&fit=crop&q=80"
  ];
}

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("attractions");
  const [openDay, setOpenDay] = useState(1);
  const [liked, setLiked] = useState({});
  const navigate = useNavigate();

  // Search widget state
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("");

  const handleGenerate = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (budget) params.set("budget", budget);
    if (duration) params.set("duration", duration);
    if (travelers) params.set("travelers", travelers);
    navigate(`/create-trip${params.toString() ? "?" + params.toString() : ""}`);
  };

  useEffect(() => {
    tripAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const latestTrip = data?.savedTrips?.[0] || null;

  // Dynamic Pexels photo states
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [recPhotos, setRecPhotos] = useState({});
  const [itinPhotos, setItinPhotos] = useState({});
  const [slideIndex, setSlideIndex] = useState(0);

  // Fetch slideshow gallery photos from Pexels (via backend)
  useEffect(() => {
    const dest = latestTrip?.destination || "Explore Travel";
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${API_URL}/place-photo?name=${encodeURIComponent(dest)}&limit=4`)
      .then(res => res.json())
      .then(resData => {
        if (resData.urls && resData.urls.length > 0) {
          setGalleryPhotos(resData.urls);
        } else if (resData.url) {
          setGalleryPhotos([resData.url]);
        }
      })
      .catch(err => console.error("Failed to fetch gallery photos:", err));
  }, [latestTrip]);

  const photos = galleryPhotos.length > 0 ? galleryPhotos : getDestinationPhotos(latestTrip?.destination || "Discover");

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % photos.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [photos]);

  const getDayItems = (day) => {
    const items = [];
    if (day.attractions) {
      day.attractions.forEach(x => items.push({ ...x, cat: "Attraction", color: "indigo", type: "attraction" }));
    }
    if (day.restaurants) {
      day.restaurants.forEach(x => items.push({ ...x, cat: "Restaurant", color: "orange", type: "restaurant" }));
    }
    if (day.hotels) {
      day.hotels.forEach(x => items.push({ ...x, cat: "Hotel", color: "teal", type: "hotel" }));
    }
    return items;
  };

  const getRecommendedItems = () => {
    if (!latestTrip) return RECOMMENDATIONS;
    
    let list = [];
    let type = "attraction";
    if (activeFilter === "attractions") {
      list = latestTrip.recommendedAttractions || [];
      type = "attraction";
    } else if (activeFilter === "restaurants") {
      list = latestTrip.recommendedRestaurants || [];
      type = "restaurant";
    } else if (activeFilter === "hotels") {
      list = latestTrip.recommendedHotels || [];
      type = "hotel";
    } else if (activeFilter === "experiences") {
      list = (latestTrip.recommendedAttractions || []).slice().reverse();
      type = "attraction";
    }
    
    return list.slice(0, 4).map((item) => ({
      name: item.name,
      rating: item.rating ? item.rating.toFixed(1) : "4.7",
      reviews: item.reviewCount ? item.reviewCount.toLocaleString() : "980",
      desc: item.address || "Serene travel destination place",
      img: getPlacePhoto(item.name, type),
      type: type
    }));
  };

  // Fetch recommendation photos from Pexels (via backend)
  useEffect(() => {
    const items = getRecommendedItems();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    items.forEach((item) => {
      if (recPhotos[item.name]) return;
      fetch(`${API_URL}/place-photo?name=${encodeURIComponent(item.name)}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.url) {
            setRecPhotos(prev => ({ ...prev, [item.name]: resData.url }));
          }
        })
        .catch(err => console.error("Failed to fetch recommendation photo:", err));
    });
  }, [activeFilter, latestTrip, data]);

  // Fetch itinerary day items photos from Pexels (via backend)
  useEffect(() => {
    if (!latestTrip || !latestTrip.itinerary) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    latestTrip.itinerary.forEach(day => {
      const items = getDayItems(day);
      items.forEach(item => {
        if (itinPhotos[item.name]) return;
        fetch(`${API_URL}/place-photo?name=${encodeURIComponent(item.name)}`)
          .then(res => res.json())
          .then(resData => {
            if (resData.url) {
              setItinPhotos(prev => ({ ...prev, [item.name]: resData.url }));
            }
          })
          .catch(err => console.error("Failed to fetch itinerary item photo:", err));
      });
    });
  }, [latestTrip]);

  const currentItinerary = latestTrip?.itinerary || [];
  const currentRecommendations = getRecommendedItems().map(item => ({
    ...item,
    img: recPhotos[item.name] || item.img
  }));

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 py-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-[380px] w-full rounded-2xl" />
              <Skeleton className="h-[280px] w-full rounded-2xl" />
            </div>
            <Skeleton className="lg:col-span-4 h-[700px] w-full rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 py-6 animate-fade-in-up">
        {/* ── Hero Banner ── */}
        <section className="hero-banner h-[260px] relative shadow-xl">
          <div className="hero-overlay" />

          {/* Floating balloons SVG decoration */}
          <div className="absolute right-8 top-0 bottom-0 flex items-center pointer-events-none">
            <svg width="200" height="220" viewBox="0 0 200 220" className="opacity-90">
              <ellipse cx="120" cy="60" rx="22" ry="28" fill="#f97316" opacity="0.9" />
              <line x1="120" y1="88" x2="115" y2="130" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="160" cy="40" rx="18" ry="23" fill="#6366f1" opacity="0.85" />
              <line x1="160" y1="63" x2="158" y2="120" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="85" cy="80" rx="16" ry="20" fill="#ec4899" opacity="0.8" />
              <line x1="85" y1="100" x2="88" y2="140" stroke="#ec4899" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>

          {/* Text */}
          <div className="relative z-10 px-10 pt-10 max-w-lg">
            <h1 className="text-[2.4rem] leading-[1.1] text-white font-bold drop-shadow-md">
              Discover. Plan. Travel.
            </h1>
            <p className="text-[1.5rem] font-light text-indigo-300 leading-tight">
              All with AI
            </p>
            <p className="mt-2 text-sm text-white/70 font-medium">
              Your smart travel companion to explore the world
            </p>
          </div>
        </section>

        {/* ── Search Widget (outside hero so it's never clipped) ── */}
        <div className="search-widget">
          {/* Where to — text input */}
          <div className="flex-1 px-5 py-3 flex flex-col justify-center border-r border-slate-100 min-w-0">
            <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest mb-1">Where to?</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-3.5 w-3.5 text-indigo-655" />
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="City, country…"
                className="flex-1 min-w-0 text-[13px] font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="px-5 py-3 flex flex-col justify-center border-r border-slate-100 w-40 flex-shrink-0">
            <p className="text-[9px] font-extrabold text-slate-455 uppercase tracking-widest mb-1">Budget ($)</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-3.5 w-3.5 text-indigo-655" />
              </div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="2000"
                min="0"
                className="w-full min-w-0 text-[13px] font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="px-5 py-3 flex flex-col justify-center border-r border-slate-100 w-36 flex-shrink-0">
            <p className="text-[9px] font-extrabold text-slate-455 uppercase tracking-widest mb-1">Duration</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3.5 w-3.5 text-indigo-655" />
              </div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-[13px] font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                style={{ color: duration ? "#1e293b" : "#94a3b8" }}
              >
                <option value="" disabled>Days</option>
                {[1,2,3,4,5,6,7,10,14,21].map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "Day" : "Days"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Travelers */}
          <div className="px-5 py-3 flex flex-col justify-center w-36 flex-shrink-0">
            <p className="text-[9px] font-extrabold text-slate-455 uppercase tracking-widest mb-1">Travelers</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Users className="h-3.5 w-3.5 text-indigo-655" />
              </div>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full text-[13px] font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                style={{ color: travelers ? "#1e293b" : "#94a3b8" }}
              >
                <option value="" disabled>Adults</option>
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <div className="pl-3 pr-1 flex-shrink-0">
            <button
              onClick={handleGenerate}
              className="btn-primary h-12 px-5 rounded-xl text-[13px] font-bold gap-2 flex items-center whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 fill-white" />
              Generate Itinerary
            </button>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left Column (8/12) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Wanderlust Gallery Card */}
            <div className="wander-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-bold text-slate-900">
                  {latestTrip ? `Wanderlust Gallery: ${latestTrip.destination}` : "Visual Voyage: Explore"}
                </h2>
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
                  Live Inspiration
                </span>
              </div>

              {/* Slideshow Area */}
              <div className="relative h-[340px] bg-slate-900 overflow-hidden group">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                      index === slideIndex ? "opacity-80 scale-100" : "opacity-0 scale-105"
                    }`}
                    alt={`Destination Slide ${index + 1}`}
                    style={{ transitionProperty: "opacity, transform" }}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                {/* Left/Right manual buttons */}
                <button
                  onClick={() => setSlideIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg select-none"
                >
                  ‹
                </button>
                <button
                  onClick={() => setSlideIndex((prev) => (prev + 1) % photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg select-none"
                >
                  ›
                </button>

                {/* Slide indicator description */}
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <p className="text-xs font-bold text-indigo-305 uppercase tracking-wider mb-1">Featured Highlight</p>
                  <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                    {latestTrip ? `Beautiful landscapes in ${latestTrip.destination}` : "Stunning wonders around the world"}
                  </h3>
                </div>

                {/* Slideshow dots */}
                <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSlideIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === slideIndex ? "w-4.5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended For You */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Recommended For You
                  </h2>
                  {/* Filter tabs */}
                  <div className="flex gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                    {FILTER_TABS.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                          activeFilter === key
                            ? "bg-[#6366f1] text-white shadow-sm"
                            : "text-slate-650 hover:text-slate-900"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {latestTrip && (
                  <Link to={`/trip/${latestTrip._id}`}>
                    <button className="text-sm font-bold text-[#6366f1] hover:text-violet-650 transition-colors">
                      View All Recommendations
                    </button>
                  </Link>
                )}
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {currentRecommendations.map((item, i) => (
                  <div
                    key={i}
                    className="group cursor-pointer wander-card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white"
                  >
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        className="recommended-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
                        }}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 transition-colors ${liked[i] ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </button>
                    </div>
                    <div className="p-3.5">
                      <h4 className="text-xs font-bold text-slate-900 mb-1 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-1.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-slate-850">{item.rating}</span>
                        <span className="text-[10px] text-slate-500 font-bold">({item.reviews})</span>
                      </div>
                      <p className="text-[10px] text-slate-700 font-medium truncate">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4/12) — AI Itinerary */}
          <div className="lg:col-span-4">
            {latestTrip ? (
              <div className="wander-card p-5 h-full flex flex-col bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-900">Your AI Itinerary</h2>
                  <Link to="/itinerary" className="text-xs font-bold text-[#6366f1] hover:text-violet-655 transition-colors">
                    View Full Itinerary
                  </Link>
                </div>

                {/* Timeline */}
                <div className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
                  {currentItinerary.map((day) => {
                    const dayItems = getDayItems(day);
                    return (
                      <div
                        key={day.day}
                        className="border border-slate-150 rounded-xl overflow-hidden bg-white"
                      >
                        {/* Day header */}
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                          onClick={() =>
                            setOpenDay((prev) => (prev === day.day ? null : day.day))
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${day.day === 1 ? "bg-[#6366f1]" : "bg-slate-350"}`}
                            />
                            <span className="text-sm font-bold text-slate-850">
                              Day {day.day}
                            </span>
                            {day.date && (
                              <span className="text-xs text-slate-500 font-bold">
                                • {day.date}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full ml-1">
                              {dayItems.length} items
                            </span>
                          </div>
                          {openDay === day.day ? (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          )}
                        </button>

                        {/* Day content (expanded) */}
                        {openDay === day.day && dayItems.length > 0 && (
                          <div className="px-4 pb-3 space-y-3 border-t border-slate-100 pt-3 bg-slate-50/30">
                            {dayItems.map((item, j) => (
                              <div key={j} className="flex items-center gap-3">
                                <DayBadge color={item.color} />
                                <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                                  <img
                                    src={itinPhotos[item.name] || getPlacePhoto(item.name, item.type)}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {item.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                                    <Clock className="h-2.5 w-2.5" />
                                    {item.time || "Scheduled"}
                                  </div>
                                </div>
                                <CatBadge cat={item.cat} color={item.color} />
                              </div>
                            ))}
                          </div>
                        )}
                        {openDay === day.day && dayItems.length === 0 && (
                          <div className="px-4 py-4 text-center text-xs text-slate-500 font-medium bg-slate-50/30 border-t border-slate-100">
                            No items scheduled
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* AI Tip */}
                <div className="mt-4 rounded-xl bg-[#f8f8ff] border border-[#e0e7ff] p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse-slow">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        AI Tip for your trip
                      </p>
                      <p className="text-[11px] text-slate-705 leading-relaxed font-medium">
                        Enjoy your stay in {latestTrip.destination}! Make sure to explore local restaurants in the afternoon to get authentic dishes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="px-1 mb-2">
                  <h2 className="text-base font-bold text-slate-900">Why Plan with VoyagerAI?</h2>
                  <p className="text-xs text-slate-550 mt-1">Discover the benefits of planning your next adventure with our smart assistant.</p>
                </div>
                
                {[
                  {
                    icon: Sparkles,
                    title: "AI-Powered Planning",
                    desc: "Instantly generate complete, customized day-by-day plans built around your budget and travel style.",
                    bgClass: "bg-indigo-50 text-indigo-655 border border-indigo-100/70"
                  },
                  {
                    icon: MapPin,
                    title: "Route Optimization",
                    desc: "Visualize your entire trip on interactive maps with optimized paths that save you travel time.",
                    bgClass: "bg-orange-50 text-orange-655 border border-orange-100/70"
                  },
                  {
                    icon: Wallet,
                    title: "Expense Management",
                    desc: "Keep travel costs under control with integrated real-time budgeting and currency conversion.",
                    bgClass: "bg-teal-50 text-teal-655 border border-teal-100/70"
                  }
                ].map((adv, idx) => (
                  <div key={idx} className="wander-card p-4.5 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${adv.bgClass}`}>
                      <adv.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 mb-1">{adv.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{adv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
