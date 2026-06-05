import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link, useNavigate } from "react-router-dom";

export function Layout({ children, hideSidebar = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (hideSidebar) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header
          className="flex h-16 shrink-0 items-center justify-between px-8 gap-6"
          style={{
            background: "#f4f6fb",
            borderBottom: "1px solid rgba(99,102,241,0.07)",
          }}
        >
          {/* Spacing placeholder instead of top search bar */}
          <div className="flex-1" />

          {/* Right: Bell + Avatar */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Notification Bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-white" />
            </button>

            {/* User */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity focus:outline-none"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-indigo-400 to-violet-500">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  {user?.name || "Traveler"}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-fade-in z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-505" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-505" />
                    Settings
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-650 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main
          className="flex-1 overflow-y-auto px-8 pb-10 hide-scrollbar"
          style={{ background: "#f4f6fb" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
