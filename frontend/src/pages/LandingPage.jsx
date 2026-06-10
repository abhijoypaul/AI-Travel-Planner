import { Link } from 'react-router-dom'
import { Map, Sparkles, Route, Star, ArrowRight, Play, Users, Briefcase, Heart } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { PexelsImage } from '@/components/ui/PexelsImage'
import { useState, useEffect } from 'react'

const features = [
  { icon: Sparkles, title: 'AI-Powered Itineraries', desc: 'GPT-4 builds personalized day-by-day plans from your preferences, budget, and travel style.' },
  { icon: Map, title: 'Live Map Intelligence', desc: 'Visualize attractions, restaurants, and hotels with optimized routes and real-time focus.' },
  { icon: Route, title: 'Smart Route Optimization', desc: 'Best paths between locations with travel time estimates and one-click map focus.' },
  { icon: Star, title: 'Curated Recommendations', desc: 'Ranked picks using ratings, reviews, distance, and popularity — all in one view.' },
]

const steps = [
  { step: '1', title: 'Share Your Vision', desc: 'Destination, dates, budget, style, and interests.' },
  { step: '2', title: 'AI Builds Your Plan', desc: 'Full itinerary with attractions, dining, and stays.' },
  { step: '3', title: 'Explore on the Map', desc: 'Interactive routes and place-by-place discovery.' },
  { step: '4', title: 'Travel & Track', desc: 'Save, share, export PDF, and manage expenses.' },
]

const audiences = [
  { icon: Users, title: 'Families', desc: 'Balanced days with kid-friendly stops and realistic pacing.' },
  { icon: Briefcase, title: 'Solo explorers', desc: 'Adventure-first routes and hidden gems off the beaten path.' },
  { icon: Heart, title: 'Couples', desc: 'Romantic evenings, scenic views, and memorable dining.' },
]

const testimonials = [
  { name: 'Sarah M.', trip: 'Paris, France', text: 'The AI planned an incredible 5-day Paris itinerary. Every restaurant was a hit!', initials: 'SM' },
  { name: 'James L.', trip: 'Tokyo, Japan', text: 'Route optimization saved us hours. The map integration is seamless.', initials: 'JL' },
  { name: 'Emily R.', trip: 'Bali, Indonesia', text: 'Best travel planner I\'ve used. The budget breakdown was spot on.', initials: 'ER' },
]

export function LandingPage() {
  const [bgUrl, setBgUrl] = useState("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${API_URL}/utility/place-photo?name=scenic%20stars%20mountains`)
      .then(res => res.json())
      .then(data => {
        if (data.url) setBgUrl(data.url);
      })
      .catch(err => console.error("Failed to fetch landing background:", err));
  }, []);

  return (
    <Layout hideSidebar>
      <div 
        className="min-h-screen text-slate-100 relative overflow-hidden" 
        style={{
          background: `linear-gradient(180deg, rgba(10, 15, 30, 0.9) 0%, rgba(15, 23, 42, 0.96) 100%), url('${bgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
          <div className="orbit-ring hidden sm:block" />
          <div className="page-container relative text-center">
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
              Your personal AI that plans your trip —{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">effortlessly.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 drop-shadow-sm font-medium">
              OdysseyX organizes your itinerary, maps your routes, and keeps every detail
              in one calm, intelligent workspace — so you can focus on the journey.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="w-full min-w-[200px] sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20">
                  Start Free <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>

            <DashboardPreview />
          </div>
        </section>

        {/* Gallery of Beautiful Places */}
        <section className="py-12 bg-black/10">
          <div className="page-container">
            <div className="mb-10 text-center">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300 uppercase tracking-widest">
                Visual Voyage
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">Explore the World's Wonders</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Mount Fuji, Japan", url: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=800", desc: "Majestic volcanic peak" },
                { title: "Northern Lights, Iceland", url: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&q=80&w=800", desc: "Dancing aurora borealis" },
                { title: "Al Khazneh, Petra", url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800", desc: "Ancient rose-red city" },
                { title: "Machu Picchu, Peru", url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=800", desc: "Historic Incan citadel" }
              ].map((place, idx) => (
                <div key={idx} className="relative group h-64 overflow-hidden rounded-2xl border border-white/10 shadow-md">
                  <PexelsImage 
                    query={place.title}
                    fallbackUrl={place.url}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <p className="text-sm font-bold text-white leading-tight">{place.title}</p>
                    <p className="text-[11px] text-cyan-300 font-semibold mt-1">{place.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features (Core Intelligence) */}
        <section id="features" className="relative py-20 bg-black/20">
          <div className="page-container">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-white">Core Intelligence</h2>
              <p className="mt-3 text-slate-300 max-w-xl mx-auto font-medium">
                Everything you need to travel smarter — powered by AI and live maps.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <Card key={f.title} className="group border-white/10 glass-panel-dark hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.06)] transition-all">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-bold text-white text-base">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-300 font-medium">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative py-20 bg-black/10">
          <div className="page-container">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
              <p className="mt-3 text-slate-300 max-w-xl mx-auto font-medium">Four steps from dream destination to ready-to-go itinerary</p>
            </div>
            <div className="relative grid gap-8 md:grid-cols-4">
              <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent md:block" />
              {steps.map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-lg font-bold text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-bold text-white text-sm">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Designed for every traveler */}
        <section id="designed-for" className="relative py-20 bg-black/20">
          <div className="page-container">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-white">Designed for Every Traveler</h2>
              <p className="mt-3 text-slate-300 max-w-xl mx-auto font-medium">Tailored pacing and recommendations for how you explore</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map((a) => (
                <Card key={a.title} className="text-center border-white/10 glass-panel-dark hover:border-cyan-500/20 transition-colors">
                  <CardContent className="p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <a.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{a.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{a.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative border-t border-white/5 py-10 bg-slate-950/80">
          <div className="page-container text-center text-xs text-slate-450 font-medium">
            © {new Date().getFullYear()} OdysseyX. All rights reserved.
          </div>
        </footer>
      </div>
    </Layout>
  )
}
