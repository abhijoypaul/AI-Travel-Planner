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
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import logoVideo from '@/assets/logo.mp4'

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

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/dashboard' && location.pathname.startsWith('/trip'))

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "sidebar-gradient flex h-screen max-h-screen min-h-0 w-[260px] flex-col p-5 text-white/70 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out",
          "fixed top-0 bottom-0 left-0 z-50 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg">
              <video
                src={logoVideo}
                autoPlay
                loop
                muted
                playsInline
                className="h-10 w-10 object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-normal text-white flex items-center gap-1">
              <span>Odyssey</span>
              <span className="font-light opacity-80">X</span>
            </span>
          </div>
          {/* Close Button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
  </>
  )
}
