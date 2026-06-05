import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Compass,
  Ticket,
  MessageSquare,
  Bookmark,
  CalendarDays,
  Settings,
  Plane,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'Trips', path: '/trips' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Ticket, label: 'Bookings', path: '/bookings' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: Bookmark, label: 'Saved Places', path: '/saved' },
]

const bottomMenuItems = [
  { icon: CalendarDays, label: 'Itinerary', path: '/itinerary' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/dashboard' && location.pathname.startsWith('/trip'))

  return (
    <aside className="sidebar-gradient flex h-full w-[260px] flex-col p-5 text-white/70 overflow-y-auto hide-scrollbar">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg">
          <Plane className="h-5 w-5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-normal text-white flex items-center gap-1">
          <span>Wander</span>
          <span className="font-light opacity-80">AI</span>
        </span>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                  active ? 'text-white' : 'text-white/60 group-hover:text-white'
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-white/10" />

      {/* Bottom Menu */}
      <div className="space-y-1 mb-4">
        {bottomMenuItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                  active ? 'text-white' : 'text-white/60 group-hover:text-white'
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Promotion Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10">
        {/* Background decorations */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-violet-400/20 blur-xl" />

        {/* Icon */}
        <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Plane className="h-5 w-5 text-white fill-white" />
        </div>

        <div className="relative z-10">
          <h4 className="text-sm font-bold text-white mb-1 leading-snug">
            Plan your next adventure
          </h4>
          <p className="text-[11px] text-white/60 mb-4 leading-relaxed">
            Let AI craft the perfect itinerary for you
          </p>
          <Link to="/create-trip">
            <button className="w-full flex items-center justify-center gap-1.5 bg-white text-[#6366f1] hover:bg-slate-50 font-semibold rounded-xl py-2.5 text-xs shadow-sm transition-all duration-200 hover:shadow-md">
              <Plus className="h-3.5 w-3.5" />
              New Trip
            </button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
