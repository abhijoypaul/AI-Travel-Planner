import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { utilityAPI } from '@/services/api'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'THB']

export function CurrencyConverter() {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState('100')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const convert = async () => {
    setLoading(true)
    try {
      const { data } = await utilityAPI.convertCurrency(from, to, amount)
      setResult(data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-violet-600" /> Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-800 font-bold text-xs mb-1 block">From</Label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-805 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-slate-800 font-bold text-xs mb-1 block">To</Label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-805 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label className="text-slate-800 font-bold text-xs mb-1 block">Amount</Label>
          <Input type="number" className="bg-white border-slate-250 text-slate-800 font-medium" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <Button onClick={convert} className="w-full bg-indigo-650 text-white font-bold" disabled={loading}>
          {loading ? 'Converting...' : 'Convert'}
        </Button>
        {result && (
          <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-violet-900">{result.converted?.toFixed(2)} {result.to}</p>
            <p className="text-xs text-slate-650 font-bold mt-1">Rate: 1 {result.from} = {result.rate?.toFixed(4)} {result.to}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
