import { Link } from 'react-router-dom'
import { Map, Sparkles, Route, Star, ArrowRight, Play, Users, Briefcase, Heart } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardPreview } from '@/components/landing/DashboardPreview'

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
  return (
    <Layout fullBleed hideFooter>
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-12 sm:pt-20">
        <div className="orbit-ring hidden sm:block" />
        <div className="page-container relative text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Your personal AI that plans your trip —{' '}
            <span className="text-gradient-cyan">effortlessly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            VoyagerAI organizes your itinerary, maps your routes, and keeps every detail
            in one calm, intelligent workspace — so you can focus on the journey.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="w-full min-w-[200px] sm:w-auto">
                Start Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/create-trip">
              <Button size="lg" variant="outline" className="w-full min-w-[200px] sm:w-auto">
                <Play className="h-5 w-5 fill-current" /> Watch Demo
              </Button>
            </Link>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="page-container">
          <div className="mb-14 text-center">
            <h2 className="section-heading">Core intelligence</h2>
            <p className="section-subheading mt-3">
              Everything you need to travel smarter — powered by AI and live maps.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="group border-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgb(34_211_238/0.08)]">
                <CardContent className="p-6">
                  <div className="icon-box-cyan mb-5 h-12 w-12">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-24">
        <div className="page-container">
          <div className="mb-14 text-center">
            <h2 className="section-heading">How it works</h2>
            <p className="section-subheading mt-3">Four steps from dream destination to ready-to-go itinerary</p>
          </div>
          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent md:block" />
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-lg font-bold text-cyan-300 shadow-[0_0_25px_rgb(34_211_238/0.2)]">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designed for */}
      <section id="designed-for" className="relative py-24">
        <div className="page-container">
          <div className="mb-14 text-center">
            <h2 className="section-heading">Designed for every traveler</h2>
            <p className="section-subheading mt-3">Tailored pacing and recommendations for how you explore</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {audiences.map((a) => (
              <Card key={a.title} className="text-center">
                <CardContent className="p-8">
                  <div className="icon-box-cyan mx-auto mb-4 h-14 w-14">
                    <a.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{a.title}</h3>
                  <p className="text-sm text-slate-400">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24">
        <div className="page-container">
          <div className="mb-14 text-center">
            <h2 className="section-heading">Loved by travelers</h2>
            <p className="section-subheading mt-3">Real stories from explorers around the world</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-6 leading-relaxed text-slate-300">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-slate-950">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-cyan-400">{t.trip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why VoyagerAI */}
      <section id="why-voyager" className="relative py-24">
        <div className="page-container">
          <Card className="glass-panel-glow overflow-hidden border-cyan-500/20">
            <CardContent className="px-6 py-16 text-center sm:px-12">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Why VoyagerAI?</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
                Calm, intelligent trip planning — no spreadsheets, no scattered tabs.
                One beautiful space for your entire journey.
              </p>
              <Link to="/register" className="mt-8 inline-block">
                <Button size="lg">
                  Create Free Account <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                {['Free to start', 'AI itineraries', 'Live maps', 'PDF export'].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgb(34_211_238/0.8)]" />
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="relative border-t border-white/5 py-8">
        <div className="page-container text-center text-sm text-slate-500">
          © {new Date().getFullYear()} VoyagerAI. All rights reserved.
        </div>
      </footer>
    </Layout>
  )
}
