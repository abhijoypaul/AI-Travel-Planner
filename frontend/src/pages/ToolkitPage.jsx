import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  PhoneCall,
  Volume2,
  Info,
  Zap,
  Globe,
  Languages,
  TrendingUp,
  ArrowRightLeft,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { tripAPI } from "@/services/api";
import { useNotification } from "@/context/NotificationContext";

// ── Destination data ─────────────────────────────────────────────────────────
const DESTINATION_DATA = {
  france: {
    countryName: "France", langCode: "fr-FR", langName: "French",
    currency: "EUR", exchangeRate: 0.92, plugType: "C, E", voltage: "230 V / 50 Hz",
    emergency: "112 (European emergency number)", police: "17", medical: "15",
    visa: "Schengen Visa required (Visa-free for up to 90 days for US/UK/Canada citizens).",
    culture: [
      "Always greet shopkeepers with a polite 'Bonjour' or 'Bonsoir'.",
      "Table manners are important. Keep both hands on the table (not on your lap).",
      "Tipping is not obligatory; service charge (service compris) is included in the bill.",
    ],
    phrases: [
      { english: "Hello / Good day", local: "Bonjour", pronunciation: "bohn-zhoor" },
      { english: "Thank you", local: "Merci beaucoup", pronunciation: "mair-see boh-koo" },
      { english: "Please", local: "S'il vous plaît", pronunciation: "seel voo pleh" },
      { english: "Excuse me", local: "Excusez-moi", pronunciation: "ex-kew-zay mwah" },
      { english: "How much is this?", local: "C'est combien?", pronunciation: "say cohn-byan" },
      { english: "Where is the bathroom?", local: "Où sont les toilettes?", pronunciation: "oo sohn lay twah-let" },
      { english: "Do you speak English?", local: "Parlez-vous anglais?", pronunciation: "par-lay voo ahng-lay" },
      { english: "Help!", local: "Au secours!", pronunciation: "oh suh-koor" },
    ],
  },
  japan: {
    countryName: "Japan", langCode: "ja-JP", langName: "Japanese",
    currency: "JPY", exchangeRate: 156.40, plugType: "A, B", voltage: "100 V / 50-60 Hz",
    emergency: "110 (Police) / 119 (Ambulance/Fire)", police: "110", medical: "119",
    visa: "Visa-free entry for up to 90 days for tourist visits from 68 countries.",
    culture: [
      "Avoid eating or drinking while walking in public.",
      "Tipping is non-existent. Leaving extra money is considered confusing or rude.",
      "Bow slightly when greeting, and speak quietly in public transit.",
    ],
    phrases: [
      { english: "Hello / Good day", local: "こんにちは (Konnichiwa)", pronunciation: "kon-nee-chee-wah" },
      { english: "Thank you", local: "ありがとう (Arigatou)", pronunciation: "ah-ree-gah-toh" },
      { english: "Please", local: "お願いします (Onegashimasu)", pronunciation: "oh-neh-guy-shee-mas" },
      { english: "Excuse me", local: "すみません (Sumimasen)", pronunciation: "soo-mee-mah-sen" },
      { english: "How much is this?", local: "これはいくらですか (Kore wa ikura desu ka)", pronunciation: "koh-reh wah ee-koo-rah des kah" },
      { english: "Where is the bathroom?", local: "トイレはどこですか (Toire wa doko desu ka)", pronunciation: "toy-reh wah doh-koh des kah" },
      { english: "Do you speak English?", local: "英語が話せますか (Eigo ga hanasemasu ka)", pronunciation: "ay-goh gah hah-nah-seh-mas kah" },
      { english: "Help!", local: "助けて! (Tasukete!)", pronunciation: "tah-soo-keh-teh" },
    ],
  },
  india: {
    countryName: "India", langCode: "hi-IN", langName: "Hindi",
    currency: "INR", exchangeRate: 83.50, plugType: "C, D, M", voltage: "230 V / 50 Hz",
    emergency: "112 (National emergency number)", police: "100", medical: "102",
    visa: "e-Visa required for most international visitors before arrival.",
    culture: [
      "Remove your shoes before entering homes and places of worship.",
      "Use your right hand for eating, shaking hands, and passing items.",
      "Dress modestly, especially when visiting temples, mosques, or rural areas.",
    ],
    phrases: [
      { english: "Hello", local: "नमस्ते (Namaste)", pronunciation: "nuh-muh-stay" },
      { english: "Thank you", local: "धन्यवाद (Dhanyavaad)", pronunciation: "dhun-yuh-vaadh" },
      { english: "Please", local: "कृपया (Kripya)", pronunciation: "krip-yah" },
      { english: "Excuse me", local: "माफ़ कीजिए (Maaf keejiye)", pronunciation: "mahf kee-jee-yeh" },
      { english: "How much is this?", local: "यह कितने का है? (Yeh kitne ka hai?)", pronunciation: "yeh kit-nay kah hay" },
      { english: "Where is the bathroom?", local: "शौचालय कहाँ है? (Shauchalay kahan hai?)", pronunciation: "show-chah-lay kuh-haan hay" },
      { english: "Do you speak English?", local: "क्या आप अंग्रेज़ी बोलते हैं?", pronunciation: "kyah aap un-gray-zee bole-tay hain" },
      { english: "Help!", local: "मदद करो! (Madad karo!)", pronunciation: "muh-dudh kuh-roh" },
    ],
  },
  uk: {
    countryName: "United Kingdom", langCode: "en-GB", langName: "English",
    currency: "GBP", exchangeRate: 0.79, plugType: "G", voltage: "230 V / 50 Hz",
    emergency: "999 or 112", police: "999", medical: "999",
    visa: "Visa-free for citizens of EU, USA, Canada, Australia (up to 6 months).",
    culture: [
      "Queueing (standing in line) is respected strictly; never cut in line.",
      "Stand on the right side of escalators in the Underground (Tube).",
      "Say 'please', 'thank you', and 'sorry' frequently in social interactions.",
    ],
    phrases: [
      { english: "Hello", local: "Hello", pronunciation: "heh-loh" },
      { english: "Thank you", local: "Thank you", pronunciation: "thangk yoo" },
      { english: "Please", local: "Please", pronunciation: "pleez" },
      { english: "Excuse me", local: "Excuse me", pronunciation: "ik-skyooz mee" },
      { english: "How much is this?", local: "How much is this?", pronunciation: "how muhch iz this" },
      { english: "Where is the bathroom?", local: "Where is the toilet?", pronunciation: "wair iz the toy-lit" },
      { english: "Do you speak English?", local: "Do you speak English?", pronunciation: "doo yoo speek ing-glish" },
      { english: "Help!", local: "Help!", pronunciation: "help" },
    ],
  },
  usa: {
    countryName: "United States", langCode: "en-US", langName: "English",
    currency: "USD", exchangeRate: 1.0, plugType: "A, B", voltage: "120 V / 60 Hz",
    emergency: "911", police: "911", medical: "911",
    visa: "ESTA required for Visa Waiver Program countries; visitor visa otherwise.",
    culture: [
      "Tipping 15% to 20% in sit-down restaurants is customary and expected.",
      "Always respect personal physical space during conversations.",
      "Prices shown usually exclude sales tax, which is added at checkout.",
    ],
    phrases: [
      { english: "Hello", local: "Hello", pronunciation: "heh-loh" },
      { english: "Thank you", local: "Thank you", pronunciation: "thangk yoo" },
      { english: "Please", local: "Please", pronunciation: "pleez" },
      { english: "Excuse me", local: "Excuse me", pronunciation: "ik-skyooz mee" },
      { english: "How much is this?", local: "How much is this?", pronunciation: "how-muhch-iz-this" },
      { english: "Where is the bathroom?", local: "Where is the restroom?", pronunciation: "wair-iz-the-res-troom" },
      { english: "Do you speak English?", local: "Do you speak English?", pronunciation: "doo-yoo-speek-ing-glish" },
      { english: "Help!", local: "Help!", pronunciation: "help" },
    ],
  },
  spain: {
    countryName: "Spain", langCode: "es-ES", langName: "Spanish",
    currency: "EUR", exchangeRate: 0.92, plugType: "C, F", voltage: "230 V / 50 Hz",
    emergency: "112", police: "112", medical: "112",
    visa: "Schengen Visa rules apply.",
    culture: [
      "Mealtimes are later than average: lunch from 2–4 PM, dinner from 9–11 PM.",
      "Many small shops close for a 'siesta' from around 2 PM to 5 PM.",
      "Greetings often involve a friendly 'Hola' and two light cheek-kisses among acquaintances.",
    ],
    phrases: [
      { english: "Hello", local: "Hola", pronunciation: "oh-lah" },
      { english: "Thank you", local: "Gracias", pronunciation: "grah-syahs" },
      { english: "Please", local: "Por favor", pronunciation: "por fah-vor" },
      { english: "Excuse me", local: "Perdone", pronunciation: "pair-doh-neh" },
      { english: "How much is this?", local: "¿Cuánto cuesta esto?", pronunciation: "kwan-toh kwes-tah es-toh" },
      { english: "Where is the bathroom?", local: "¿Dónde está el baño?", pronunciation: "dohn-deh es-tah el bah-nyoh" },
      { english: "Do you speak English?", local: "¿Habla inglés?", pronunciation: "ah-blah een-glehs" },
      { english: "Help!", local: "¡Ayuda!", pronunciation: "ah-yoo-dah" },
    ],
  },
  italy: {
    countryName: "Italy", langCode: "it-IT", langName: "Italian",
    currency: "EUR", exchangeRate: 0.92, plugType: "C, F, L", voltage: "230 V / 50 Hz",
    emergency: "112", police: "112", medical: "112",
    visa: "Schengen Visa rules apply.",
    culture: [
      "Only order cappuccinos in the morning; ordering one after a meal is non-traditional.",
      "Cover your shoulders and knees when entering churches or cathedrals.",
      "Say 'Buongiorno' (morning) or 'Buonasera' (afternoon/evening) to show respect.",
    ],
    phrases: [
      { english: "Hello", local: "Ciao", pronunciation: "chow" },
      { english: "Thank you", local: "Grazie", pronunciation: "grah-tsee-eh" },
      { english: "Please", local: "Per favore", pronunciation: "pair fah-voh-reh" },
      { english: "Excuse me", local: "Mi scusi", pronunciation: "mee skoo-zee" },
      { english: "How much is this?", local: "Quanto costa questo?", pronunciation: "kwan-toh kos-tah kwes-toh" },
      { english: "Where is the bathroom?", local: "Dov'è il bagno?", pronunciation: "doh-veh eel bah-nyoh" },
      { english: "Do you speak English?", local: "Parla inglese?", pronunciation: "par-lah een-gleh-zeh" },
      { english: "Help!", local: "Aiuto!", pronunciation: "ah-yoo-toh" },
    ],
  },
  thailand: {
    countryName: "Thailand", langCode: "th-TH", langName: "Thai",
    currency: "THB", exchangeRate: 36.70, plugType: "A, B, C, O", voltage: "220 V / 50 Hz",
    emergency: "191 (Police) / 1669 (Medical)", police: "191", medical: "1669",
    visa: "Visa-free entry or Visa on Arrival available for many citizenships.",
    culture: [
      "Never touch anyone's head; it is considered the most sacred part of the body.",
      "Never point your feet at people, images of the King, or religious icons.",
      "Press your palms together at chest level ('Wai') to greet others politely.",
    ],
    phrases: [
      { english: "Hello", local: "สวัสดี (Sawasdee - krap/ka)", pronunciation: "sah-wahd-dee (krub/kah)" },
      { english: "Thank you", local: "ขอบคุณ (Khob khun)", pronunciation: "khob-khoon (krub/kah)" },
      { english: "Please", local: "กรุณา (Karuna)", pronunciation: "kah-roo-nah" },
      { english: "Excuse me", local: "ขอโทษ (Kho thot)", pronunciation: "khor-thoht" },
      { english: "How much is this?", local: "นี่เท่าไหร่ (Nee tao rai?)", pronunciation: "nee-tao-rye" },
      { english: "Where is the bathroom?", local: "ห้องน้ำอยู่ที่ไหน (Hong nam yoo tee nai?)", pronunciation: "hong-nahm yoo tee-nye" },
      { english: "Do you speak English?", local: "พูดภาษาอังกฤษได้ไหม", pronunciation: "poot pah-sah-ang-grid-dye-my" },
      { english: "Help!", local: "ช่วยด้วย! (Chuay duay!)", pronunciation: "choo-ay-doo-ay" },
    ],
  },
};

// ── Currencies list ───────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", symbol: "$",   name: "US Dollar" },
  { code: "EUR", symbol: "€",   name: "Euro" },
  { code: "GBP", symbol: "£",   name: "British Pound" },
  { code: "INR", symbol: "₹",   name: "Indian Rupee" },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen" },
  { code: "THB", symbol: "฿",   name: "Thai Baht" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar" },
  { code: "SGD", symbol: "S$",  name: "Singapore Dollar" },
];

// ── Fallback ──────────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  countryName: "Global", langCode: "en-US", langName: "English",
  currency: "USD", exchangeRate: 1.0, plugType: "Universal", voltage: "110-240 V",
  emergency: "112 or 911", police: "112", medical: "112",
  visa: "Check the local country's consulate website prior to travel.",
  culture: [
    "Always respect local customs, religious symbols, and cultural landmarks.",
    "Learn a few local greeting phrases to show courtesy to residents.",
    "Verify tipping expectations as they vary widely worldwide.",
  ],
  phrases: [
    { english: "Hello", local: "Hello", pronunciation: "heh-loh" },
    { english: "Thank you", local: "Thank you", pronunciation: "thangk yoo" },
    { english: "Please", local: "Please", pronunciation: "pleez" },
    { english: "Excuse me", local: "Excuse me", pronunciation: "ik-skyooz mee" },
    { english: "How much is this?", local: "How much is this?", pronunciation: "how-muhch-iz-this" },
    { english: "Where is the bathroom?", local: "Where is the restroom?", pronunciation: "wair-iz-the-res-troom" },
    { english: "Do you speak English?", local: "Do you speak English?", pronunciation: "doo-yoo-speek-ing-glish" },
    { english: "Help!", local: "Help!", pronunciation: "help" },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────
export function ToolkitPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [calcBaseAmount, setCalcBaseAmount] = useState("100");
  const [calcTargetAmount, setCalcTargetAmount] = useState("");
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const voicesRef = useRef([]);

  // Load and cache voices for synthesis
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    tripAPI.getAll()
      .then((res) => {
        setTrips(res.data || []);
        if (res.data?.length > 0) setSelectedTrip(res.data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getDestinationInfo = () => {
    if (!selectedTrip) return DEFAULT_DATA;
    const d = selectedTrip.destination.toLowerCase();
    if (d.includes("france") || d.includes("paris"))           return DESTINATION_DATA.france;
    if (d.includes("japan") || d.includes("tokyo") || d.includes("kyoto") || d.includes("osaka")) return DESTINATION_DATA.japan;
    if (d.includes("india") || d.includes("delhi") || d.includes("goa") || d.includes("mumbai")) return DESTINATION_DATA.india;
    if (d.includes("london") || d.includes("united kingdom") || d.includes("uk") || d.includes("scotland")) return DESTINATION_DATA.uk;
    if (d.includes("spain") || d.includes("barcelona") || d.includes("madrid")) return DESTINATION_DATA.spain;
    if (d.includes("italy") || d.includes("rome") || d.includes("venice") || d.includes("florence")) return DESTINATION_DATA.italy;
    if (d.includes("thailand") || d.includes("bangkok") || d.includes("phuket")) return DESTINATION_DATA.thailand;
    if (d.includes("usa") || d.includes("united states") || d.includes("york") || d.includes("miami")) return DESTINATION_DATA.usa;
    return DEFAULT_DATA;
  };

  const info = getDestinationInfo();

  useEffect(() => {
    if (selectedTrip) {
      setTargetCurrency(info.currency || "EUR");
      setBaseCurrency("USD");
    }
  }, [selectedTrip]);

  const getExchangeRate = () => {
    let rates = window.EXCHANGE_RATES;
    if (!rates) {
      try { const c = localStorage.getItem("usd_exchange_rates"); if (c) rates = JSON.parse(c); } catch {}
    }
    if (!rates) rates = { USD: 1, EUR: 0.92, JPY: 156.0, INR: 83.5, GBP: 0.79, CAD: 1.37, AUD: 1.51, THB: 36.5, SGD: 1.35 };
    return (rates[targetCurrency] || 1) / (rates[baseCurrency] || 1);
  };

  const currentRate = getExchangeRate();

  useEffect(() => {
    const amt = parseFloat(calcBaseAmount);
    setCalcTargetAmount(isNaN(amt) ? "" : (amt * currentRate).toFixed(2));
  }, [calcBaseAmount, baseCurrency, targetCurrency]);

  const handleBaseChange = (v) => {
    setCalcBaseAmount(v);
    const a = parseFloat(v);
    setCalcTargetAmount(isNaN(a) ? "" : (a * currentRate).toFixed(2));
  };
  const handleTargetChange = (v) => {
    setCalcTargetAmount(v);
    const a = parseFloat(v);
    setCalcBaseAmount(isNaN(a) ? "" : (a / currentRate).toFixed(2));
  };
  const swapDirections = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
    setCalcBaseAmount(calcTargetAmount);
    setCalcTargetAmount(calcBaseAmount);
  };

  const speakText = (phrase, idx) => {
    if (!("speechSynthesis" in window)) {
      addNotification("Unavailable", "Speech Synthesis is not supported in this browser.", "error");
      return;
    }
    window.speechSynthesis.cancel();

    // Find best matching voice for the target language
    const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === info.langCode)
      || voices.find(v => v.lang.startsWith(info.langCode.split("-")[0]));

    let textToSpeak = "";
    let lang = info.langCode;

    if (matchedVoice) {
      // Clean local text (e.g. remove romanization inside parenthesis)
      textToSpeak = phrase.local.split("(")[0].trim();
    } else {
      // Fallback: Speak phonetic pronunciation using an English/default voice
      textToSpeak = phrase.pronunciation;
      lang = "en-US";
    }

    const utt = new SpeechSynthesisUtterance(textToSpeak);
    utt.lang = lang;

    if (matchedVoice) {
      utt.voice = matchedVoice;
    } else {
      const enVoice = voices.find(v => v.lang.startsWith("en"));
      if (enVoice) utt.voice = enVoice;
    }

    utt.onstart = () => setSpeakingIndex(idx);
    utt.onend   = () => setSpeakingIndex(null);
    utt.onerror = () => { setSpeakingIndex(null); addNotification("Speaker Alert", "Audio speech engine not ready.", "info"); };
    window.speechSynthesis.speak(utt);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="animate-fade-in-up">

        {/* ══ HERO HEADER ══════════════════════════════════════════════════════ */}
        <div className="relative mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 px-8 py-12 shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/80 backdrop-blur-md">
              <Wrench className="h-3 w-3" />
              Odyssey Utilities
            </span>

            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              Travel Toolkit
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Visa info · emergency contacts · plug specs · native phrases with audio · currency converter
            </p>

            {/* Trip selector — custom dropdown in hero */}
            {!loading && trips.length > 0 && (
              <div className="relative mt-4" ref={dropdownRef}>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/35">
                  Active destination
                </p>

                {/* Trigger button */}
                <button
                  id="trip-selector"
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30 w-72 cursor-pointer"
                >
                  <div className="flex-1 text-left">
                    <p className="text-sm font-black text-white leading-tight">
                      ✈️ &nbsp;{selectedTrip ? selectedTrip.destination.split(",")[0] : "Select trip"}
                    </p>
                    {selectedTrip && (
                      <p className="text-[11px] text-white/50 font-medium mt-0.5">
                        {new Date(selectedTrip.startDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <span className={`text-white/50 text-xs transition-transform duration-200 ${dropdownOpen ? "-rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>

                {/* Dropdown panel — positions directly below the trigger */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 z-[100] w-72 rounded-2xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden">
                    {trips.map((trip, idx) => {
                      const isActive = selectedTrip?._id === trip._id;
                      return (
                        <button
                          key={trip._id}
                          onClick={() => { setSelectedTrip(trip); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                            idx !== 0 ? "border-t border-white/5" : ""
                          } ${
                            isActive
                              ? "bg-indigo-600/30 text-white"
                              : "text-white/70 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          <span className="text-lg">✈️</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{trip.destination.split(",")[0]}</p>
                            <p className="text-[11px] text-white/40">
                              {new Date(trip.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          {isActive && <span className="h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══ EMPTY STATE ══════════════════════════════════════════════════════ */}
        {!loading && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Wrench className="h-7 w-7 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">No trips found</h2>
              <p className="mt-1 max-w-xs text-sm text-slate-500">Plan a trip first — this page will fill with destination-specific intelligence.</p>
            </div>
            <Link to="/create-trip">
              <button className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold">
                <Sparkles className="h-4 w-4" /> Plan a Trip
              </button>
            </Link>
          </div>
        )}

        {/* ══ SKELETON ═════════════════════════════════════════════════════════ */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`animate-pulse rounded-3xl bg-slate-100 ${i < 2 ? "h-52 lg:col-span-1" : "h-72"} ${i === 0 ? "lg:col-span-2" : ""}`} />
            ))}
          </div>
        )}

        {/* ══ MAIN GRID ════════════════════════════════════════════════════════ */}
        {!loading && selectedTrip && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── LEFT COL: Advisory + Translator ──────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* ── ADVISORY CARD ── */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/80">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200/60">
                      <Globe className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Destination Guide</p>
                      <h2 className="text-base font-extrabold text-slate-900 leading-tight">{info.countryName}</h2>
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                    {info.langName}
                  </span>
                </div>

                {/* Info tiles */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Visa */}
                  <div className="rounded-2xl bg-amber-50 border border-amber-100/80 p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-amber-200/60 flex items-center justify-center">
                        <Info className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Visa</span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-900/80 flex-1">{info.visa}</p>
                  </div>

                  {/* Emergency */}
                  <div className="rounded-2xl bg-rose-50 border border-rose-100/80 p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-rose-200/60 flex items-center justify-center">
                        <PhoneCall className="h-3.5 w-3.5 text-rose-700" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700">Emergency</span>
                    </div>
                    <p className="text-xs font-bold text-rose-900 flex-1">{info.emergency}</p>
                    <div className="flex gap-3 text-[11px] font-mono text-rose-700/60 mt-auto pt-1 border-t border-rose-100">
                      <span>Police · {info.police}</span>
                      <span>Medical · {info.medical}</span>
                    </div>
                  </div>

                  {/* Electricity */}
                  <div className="rounded-2xl bg-indigo-50 border border-indigo-100/80 p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-indigo-200/60 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-indigo-700" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">Electricity</span>
                    </div>
                    <p className="text-[11px] text-indigo-900/70 flex-1">{info.voltage}</p>
                    <div className="flex gap-1 flex-wrap mt-auto">
                      {info.plugType.split(",").map(t => (
                        <span key={t} className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700">
                          Type {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cultural etiquette */}
                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Cultural Etiquette</span>
                  </div>
                  <ul className="space-y-2">
                    {info.culture.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                        <p className="text-xs leading-relaxed text-slate-600">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── SURVIVAL TRANSLATOR ── */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/80">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-200/60">
                      <Languages className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Phrase Guide</p>
                      <h2 className="text-base font-extrabold text-slate-900 leading-tight">Survival Translator</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-[11px] font-bold text-violet-600">
                    {info.langName}
                  </span>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {info.phrases.map((phrase, idx) => {
                    const active = speakingIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`group flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                          active
                            ? "border-violet-300 bg-violet-50 shadow-md shadow-violet-100/50"
                            : "border-slate-100 bg-slate-50/60 hover:border-violet-200 hover:bg-violet-50/30"
                        }`}
                      >
                        <div className="min-w-0 pr-3 space-y-0.5">
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{phrase.english}</p>
                          <p className={`text-[13px] font-black leading-snug ${active ? "text-violet-800" : "text-slate-800"}`}>
                            {phrase.local}
                          </p>
                          <p className="text-[10px] italic text-slate-400 truncate">{phrase.pronunciation}</p>
                        </div>
                        <button
                          onClick={() => speakText(phrase, idx)}
                          title="Hear pronunciation"
                          className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                            active
                              ? "bg-violet-600 text-white shadow-lg shadow-violet-300/60 scale-110"
                              : "bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-300 group-hover:scale-105"
                          }`}
                        >
                          <Volume2 className={`h-4 w-4 ${active ? "animate-pulse" : ""}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT COL: Currency Converter ─────────────────────────────── */}
            <div>
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden sticky top-6">

                {/* Gradient header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-6">
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-white/70" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Live Rates</span>
                    </div>
                    <h2 className="text-xl font-black text-white">Currency Converter</h2>
                    <p className="mt-1 text-[11px] text-white/55">
                      1 {baseCurrency} = <strong className="text-white/90 font-black">{currentRate.toFixed(4)}</strong> {targetCurrency}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {/* From */}
                  <div className="rounded-2xl border border-slate-150 bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">From</span>
                      <select
                        id="base-currency-select"
                        value={baseCurrency}
                        onChange={e => setBaseCurrency(e.target.value)}
                        className="text-xs font-extrabold text-emerald-600 bg-transparent border-none outline-none cursor-pointer"
                      >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-300">
                        {CURRENCIES.find(c => c.code === baseCurrency)?.symbol ?? "$"}
                      </span>
                      <input
                        type="number" placeholder="0" value={calcBaseAmount}
                        onChange={e => handleBaseChange(e.target.value)}
                        className="w-full bg-transparent text-3xl font-black text-slate-900 outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Swap */}
                  <div className="flex justify-center">
                    <button
                      onClick={swapDirections}
                      className="h-8 w-8 rounded-full border border-slate-200 bg-white shadow-md text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 rotate-90" />
                    </button>
                  </div>

                  {/* To */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">To</span>
                      <select
                        id="target-currency-select"
                        value={targetCurrency}
                        onChange={e => setTargetCurrency(e.target.value)}
                        className="text-xs font-extrabold text-emerald-700 bg-transparent border-none outline-none cursor-pointer"
                      >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-emerald-300">
                        {CURRENCIES.find(c => c.code === targetCurrency)?.symbol ?? "€"}
                      </span>
                      <input
                        type="number" placeholder="0" value={calcTargetAmount}
                        onChange={e => handleTargetChange(e.target.value)}
                        className="w-full bg-transparent text-3xl font-black text-emerald-800 outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-slate-400 pt-2">
                    Rates are indicative and may vary.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
