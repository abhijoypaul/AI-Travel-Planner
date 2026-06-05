import { MapPin, Utensils, Hotel, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

function LocationList({ items, icon: Icon, color, onSelect, selectedLocation }) {
  if (!items?.length) return null
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isSelected = selectedLocation?.name === item.name
        return (
          <button
            key={i}
            onClick={() => onSelect?.(item)}
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
              isSelected
                ? 'border-indigo-500/40 bg-indigo-50/60 ring-1 ring-indigo-500/30 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50'
            }`}
          >
            <div className={`mt-0.5 rounded-lg p-1.5 ${color} ${isSelected ? 'ring-2 ring-indigo-500/50 ring-offset-1 ring-offset-transparent' : ''}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className={`truncate text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {item.name}
                </p>
                {isSelected && (
                  <span className="shrink-0 rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                    on map
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-slate-700 font-medium">{item.address}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-700 font-semibold">
                {item.time && (
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock className="h-3 w-3 text-slate-500" />{item.time}
                  </span>
                )}
                {item.estimatedCost > 0 && (
                  <span className="flex items-center gap-1 text-slate-700">
                    <DollarSign className="h-3 w-3 text-slate-500" />{formatCurrency(item.estimatedCost)}
                  </span>
                )}
                {item.rating && <span className="text-slate-700">⭐ {item.rating}</span>}
              </div>
            </div>
            <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
          </button>
        )
      })}
    </div>
  )
}

export function DayTimeline({ day, onLocationSelect, selectedLocation }) {
  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 font-bold">Day {day.day}: {day.title || day.date}</CardTitle>
          <div className="flex gap-2">
            {day.estimatedCost > 0 && <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-100">{formatCurrency(day.estimatedCost)}</Badge>}
            {day.travelTime && <Badge variant="outline" className="border-slate-300 text-slate-700 font-semibold">{day.travelTime}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 bg-white">
        {day.activities?.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-800">Activities</h4>
            <ul className="space-y-1.5">
              {day.activities.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                  <span className="mt-0.5 text-indigo-600">•</span> {a}
                </li>
              ))}
            </ul>
          </div>
        )}
        <LocationList
          items={day.attractions}
          icon={MapPin}
          color="bg-indigo-50 text-indigo-600"
          onSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
        <LocationList
          items={day.restaurants}
          icon={Utensils}
          color="bg-orange-50 text-orange-600"
          onSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
        <LocationList
          items={day.hotels}
          icon={Hotel}
          color="bg-violet-50 text-violet-600"
          onSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
        {day.tips?.length > 0 && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-850">Tips</p>
            {day.tips.map((tip, i) => (
              <p key={i} className="text-xs text-slate-850 font-bold">• {tip}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
