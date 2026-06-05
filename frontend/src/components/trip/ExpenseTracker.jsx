import { useState } from 'react'
import { Plus, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { tripAPI } from '@/services/api'

export function ExpenseTracker({ trip, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', category: 'food' })
  const [loading, setLoading] = useState(false)

  const total = (trip.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0)
  const budget = trip.budget || trip.estimatedBudget?.total || 0

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await tripAPI.addExpense(trip._id, {
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
      })
      onUpdate?.(data)
      setForm({ description: '', amount: '', category: 'food' })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" /> Expense Tracker
        </CardTitle>
        <Button size="sm" variant="outline" className="h-8 border-slate-300 text-slate-700 font-bold" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="mb-4 flex justify-between text-sm text-slate-800 font-bold">
          <span>Spent: <strong className="text-rose-600">{formatCurrency(total)}</strong></span>
          <span>Budget: <strong className="text-slate-900">{formatCurrency(budget)}</strong></span>
          <span>Remaining: <strong className="text-emerald-600">{formatCurrency(budget - total)}</strong></span>
        </div>
        <div className="mb-4 h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
            style={{ width: `${Math.min(100, (total / budget) * 100)}%` }}
          />
        </div>
        {showForm && (
          <form onSubmit={handleAdd} className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <Label className="text-slate-800 font-bold text-xs mb-1 block">Description</Label>
              <Input className="bg-white border-slate-250 text-slate-800 font-medium" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <Label className="text-slate-800 font-bold text-xs mb-1 block">Amount ($)</Label>
              <Input type="number" className="bg-white border-slate-250 text-slate-800 font-medium" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <Button type="submit" size="sm" className="w-full bg-indigo-650 text-white font-bold" disabled={loading}>{loading ? 'Adding...' : 'Save Expense'}</Button>
          </form>
        )}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(trip.expenses || []).map((exp) => (
            <div key={exp._id} className="flex justify-between border-b border-slate-100 py-1.5 text-sm text-slate-800 font-bold">
              <span>{exp.description} <span className="text-slate-500 font-medium text-xs">({exp.category})</span></span>
              <span className="font-bold text-slate-900">{formatCurrency(exp.amount)}</span>
            </div>
          ))}
          {!trip.expenses?.length && <p className="text-sm text-slate-650 py-4 text-center font-medium">No expenses tracked yet</p>}
        </div>
      </CardContent>
    </Card>
  )
}
