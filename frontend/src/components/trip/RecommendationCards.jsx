import { MapPin, Utensils, Hotel, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function PlaceCard({ place, icon: Icon, color, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(place)}
      className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/20"
    >
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-slate-900 truncate">{place.name}</p>
        <p className="text-xs text-slate-700 font-medium truncate">{place.address}</p>
        <div className="mt-1 flex gap-2">
          {place.rating && (
            <Badge variant="outline" className="text-xs text-slate-750 font-bold border-slate-300">
              <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400 animate-pulse" />
              {place.rating}
            </Badge>
          )}
          {place.score && <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-850 font-bold border-indigo-100">Score: {(place.score * 100).toFixed(0)}</Badge>}
        </div>
      </div>
    </button>
  )
}

export function RecommendationCards({ trip, onLocationSelect }) {
  const sections = [
    { title: 'Top Attractions', items: trip.recommendedAttractions, icon: MapPin, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Top Restaurants', items: trip.recommendedRestaurants, icon: Utensils, color: 'bg-orange-50 text-orange-600' },
    { title: 'Top Hotels', items: trip.recommendedHotels, icon: Hotel, color: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <Card key={section.title} className="border-slate-200">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto pt-3 bg-white">
            {(section.items || []).slice(0, 10).map((place, i) => (
              <PlaceCard key={i} place={place} icon={section.icon} color={section.color} onSelect={onLocationSelect} />
            ))}
            {!section.items?.length && <p className="text-sm text-slate-700 py-4 text-center font-medium">No recommendations</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
