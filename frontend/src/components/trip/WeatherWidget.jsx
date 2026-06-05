import { Cloud, Sun, CloudRain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const iconMap = {
  '01d': Sun, '01n': Sun, '02d': Cloud, '03d': Cloud, '04d': Cloud, '09d': CloudRain, '10d': CloudRain,
}

export function WeatherWidget({ weather = [] }) {
  if (!weather.length) return null

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Cloud className="h-4 w-4 text-cyan-600" /> Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {weather.map((day, i) => {
            const Icon = iconMap[day.icon] || Cloud
            return (
              <div key={i} className="min-w-[80px] flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-700 font-bold">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                <Icon className="mx-auto my-2 h-6 w-6 text-cyan-600 animate-bounce-slow" />
                <p className="font-bold text-slate-900">{day.temp}°C</p>
                <p className="text-xs text-slate-600 font-medium capitalize truncate">{day.description}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
