import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Orbit, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const PUBLIC_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Core Intelligence' },
  { href: '#designed-for', label: 'Designed For' },
  { href: '#why-voyager', label: 'Why VoyagerAI' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const appLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/create-trip', label: 'Plan Trip' },
        { to: '/profile', label: 'Profile' },
      ]
    : []

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md glow-pulse" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
              <Orbit className="h-5 w-5" />
            </span>
          </span>
          <span className="text-lg font-bold tracking-normal text-white flex items-center gap-1">
            <span>Voyager</span>
            <span className="text-cyan-400 font-light">AI</span>
          </span>
        </Link>

        {isHome && !user && (
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {PUBLIC_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {appLinks.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link rounded-lg px-3 py-2 hover:bg-white/5">
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" className="ml-1" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#060912]/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          {isHome && !user && PUBLIC_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2.5 text-slate-400 hover:text-cyan-300"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {appLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2.5 text-slate-400 hover:text-cyan-300"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" className="mt-3 w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
