import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  ChevronRight,
  Globe,
  HelpCircle,
  Play
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showPromptBar, setShowPromptBar] = useState(false);
  const [locationName, setLocationName] = useState("Amalfi Coast, Italy");
  const [dateRange, setDateRange] = useState("12–18, September");

  // Rotating destinations to keep the page alive
  useEffect(() => {
    const spots = [
      { loc: "French Riviera, France", dates: "14–20, September" },
      { loc: "Santorini, Greece", dates: "02–08, October" },
      { loc: "Kyoto, Japan", dates: "18–24, November" },
      { loc: "Amalfi Coast, Italy", dates: "12–18, September" }
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % spots.length;
      setLocationName(spots[idx].loc);
      setDateRange(spots[idx].dates);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleInitiate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    navigate(`/create-trip?destination=${encodeURIComponent(prompt)}`);
  };

  return (
    <Layout hideSidebar>
      <div
        className="min-h-screen relative flex flex-col justify-between text-white font-sans overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, rgba(10, 25, 47, 0.45) 0%, rgba(2, 6, 23, 0.85) 100%), url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-glow z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none animate-pulse-glow z-0" style={{ animationDelay: '-5s' }} />

        {/* Apple Vision Pro Glassmorphic Navigation Bar */}
        <header className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 py-6 flex justify-between items-center relative z-20">
          {/* Left links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase text-white/80">
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link to="/create-trip" className="hover:text-white transition-colors">Plan trip</Link>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
          </nav>

          {/* Centered Premium Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center select-none group cursor-pointer">
            <span
              className="text-2xl sm:text-3xl font-light tracking-wider text-white font-serif italic transition-all duration-500 group-hover:tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Odyssey
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-cyan-400 font-sans ml-1 transition-all duration-500 group-hover:scale-110 group-hover:text-cyan-300">X</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <Link to="/login">
              <button className="px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">
                Members portal
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg shadow-white/10">
                Become a member
              </button>
            </Link>
          </div>
        </header>

        {/* Central Immersive Copy (Grand regatta theme) */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 my-12">
          {/* Subtle connecting dashed line loop */}
          <div className="absolute w-[900px] h-[400px] rounded-full border border-dashed border-white/10 pointer-events-none hidden lg:block" style={{ top: "48%", left: "50%", transform: "translate(-50%, -50%)" }} />

          {/* Left Metadata Tag */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 text-white/70 text-[11px] font-semibold tracking-wider">
            <MapPin className="h-4.5 w-4.5 text-white/60 animate-bounce" style={{ animationDuration: '3s' }} />
            <span>{locationName}</span>
          </div>

          {/* Right Metadata Tag */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 text-white/70 text-[11px] font-semibold tracking-wider">
            <Calendar className="h-4.5 w-4.5 text-white/60" />
            <span>{dateRange}</span>
          </div>

          {/* Hero Typography Heading */}
          <div className="space-y-4 max-w-4xl animate-fade-in-up">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight leading-[1.1] text-white select-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Grand <span className="font-serif italic font-normal text-white">itineraries</span>.<br />
              <span className="font-sans font-black tracking-tighter uppercase text-[2.5rem] sm:text-[4.5rem] md:text-[5.5rem] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                Annual voyages
              </span><br />
              with <span className="font-serif italic font-normal text-white">intelligent routing</span><br />
              and top <span className="font-serif italic font-normal text-white">destinations</span>
            </h1>
          </div>

          {/* Conversational prompt input bar */}
          <div className="mt-12 w-full max-w-xl transition-all duration-500">
            {!showPromptBar ? (
              <button
                onClick={() => setShowPromptBar(true)}
                className="px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95 transition-all duration-300 flex items-center gap-2.5 mx-auto shadow-xl shadow-white/10"
              >
                Initiate Voyage
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <form
                onSubmit={handleInitiate}
                className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-2 rounded-full shadow-2xl flex items-center justify-between animate-fade-in-up focus-within:border-cyan-400/50 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Where is your mind traveling to?"
                  className="flex-1 bg-transparent px-5 py-2.5 text-xs text-white placeholder:text-white/50 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="h-10 px-5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center gap-1.5"
                >
                  Go
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </main>

        {/* About Section */}
        <section id="about" className="py-24 border-t border-white/5 relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 bg-black/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 space-y-6">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Our Philosophy</span>
              <h2 className="text-3xl sm:text-5xl font-light leading-tight font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bespoke planning. <span className="font-sans font-black tracking-tighter uppercase text-2xl sm:text-4xl text-white/90">Tailored voyages</span> for the modern explorer.
              </h2>
            </div>
            <div className="md:col-span-7 text-white/70 text-sm leading-relaxed space-y-6 font-medium">
              <p>
                OdysseyX was created to redefine how we plan and experience travel. By combining state-of-the-art conversational AI with live geospatial intelligence, we transform how destinations are researched, routed, and booked.
              </p>
              <p>
                We believe that every trip should feel like a custom-charted journey rather than a generic checklist. Through a minimalist spatial interface, OdysseyX maps out your days, suggests top-rated establishments, and provides coordinate-level routing precision.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 border-t border-white/5 relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="mb-16 text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Bespoke Offerings</span>
            <h2 className="text-3xl sm:text-5xl font-light font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Elite <span className="font-sans font-black tracking-tighter uppercase text-2xl sm:text-4xl text-white/90">services</span> for effortless journeys
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Precision Route Mapping",
                serif: "optimized",
                desc: "Our algorithms calculate the most efficient travel paths between your accommodation, dining selections, and sights, minimizing transit friction."
              },
              {
                title: "Google Places Sync",
                serif: "original",
                desc: "Access verified, live rating and review counts straight from Google Maps directly in your dashboard, explore feeds, and saved wishlist."
              },
              {
                title: "Conversational Copilot",
                serif: "personalized",
                desc: "An intelligent travel concierge stands by to curate plans, recommend fine dining, and customize your itinerary day-by-day."
              }
            ].map((serv, idx) => (
              <div key={idx} className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(6,182,212,0.08)] p-8 rounded-3xl transition-all duration-500 ease-out transform">
                <span className="text-white/30 text-xs font-mono font-bold block mb-4">0{idx + 1}</span>
                <h3 className="text-lg font-bold text-white mb-3">
                  {serv.title} <span className="font-serif italic font-light text-white/70">({serv.serif})</span>
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  {serv.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 relative z-20 bg-slate-950/20 backdrop-blur-sm">
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/50">
            OdysseyX · Intelligent Travel Control Deck
          </div>
          <div className="text-[10px] text-white/40">
            © {new Date().getFullYear()} OdysseyX. All rights reserved.
          </div>
        </footer>
      </div>
    </Layout>
  );
}
