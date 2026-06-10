import {
  LayoutDashboard, Map, Sparkles, Calendar, Search, Bell, Settings,
  MapPin, TrendingUp, Plane,
} from 'lucide-react'

export function DashboardPreview() {
  return (
    <div className="glass-panel-glow mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border-cyan-500/20">
      <div className="flex min-h-[320px] flex-col sm:min-h-[380px] sm:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-white/10 bg-black/30 p-4 sm:flex">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <Plane className="h-4 w-4 text-cyan-400" />
            </span>
            <span className="text-sm font-bold tracking-normal text-white flex items-center gap-0.5">
              <span>Odyssey</span>
              <span className="font-light opacity-80">X</span>
            </span>
          </div>
          <nav className="space-y-1 text-sm">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true },
              { icon: Sparkles, label: 'Trip Intelligence' },
              { icon: Map, label: 'Smart Routes' },
              { icon: Calendar, label: 'My Itineraries' },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
                  active
                    ? 'border border-cyan-500/25 bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500">Search destinations, trips…</span>
            </div>
            <Bell className="h-5 w-5 text-slate-500" />
            <Settings className="h-5 w-5 text-slate-500" />
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
              <span className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
              <span className="text-xs font-medium text-slate-300">Traveler</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Ready for your next adventure?
                  </p>
                  <p className="text-sm text-slate-400">
                    You have <span className="text-cyan-400">3 upcoming trips</span> this month
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Trips', value: '12', icon: Plane },
                  { label: 'Countries', value: '8', icon: MapPin },
                  { label: 'Saved', value: '24', icon: TrendingUp },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                  >
                    <Icon className="mx-auto mb-1 h-4 w-4 text-cyan-400/80" />
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full shrink-0 rounded-xl border border-white/10 bg-white/5 p-4 lg:w-44">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Insights
              </p>
              <p className="text-2xl font-bold text-white">
                89<span className="text-sm font-normal text-slate-500">/100</span>
              </p>
              <p className="mb-2 text-xs text-slate-500">Trip readiness score</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgb(34_211_238/0.5)]" />
              </div>
              <div className="mt-4 space-y-2">
                {['Paris · 5 days', 'Tokyo · 7 days'].map((t) => (
                  <div key={t} className="rounded-lg border border-white/5 bg-black/20 px-2 py-1.5 text-[10px] text-slate-400">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
