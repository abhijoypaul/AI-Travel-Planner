import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TripMap } from '@/components/maps/TripMap'
import { DayTimeline } from '@/components/trip/DayTimeline'
import { tripAPI } from '@/services/api'
import { formatDate } from '@/lib/utils'

export function ShareTripPage() {
  const { token } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tripAPI.share(token).then((res) => setTrip(res.data)).catch(() => setTrip(null)).finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <Layout>
        <div className="page-container space-y-4 py-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    )
  }

  if (!trip) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="text-slate-400">Shared trip not found or link expired</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-container py-8">
        <Card className="mb-6 border-cyan-500/20 bg-cyan-500/10">
          <CardContent className="p-4 text-center text-sm text-cyan-300">
            Shared trip itinerary · View only
          </CardContent>
        </Card>
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
          <MapPin className="h-8 w-8 text-cyan-400" /> {trip.destination}
        </h1>
        <p className="mb-8 text-slate-400">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} · {trip.travelers} travelers
        </p>
        <TripMap trip={trip} className="mb-8" />
        <div className="space-y-4">
          {(trip.itinerary || []).map((day) => (
            <DayTimeline key={day.day} day={day} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
