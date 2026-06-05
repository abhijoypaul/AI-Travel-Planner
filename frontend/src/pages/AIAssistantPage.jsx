import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, Plane, MapPin, Calendar, DollarSign } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const QUICK_PROMPTS = [
  { icon: Plane, text: "Best time to visit Japan?" },
  { icon: MapPin, text: "Hidden gems in Paris" },
  { icon: Calendar, text: "Plan a 7-day Italy itinerary" },
  { icon: DollarSign, text: "Budget travel tips for Europe" },
];

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content:
      "👋 Hi! I'm your AI travel assistant. I can help you plan trips, discover destinations, find the best time to visit places, suggest activities, and much more. What would you like to explore?",
  },
];

// Simple local AI simulation (no trip context needed for general assistant)
function simulateReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("japan") || lower.includes("tokyo"))
    return "🇯🇵 Japan is an amazing destination! The best time to visit is spring (March–May) for cherry blossoms or autumn (October–November) for fall foliage. Tokyo, Kyoto, and Osaka are must-visits. Would you like me to build a detailed itinerary?";
  if (lower.includes("paris") || lower.includes("france"))
    return "🗼 Paris is magical! Beyond the Eiffel Tower and Louvre, explore Montmartre, the Marais, and Sainte-Chapelle. I'd recommend visiting in May or September to avoid peak crowds. Shall I create a Paris itinerary for you?";
  if (lower.includes("italy"))
    return "🇮🇹 Italy is a dream destination! Rome, Florence, Venice, and the Amalfi Coast are iconic. A 7-day trip could cover Rome (3 days) → Florence (2 days) → Venice (2 days). Want me to plan this in detail?";
  if (lower.includes("budget") || lower.includes("cheap"))
    return "💡 For budget travel: book flights 2–3 months ahead, use city passes for attractions, stay in boutique hotels outside city centers, eat at local markets and trattorias, and travel in shoulder seasons (April–May or Sept–Oct).";
  if (lower.includes("beach"))
    return "🏖️ Top beach destinations: Maldives (crystal-clear lagoons), Santorini (volcanic beaches), Bali (surf + temples), Seychelles (secluded coves), and the Amalfi Coast (dramatic cliffs). Which region interests you?";
  return `✈️ Great question about "${message}"! As your AI travel companion, I can help plan itineraries, suggest destinations, estimate budgets, and find hidden gems. Go to **Create Trip** to generate a full AI itinerary, or ask me anything specific!`;
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    setMessages((prev) => [...prev, { role: "assistant", content: simulateReply(msg) }]);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up h-full flex flex-col" style={{ maxHeight: "calc(100vh - 7rem)" }}>
        {/* Header */}
        <div className="mb-5 flex-shrink-0">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Your companion</p>
          <h1 className="text-2xl font-bold text-slate-900">AI Travel Assistant</h1>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Chat Panel */}
          <div className="flex-1 wander-card flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-sm"
                        : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-5 pb-2 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    onClick={() => send(text)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-100 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about destinations, budgets, itineraries..."
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar hints */}
          <div className="w-64 space-y-4 flex-shrink-0 hidden lg:block">
            <div className="wander-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-bold text-slate-800">Try asking about</p>
              </div>
              <ul className="space-y-2">
                {[
                  "🏖️ Best beach destinations",
                  "💰 Budget planning tips",
                  "🗓️ Ideal trip durations",
                  "📸 Photography spots",
                  "🍜 Local food to try",
                  "🚆 Getting around by train",
                  "🌍 Hidden gem countries",
                  "🎒 What to pack",
                ].map((hint) => (
                  <li key={hint}>
                    <button
                      onClick={() => send(hint.replace(/^[^\w]+/, ""))}
                      className="text-xs text-slate-600 hover:text-indigo-600 transition-colors text-left w-full"
                    >
                      {hint}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Sparkles className="h-5 w-5 mb-2" />
              <p className="text-sm font-bold mb-1">Ready to plan?</p>
              <p className="text-[11px] text-indigo-100 mb-3">Let AI generate a complete itinerary for any destination.</p>
              <a href="/create-trip">
                <button className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  Generate Itinerary
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
