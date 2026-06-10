import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Plane className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Odyssey<span className="font-light text-slate-500">X</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Plan your perfect trip with AI-powered itineraries, interactive maps, and smart recommendations.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/create-trip" className="hover:text-indigo-600 transition-colors">Plan a Trip</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Account</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 transition-colors">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} OdysseyX. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
