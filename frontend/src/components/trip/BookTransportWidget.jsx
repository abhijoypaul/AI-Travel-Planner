import { useState } from "react";
import { Plane, Train, ArrowRight, Sparkles } from "lucide-react";
import { getFlightBookingUrl, getTrainBookingUrl } from "@/lib/booking";

export function BookTransportWidget({ destination, startDate, travelers }) {
  const [type, setType] = useState("flights"); // 'flights' or 'trains'
  const [origin, setOrigin] = useState("");

  const handleSearch = () => {
    if (!origin.trim()) {
      alert("Please enter an origin city/station.");
      return;
    }
    
    let url = "";
    if (type === "flights") {
      url = getFlightBookingUrl(origin, destination, startDate, travelers);
    } else {
      url = getTrainBookingUrl(origin, destination, startDate);
    }
    window.open(url, "_blank");
  };

  return (
    <div className="wander-card p-5 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute -right-10 -top-10 h-32 w-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-32 w-32 bg-emerald-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              {type === "flights" ? (
                <Plane className="h-4.5 w-4.5 text-indigo-600" />
              ) : (
                <Train className="h-4.5 w-4.5 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Book Your Travel</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Prefilled searches on MakeMyTrip</p>
            </div>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setType("flights")}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                type === "flights"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plane className="h-3 w-3" />
              Flights
            </button>
            <button
              onClick={() => setType("trains")}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                type === "trains"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Train className="h-3 w-3" />
              Trains
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Origin */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Leaving From
            </label>
            <input
              type="text"
              placeholder="e.g. Delhi (DEL)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-55/40 border border-slate-250 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Going To
            </label>
            <input
              type="text"
              disabled
              value={destination}
              className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 cursor-not-allowed"
            />
          </div>

          {/* Date & Travelers */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Date
              </label>
              <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 select-none">
                {startDate ? new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "-"}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Guests
              </label>
              <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 select-none">
                {travelers} {travelers > 1 ? "Adults" : "Adult"}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full btn-primary h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 fill-white" />
            Search MakeMyTrip
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
