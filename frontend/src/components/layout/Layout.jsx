import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, ChevronDown, User, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useLocation, Link, useNavigate } from "react-router-dom";

export function Layout({ children, hideSidebar = false }) {
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead, deleteNotification, markAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHr / 24);

      if (diffSec < 60) return "Just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return timeStr;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
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
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
              >
                <Bell className="h-4 w-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-white animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-fade-in z-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Notifications</p>
                    {notifications.some(n => !n.read) && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar my-1.5 space-y-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-left transition-colors flex gap-2.5 relative group ${
                            n.read ? 'hover:bg-slate-50 dark:hover:bg-gray-700/50' : 'bg-indigo-50/30 hover:bg-indigo-50/50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30'
                          }`}
                        >
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markAsRead(n.id)}>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate pr-4">{n.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">{n.desc}</p>
                            <p className="text-[9px] text-slate-400 dark:text-gray-500 mt-1 font-semibold">{formatTime(n.time)}</p>
                          </div>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="absolute top-2.5 right-2.5 h-4 w-4 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-650 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-500 dark:text-gray-400 text-xs">
                        No notifications yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
