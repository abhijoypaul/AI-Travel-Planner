import { MapPin, Utensils, Hotel, Star, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getHotelBookingUrl } from '@/lib/booking'

function PlaceCard({ place, icon: Icon, color, onSelect, destination, startDate, endDate, travelers }) {
  const isHotel = Icon === Hotel

  return (
    <div
      className="flex flex-col w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-indigo-200"
    >
      <div 
        className="flex w-full items-start gap-3 cursor-pointer" 
        onClick={() => onSelect?.(place)}
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
                {(place.reviewCount !== undefined && place.reviewCount !== null) ? (
                  <span className="ml-1 text-[10px] text-slate-500 font-normal">
                    ({place.reviewCount >= 1000 ? (place.reviewCount / 1000).toFixed(1).replace(/\.0$/, "") + "k" : place.reviewCount})
                  </span>
                ) : place.reviews ? (
                  <span className="ml-1 text-[10px] text-slate-500 font-normal">({place.reviews})</span>
                ) : null}
              </Badge>
            )}
            {place.score && <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-850 font-bold border-indigo-100">Score: {(place.score * 105).toFixed(0)}</Badge>}
          </div>
        </div>
      </div>

      {/* Booking options for hotel recommendations */}
      {isHotel && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-1">Book:</span>
          <a
            href={getHotelBookingUrl(place.name, destination, startDate, endDate, travelers, 'booking')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            Booking.com
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href={getHotelBookingUrl(place.name, destination, startDate, endDate, travelers, 'makemytrip')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors"
          >
            MakeMyTrip
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href={getHotelBookingUrl(place.name, destination, startDate, endDate, travelers, 'goibibo')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-colors"
          >
            Goibibo
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      )}
    </div>
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
              <PlaceCard 
                key={i} 
                place={place} 
                icon={section.icon} 
                color={section.color} 
                onSelect={(loc) => onLocationSelect?.(loc, 'recommendations')}
                destination={trip.destination}
                startDate={trip.startDate}
                endDate={trip.endDate}
                travelers={trip.travelers}
              />
            ))}
            {!section.items?.length && <p className="text-sm text-slate-700 py-4 text-center font-medium">No recommendations</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
