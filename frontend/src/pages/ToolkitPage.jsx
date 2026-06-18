import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  PhoneCall,
  Volume2,
  DollarSign,
  Info,
  Zap,
  Globe,
  Languages,
  TrendingUp,
  ArrowRightLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { tripAPI } from "@/services/api";
import { useNotification } from "@/context/NotificationContext";

// Detailed data for major travel destinations
const DESTINATION_DATA = {
  france: {
    countryName: "France",
    langCode: "fr-FR",
    langName: "French",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRate: 0.92, // 1 USD = 0.92 EUR
    plugType: "C, E",
    voltage: "230 V / 50 Hz",
    emergency: "112 (European emergency number)",
    police: "17",
    medical: "15",
    visa: "Schengen Visa required (Visa-free for up to 90 days for US/UK/Canada citizens).",
    culture: [
      "Always greet shopkeepers with a polite 'Bonjour' or 'Bonsoir'.",
      "Table manners are important. Keep both hands on the table (not on your lap).",
      "Tipping is not obligatory; service charge (service compris) is included in the bill.",
    ],
    phrases: [
      { english: "Hello / Good day", local: "Bonjour", pronunciation: "bohn-zhoor" },
      { english: "Thank you very much", local: "Merci beaucoup", pronunciation: "mair-see boh-koo" },
      { english: "Please", local: "S'il vous plaît", pronunciation: "seel voo pleh" },
      { english: "Excuse me", local: "Excusez-moi", pronunciation: "ex-kew-zay mwah" },
      { english: "How much is this?", local: "C'est combien?", pronunciation: "say cohn-byan" },
      { english: "Where is the bathroom?", local: "Où sont les toilettes?", pronunciation: "oo sohn lay twah-let" },
      { english: "Do you speak English?", local: "Parlez-vous anglais?", pronunciation: "par-lay voo ahng-lay" },
      { english: "Help!", local: "Au secours!", pronunciation: "oh suh-koor" },
    ],
  },
  japan: {
    countryName: "Japan",
    langCode: "ja-JP",
    langName: "Japanese",
    currency: "JPY",
    currencySymbol: "¥",
    exchangeRate: 156.40, // 1 USD = 156.4 JPY
    plugType: "A, B",
    voltage: "100 V / 50-60 Hz",
    emergency: "110 (Police) / 119 (Ambulance/Fire)",
    police: "110",
    medical: "119",
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
    countryName: "India",
    langCode: "hi-IN",
    langName: "Hindi",
    currency: "INR",
    currencySymbol: "₹",
    exchangeRate: 83.50, // 1 USD = 83.5 INR
    plugType: "C, D, M",
    voltage: "230 V / 50 Hz",
    emergency: "112 (National emergency number)",
    police: "100",
    medical: "102",
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
      { english: "Do you speak English?", local: "क्या आप अंग्रेज़ी बोलते हैं? (Kya aap angrezi bolte hain?)", pronunciation: "kyah aap un-gray-zee bole-tay hain" },
      { english: "Help!", local: "मदद करो! (Madad karo!)", pronunciation: "muh-dudh kuh-roh" },
    ],
  },
  uk: {
    countryName: "United Kingdom",
    langCode: "en-GB",
    langName: "English",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRate: 0.79, // 1 USD = 0.79 GBP
    plugType: "G",
    voltage: "230 V / 50 Hz",
    emergency: "999 or 112",
    police: "999",
    medical: "999",
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
    countryName: "United States",
    langCode: "en-US",
    langName: "English",
    currency: "USD",
    currencySymbol: "$",
    exchangeRate: 1.0,
    plugType: "A, B",
    voltage: "120 V / 60 Hz",
    emergency: "911",
    police: "911",
    medical: "911",
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
    countryName: "Spain",
    langCode: "es-ES",
    langName: "Spanish",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRate: 0.92,
    plugType: "C, F",
    voltage: "230 V / 50 Hz",
    emergency: "112",
    police: "112",
    medical: "112",
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
    countryName: "Italy",
    langCode: "it-IT",
    langName: "Italian",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRate: 0.92,
    plugType: "C, F, L",
    voltage: "230 V / 50 Hz",
    emergency: "112",
    police: "112",
    medical: "112",
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
    countryName: "Thailand",
    langCode: "th-TH",
    langName: "Thai",
    currency: "THB",
    currencySymbol: "฿",
    exchangeRate: 36.70, // 1 USD = 36.7 THB
    plugType: "A, B, C, O",
    voltage: "220 V / 50 Hz",
    emergency: "191 (Police) / 1669 (Medical)",
    police: "191",
    medical: "1669",
    visa: "Visa-free entry or Visa on Arrival available for many citizenships.",
    culture: [
      "Never touch anyone's head; it is considered the most sacred part of the body.",
      "Never point your feet at people, images of the King, or religious icons.",
      "Press your palms together at chest level ('Wai') to greet others politely.",
    ],
    phrases: [
      { english: "Hello", local: "สวัสดี (Sawasdee - krap/ka)", pronunciation: "sah-wahd-dee (krub/kah)" },
      { english: "Thank you", local: "ขอบคุณ (Khob khun - krap/ka)", pronunciation: "khob-khoon (krub/kah)" },
      { english: "Please / Request", local: "กรุณา (Karuna)", pronunciation: "kah-roo-nah" },
      { english: "Excuse me / Sorry", local: "ขอโทษ (Kho thot)", pronunciation: "khor-thoht" },
      { english: "How much is this?", local: "นี่เท่าไหร่ (Nee tao rai?)", pronunciation: "nee-tao-rye" },
      { english: "Where is the bathroom?", local: "ห้องน้ำอยู่ที่ไหน (Hong nam yoo tee nai?)", pronunciation: "hong-nahm yoo tee-nye" },
      { english: "Do you speak English?", local: "พูดภาษาอังกฤษได้ไหม (Poot pasa ang-grid dai mai?)", pronunciation: "poot pah-sah-ang-grid-dye-my" },
      { english: "Help!", local: "ช่วยด้วย! (Chuay duay!)", pronunciation: "choo-ay-doo-ay" },
    ],
  },
};

// Default generic fallback
const DEFAULT_DATA = {
  countryName: "Global",
  langCode: "en-US",
  langName: "English",
  currency: "USD",
  currencySymbol: "$",
  exchangeRate: 1.0,
  plugType: "Universal Support Needed",
  voltage: "110-240 V",
  emergency: "112 or 911",
  police: "112",
  medical: "112",
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

export function ToolkitPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  // Currency Converter State
  const [calcBaseAmount, setCalcBaseAmount] = useState("100");
  const [calcTargetAmount, setCalcTargetAmount] = useState("");
  const [isBaseToTarget, setIsBaseToTarget] = useState(true);

  // Audio/Speech State
  const [speakingIndex, setSpeakingIndex] = useState(null);

  useEffect(() => {
    tripAPI.getAll()
      .then((res) => {
        setTrips(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedTrip(res.data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load trips for toolkit:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Determine current destination guidelines
  const getDestinationInfo = () => {
    if (!selectedTrip) return DEFAULT_DATA;
    const destLower = selectedTrip.destination.toLowerCase();

    if (destLower.includes("france") || destLower.includes("paris")) return DESTINATION_DATA.france;
    if (destLower.includes("japan") || destLower.includes("tokyo") || destLower.includes("kyoto") || destLower.includes("osaka")) return DESTINATION_DATA.japan;
    if (destLower.includes("india") || destLower.includes("delhi") || destLower.includes("goa") || destLower.includes("mumbai")) return DESTINATION_DATA.india;
    if (destLower.includes("london") || destLower.includes("united kingdom") || destLower.includes("scotland") || destLower.includes("uk")) return DESTINATION_DATA.uk;
    if (destLower.includes("spain") || destLower.includes("barcelona") || destLower.includes("madrid")) return DESTINATION_DATA.spain;
    if (destLower.includes("italy") || destLower.includes("rome") || destLower.includes("venice") || destLower.includes("florence")) return DESTINATION_DATA.italy;
    if (destLower.includes("thailand") || destLower.includes("bangkok") || destLower.includes("phuket")) return DESTINATION_DATA.thailand;
    if (destLower.includes("usa") || destLower.includes("united states") || destLower.includes("york") || destLower.includes("miami")) return DESTINATION_DATA.usa;

    return DEFAULT_DATA;
  };

  const info = getDestinationInfo();

  // Reset/sync currency conversions when destination info changes
  useEffect(() => {
    if (info) {
      const rate = info.exchangeRate;
      const amount = parseFloat(calcBaseAmount);
      if (!isNaN(amount)) {
        setCalcTargetAmount((amount * rate).toFixed(2));
      } else {
        setCalcTargetAmount("");
      }
    }
  }, [selectedTrip, info]);

  // Handle Currency Changes
  const handleBaseChange = (value) => {
    setCalcBaseAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      setCalcTargetAmount((amount * info.exchangeRate).toFixed(2));
    } else {
      setCalcTargetAmount("");
    }
  };

  const handleTargetChange = (value) => {
    setCalcTargetAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      setCalcBaseAmount((amount / info.exchangeRate).toFixed(2));
    } else {
      setCalcBaseAmount("");
    }
  };

  const swapDirections = () => {
    setIsBaseToTarget(!isBaseToTarget);
  };

  // Text-To-Speech Pronunciation
  const speakText = (text, phraseIndex) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any currently speaking audio
      
      // Extract local text before any brackets/parenthesis if JPY or THB
      const textToSpeak = text.split("(")[0].trim();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = info.langCode;

      utterance.onstart = () => {
        setSpeakingIndex(phraseIndex);
      };

      utterance.onend = () => {
        setSpeakingIndex(null);
      };

      utterance.onerror = () => {
        setSpeakingIndex(null);
        addNotification("Speaker Alert", "Audio speech engine not ready. Please try again.", "info");
      };

      window.speechSynthesis.speak(utterance);
    } else {
      addNotification("Unavailable", "Speech Synthesis is not supported in this browser.", "error");
    }
  };

  return (
    <Layout>
      <div className="py-6 space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Wrench className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Odyssey Utilities</p>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Travel Toolkit & Advisory</h1>
          </div>
          
          {/* Trip Selector Dropdown */}
          {!loading && trips.length > 0 && (
            <div className="flex flex-col gap-1">
              <label htmlFor="trip-selector" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select active trip</label>
              <select
                id="trip-selector"
                value={selectedTrip ? selectedTrip._id : ""}
                onChange={(e) => {
                  const found = trips.find(t => t._id === e.target.value);
                  if (found) setSelectedTrip(found);
                }}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-colors shadow-xs"
              >
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.destination.split(",")[0]} ({new Date(trip.startDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* If no trips planned */}
        {!loading && trips.length === 0 && (
          <div className="wander-card p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Wrench className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No active trips found</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Please generate or plan a trip first. Once you have a trip, this page will dynamically load visa requirements, currency exchanges, local translation voice notes, and socket instructions.
            </p>
            <Link to="/create-trip">
              <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 mx-auto">
                <Sparkles className="h-4 w-4" />
                Plan a Trip Now
              </button>
            </Link>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-100 animate-pulse rounded-2xl col-span-2"></div>
            <div className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
          </div>
        )}

        {/* Main Dashboard Layout */}
        {!loading && selectedTrip && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left/Middle Columns: Guidelines & Survival phrases */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Destination Advisory Card */}
              <div className="wander-card p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">{info.countryName} Advisory Guide</h2>
                    <p className="text-[11px] text-slate-400">Important requirements and local etiquette</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Visas and Emergency */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="h-4.5 w-4.5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Visa Guidelines</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{info.visa}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <PhoneCall className="h-4.5 w-4.5 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Emergency Numbers</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold">General Emergency: {info.emergency}</p>
                        <div className="flex gap-4 mt-1 text-[11px] text-slate-500 font-mono">
                          <span>Police: {info.police}</span>
                          <span>Medical: {info.medical}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Electricity & Sockets */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="h-4.5 w-4.5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Electricity Specs</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Plug Type: <strong className="text-slate-900 font-bold">{info.plugType}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500">Voltage: {info.voltage}</p>
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {info.plugType.split(",").map((type) => (
                            <span key={type} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                              Type {type.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cultural Customs */}
                <div className="border-t border-slate-150/60 pt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    Cultural Etiquette (Do's & Don'ts)
                  </h4>
                  <ul className="space-y-2">
                    {info.culture.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Survival Translator Card */}
              <div className="wander-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Languages className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">Survival Translator</h2>
                      <p className="text-[11px] text-slate-400">Survival vocabulary pronounced aloud</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                    {info.langName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {info.phrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-150/50 hover:border-indigo-200 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{phrase.english}</p>
                        <p className="text-sm font-extrabold text-slate-800 font-sans tracking-wide">{phrase.local}</p>
                        <p className="text-[11px] text-indigo-500 font-medium italic">Pronunciation: {phrase.pronunciation}</p>
                      </div>

                      <button
                        onClick={() => speakText(phrase.local, idx)}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                          speakingIndex === idx
                            ? "bg-indigo-600 text-white animate-bounce shadow-md"
                            : "bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 shadow-sm border border-slate-200/80 group-hover:scale-105"
                        }`}
                        title="Listen Pronunciation"
                      >
                        <Volume2 className={`h-4.5 w-4.5 ${speakingIndex === idx ? "animate-pulse" : ""}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Currency Converter */}
            <div className="space-y-6">
              
              {/* Currency Calculator Card */}
              <div className="wander-card p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Currency Calculator</h2>
                    <p className="text-[11px] text-slate-400">Local travel conversion calculations</p>
                  </div>
                </div>

                {/* Conversion Form */}
                <div className="space-y-4 relative">
                  {/* Base Currency Box (USD) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {isBaseToTarget ? "From (USD)" : `To (${info.currency})`}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-500">{isBaseToTarget ? "$" : info.currencySymbol}</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={isBaseToTarget ? calcBaseAmount : calcTargetAmount}
                        onChange={(e) => isBaseToTarget ? handleBaseChange(e.target.value) : handleTargetChange(e.target.value)}
                        className="bg-transparent border-none text-xl font-extrabold text-slate-800 outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="absolute left-1/2 top-[72px] -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                      onClick={swapDirections}
                      className="h-8 w-8 rounded-full bg-white text-indigo-650 shadow-md border border-slate-200 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                      title="Swap Directions"
                    >
                      <ArrowRightLeft className="h-4 w-4 rotate-90" />
                    </button>
                  </div>

                  {/* Target Currency Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                      {isBaseToTarget ? `To (${info.currency})` : "From (USD)"}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-655">{isBaseToTarget ? info.currencySymbol : "$"}</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={isBaseToTarget ? calcTargetAmount : calcBaseAmount}
                        onChange={(e) => isBaseToTarget ? handleTargetChange(e.target.value) : handleBaseChange(e.target.value)}
                        className="bg-transparent border-none text-xl font-extrabold text-slate-800 outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Conversion Details */}
                  <div className="p-3 bg-slate-50/80 rounded-xl text-center text-xs text-slate-500 border border-slate-150">
                    Rate: <strong className="text-slate-800">1 USD = {info.exchangeRate} {info.currency}</strong>
                  </div>
                </div>
              </div>

              {/* Extra Widget for Travel Resources */}
              <div className="wander-card p-5 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-md">
                <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute left-[-20px] bottom-[-20px] h-24 w-24 rounded-full bg-violet-400/20 blur-2xl" />
                
                <h3 className="text-sm font-extrabold mb-1">Need Booking Help?</h3>
                <p className="text-[11px] text-white/80 leading-relaxed mb-4">
                  Easily resolve flights, trains, and hotel accommodations directly inside your itineraries.
                </p>
                <Link to="/trips">
                  <button className="flex items-center gap-1 bg-white text-indigo-650 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm">
                    Go to Itineraries
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
