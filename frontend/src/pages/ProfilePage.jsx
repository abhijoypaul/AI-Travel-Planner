import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Settings, MapPin, Trash2, Calendar, ChevronRight } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthContext'
import { authAPI, tripAPI } from '@/services/api'
import { formatDate } from '@/lib/utils'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const [trips, setTrips] = useState([])
  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.settings?.currency || 'USD')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    tripAPI.getAll().then((res) => setTrips(res.data))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await authAPI.updateProfile({ name, settings: { currency } })
      setUser(data)
      setMessage('Profile updated successfully')
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDeleteTrip = async (id) => {
    if (!confirm('Delete this trip?')) return
    await tripAPI.delete(id)
    setTrips((prev) => prev.filter((t) => t._id !== id))
  }

  return (
    <Layout>
      <div className="py-6 max-w-4xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Account</p>
          <h1 className="text-2xl font-bold text-slate-900">Profile &amp; Settings</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* User Info Card */}
          <div className="wander-card p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900">User Information</h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  value={user?.email}
                  disabled
                  className="input-field opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="wander-card p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <Settings className="h-5 w-5 text-violet-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Settings</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Preferred Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input-field appearance-none"
                  style={{ backgroundImage: "none" }}
                >
                  {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full h-10 rounded-xl text-sm font-bold flex items-center justify-center disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              {message && (
                <p className={`text-sm font-semibold text-center ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Saved Trips */}
        <div className="wander-card p-6 mt-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Saved Trips{' '}
              <span className="text-slate-400 font-medium">({trips.length})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <Link
                      to={`/trip/${trip._id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {trip.destination}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <p className="text-[11px] text-slate-500">
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </p>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-md capitalize">
                        {trip.travelStyle}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link to={`/trip/${trip._id}`}>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteTrip(trip._id)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {!trips.length && (
              <div className="py-10 text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-sm">No saved trips yet</p>
                <p className="text-slate-400 text-xs mt-1">
                  <Link to="/create-trip" className="text-indigo-600 hover:underline">
                    Create your first trip
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
