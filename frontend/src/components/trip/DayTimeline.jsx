import { MapPin, Utensils, Hotel, Clock, DollarSign, ExternalLink, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { getHotelBookingUrl } from '@/lib/booking'

function parseTime(timeStr) {
  if (!timeStr) return 9999; // Put items without time at the end
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 9999;
  let [_, hours, minutes, ampm] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const TYPE_CONFIGS = {
  attraction: {
    icon: MapPin,
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    dotColor: "border-indigo-500 bg-white text-indigo-600 ring-indigo-100",
    cardBorder: "hover:border-indigo-300"
  },
  restaurant: {
    icon: Utensils,
    badgeBg: "bg-orange-50 text-orange-700 border-orange-100",
    dotColor: "border-orange-500 bg-white text-orange-600 ring-orange-100",
    cardBorder: "hover:border-orange-300"
  },
  hotel: {
    icon: Hotel,
    badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
    dotColor: "border-purple-500 bg-white text-purple-600 ring-purple-100",
    cardBorder: "hover:border-purple-300"
  }
};

export function DayTimeline({ day, currency, onLocationSelect, selectedLocation, destination, travelers }) {
  // Merge and sort attractions, restaurants, and hotels by their planned time
  const allPlaces = [
    ...(day.attractions || []).map(item => ({ ...item, type: 'attraction' })),
    ...(day.restaurants || []).map(item => ({ ...item, type: 'restaurant' })),
    ...(day.hotels || []).map(item => ({ ...item, type: 'hotel' }))
  ].sort((a, b) => parseTime(a.time) - parseTime(b.time));

  return (
    <Card className="overflow-hidden border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      {/* Day Header */}
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
          {day.travelTime && <Badge variant="outline" className="border-slate-300 text-slate-655 font-bold">{day.travelTime}</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-5 bg-white">
        {/* Daily Schedule Notes */}
        {day.activities?.length > 0 && (
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60">
            <h4 className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Day Schedule Highlights</h4>
            <div className="space-y-2">
              {day.activities.map((a, i) => (
                <p key={i} className="text-xs font-bold text-slate-750 leading-relaxed flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{a}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Humanized Chronological Timeline */}
        {allPlaces.length > 0 ? (
          <div className="relative pl-6 border-l border-slate-150 space-y-6 ml-3 py-1">
            {allPlaces.map((item, i) => {
              const config = TYPE_CONFIGS[item.type] || TYPE_CONFIGS.attraction;
              const Icon = config.icon;
              const isSelected = selectedLocation?.name === item.name;
              const placeId = `place-${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'))}`;

              return (
                <div key={i} id={placeId} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className={`absolute -left-[31px] top-4 h-4.5 w-4.5 rounded-full border-2 ring-4 flex items-center justify-center transition-all duration-300 ${config.dotColor} ${
                    isSelected ? 'scale-110 shadow' : 'group-hover:scale-105'
                  }`} />

                  {/* Card Block */}
                  <div className={`flex flex-col w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-1 ring-indigo-500/25'
                      : `border-slate-150 bg-white ${config.cardBorder} hover:shadow-md hover:-translate-y-0.5`
                  }`}>
                    <div 
                      className="flex w-full items-start gap-3.5 cursor-pointer" 
                      onClick={() => onLocationSelect?.(item)}
                    >
                      {/* Icon */}
                      <div className={`rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-105 ${config.badgeBg} ${
                        isSelected ? 'ring-2 ring-indigo-500/50 ring-offset-1 ring-offset-transparent' : 'shadow-sm'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Info Panel */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${config.badgeBg}`}>
                            {item.type}
                          </span>
                          {item.time && (
                            <span className="text-xs font-extrabold text-slate-500 inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {item.time}
                            </span>
                          )}
                        </div>

                        <p className={`text-sm font-extrabold leading-snug truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {item.name}
                        </p>
                        
                        {item.address && (
                          <p className="text-xs text-slate-500 font-semibold truncate">
                            {item.address}
                          </p>
                        )}
                        
                        {/* Rating / Cost details */}
                        <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-slate-650">
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

                        {item.notes && (
                          <p className="text-xs text-slate-600 italic mt-2 border-l-2 border-slate-200 pl-2">
                            "{item.notes}"
                          </p>
                        )}
                      </div>

                      {/* Map Link Indicator */}
                      <div className={`p-1 rounded-lg transition-colors ${isSelected ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-650'}`}>
                        <MapPin className="h-4.5 w-4.5 shrink-0" />
                      </div>
                    </div>

                    {/* Booking tags for hotel items */}
                    {item.type === 'hotel' && (
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mr-1">
                          Book Stay:
                        </span>
                        <a
                          href={getHotelBookingUrl(item.name, destination, day.date, null, travelers, 'booking')}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100/60 hover:bg-blue-100 hover:border-blue-200 transition-all shadow-sm"
                        >
                          Booking.com
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={getHotelBookingUrl(item.name, destination, day.date, null, travelers, 'makemytrip')}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-100/60 hover:bg-red-100 hover:border-red-200 transition-all shadow-sm"
                        >
                          MakeMyTrip
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={getHotelBookingUrl(item.name, destination, day.date, null, travelers, 'goibibo')}
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
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-6 text-center">No timeline details mapped for today.</p>
        )}

        {/* Tips Summary */}
        {day.tips?.length > 0 && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-indigo-800">Travel Advice</p>
            <div className="space-y-2">
              {day.tips.map((tip, i) => (
                <p key={i} className="text-xs text-slate-800 font-bold leading-relaxed flex items-start gap-2">
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
