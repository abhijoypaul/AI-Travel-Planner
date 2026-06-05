import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { tripAPI } from '@/services/api'

export function ChatAssistant({ tripId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI travel assistant. Ask me anything about your trip!' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const { data } = await tripAPI.chat(tripId, userMsg)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[400px] border-slate-200">
      <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-violet-650" /> AI Travel Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 overflow-hidden p-4 pt-4 bg-white">
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && <Bot className="h-6 w-6 text-violet-650 flex-shrink-0 mt-1" />}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'border border-slate-200 bg-slate-50 text-slate-800 font-medium'}`}>
                {msg.content}
              </div>
              {msg.role === 'user' && <User className="h-6 w-6 shrink-0 text-indigo-600 mt-1" />}
            </div>
          ))}
          {loading && <p className="text-xs text-slate-600 font-bold animate-pulse pl-8">Thinking...</p>}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 pt-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip..."
            disabled={loading}
            className="bg-white border-slate-250 text-slate-805 font-medium rounded-xl h-10"
          />
          <Button type="submit" size="icon" className="h-10 w-10 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white shrink-0" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
