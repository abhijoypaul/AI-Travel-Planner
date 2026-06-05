import { CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { tripAPI } from '@/services/api'

export function ChecklistWidget({ trip, onUpdate }) {
  const toggleItem = async (item) => {
    try {
      const { data } = await tripAPI.toggleChecklist(trip._id, item._id, !item.completed)
      onUpdate?.(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-indigo-650" /> Travel Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="space-y-2.5">
          {(trip.checklist || []).map((item) => (
            <label key={item._id} className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item)} />
              <span className={`text-sm font-bold ${item.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                {item.item}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
