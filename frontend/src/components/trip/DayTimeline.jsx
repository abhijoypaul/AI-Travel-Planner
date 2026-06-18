import { MapPin, Utensils, Hotel, Clock, DollarSign, ExternalLink, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { getHotelBookingUrl } from '@/lib/booking'

function LocationList({ items, icon: Icon, color, onSelect, selectedLocation, currency, destination, dayDate, travelers }) {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isSelected = selectedLocation?.name === item.name
        const placeId = `place-${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'))}`
        const isHotel = Icon === Hotel

        return (
          <div
            id={placeId}
            key={i}
            className={`group flex flex-col w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50/40 shadow-md ring-1 ring-indigo-500/20'
                : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div 
              className="flex w-full items-start gap-3.5 cursor-pointer" 
              onClick={() => onSelect?.(item)}
            >
              {/* Icon Container */}
              <div className={`mt-0.5 rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-105 ${color} ${
                isSelected ? 'ring-2 ring-indigo-500/50 ring-offset-1 ring-offset-transparent' : 'shadow-sm'
              }`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Main Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-extrabold leading-snug truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {item.name}
                  </p>
                  {isSelected && (
                    <span className="shrink-0 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-indigo-600/10">
                      ON MAP
                    </span>
                  )}
                </div>
                
                {item.address && (
                  <p className="text-xs text-slate-500 font-semibold truncate">
                    {item.address}
                  </p>
                )}
                
                {/* Meta details (time, cost, rating) */}
                <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-bold text-slate-600">
                  {item.time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {item.time}
                    </span>
                  )}
                  {item.estimatedCost > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      {formatCurrency(item.estimatedCost, currency)}
                    </span>
                  )}
                  {item.rating && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px] border border-amber-100">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Map Locator Icon */}
              <div className={`mt-0.5 p-1 rounded-lg transition-colors ${isSelected ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-650'}`}>
                <MapPin className="h-4.5 w-4.5 shrink-0" />
              </div>
            </div>

            {/* Quick Booking Options for Hotels */}
            {isHotel && (
              <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                  Book Stay:
                </span>
                <a
                  href={getHotelBookingUrl(item.name, destination, dayDate, null, travelers, 'booking')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100/60 hover:bg-blue-100 hover:border-blue-200 transition-all shadow-sm"
                >
                  Booking.com
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={getHotelBookingUrl(item.name, destination, dayDate, null, travelers, 'makemytrip')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-100/60 hover:bg-red-100 hover:border-red-200 transition-all shadow-sm"
                >
                  MakeMyTrip
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={getHotelBookingUrl(item.name, destination, dayDate, null, travelers, 'goibibo')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-orange-50 text-orange-700 border border-orange-100/60 hover:bg-orange-100 hover:border-orange-200 transition-all shadow-sm"
                >
                  Goibibo
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function DayTimeline({ day, currency, onLocationSelect, selectedLocation, destination, travelers }) {
  return (
    <Card className="overflow-hidden border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shadow-indigo-600/20">
            {day.day}
          </div>
          <CardTitle className="text-slate-900 font-extrabold text-base leading-snug">{day.title || `Day ${day.day}`}</CardTitle>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {day.date && <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold border-slate-200">{day.date}</Badge>}
          {day.estimatedCost > 0 && <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-100 font-bold">{formatCurrency(day.estimatedCost, currency)}</Badge>}
          {day.travelTime && <Badge variant="outline" className="border-slate-300 text-slate-650 font-bold">{day.travelTime}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-5 bg-white">
        {/* Daily Activities Summary */}
        {day.activities?.length > 0 && (
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60">
            <h4 className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Activities Schedule</h4>
            <ul className="space-y-2.5">
              {day.activities.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-800 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" /> 
                  <span className="flex-1">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Places List (Attractions, Restaurants, Hotels) */}
        <div className="space-y-4">
          <LocationList
            items={day.attractions}
            icon={MapPin}
            color="bg-indigo-50 text-indigo-600 border border-indigo-100/40"
            onSelect={onLocationSelect}
            selectedLocation={selectedLocation}
            currency={currency}
            destination={destination}
            dayDate={day.date}
            travelers={travelers}
          />
          <LocationList
            items={day.restaurants}
            icon={Utensils}
            color="bg-orange-50 text-orange-600 border border-orange-100/40"
            onSelect={onLocationSelect}
            selectedLocation={selectedLocation}
            currency={currency}
            destination={destination}
            dayDate={day.date}
            travelers={travelers}
          />
          <LocationList
            items={day.hotels}
            icon={Hotel}
            color="bg-purple-50 text-purple-600 border border-purple-100/40"
            onSelect={onLocationSelect}
            selectedLocation={selectedLocation}
            currency={currency}
            destination={destination}
            dayDate={day.date}
            travelers={travelers}
          />
        </div>

        {/* Tips Summary */}
        {day.tips?.length > 0 && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-indigo-800">Insider Tips</p>
            <div className="space-y-2">
              {day.tips.map((tip, i) => (
                <p key={i} className="text-xs text-slate-850 font-bold leading-relaxed flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span className="flex-1">{tip}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
