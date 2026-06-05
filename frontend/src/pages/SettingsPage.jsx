import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Bell,
  Globe,
  Shield,
  Palette,
  Moon,
  Sun,
  ChevronRight,
  Check,
  LogOut,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/services/api";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "INR", "CAD", "CHF"];
const LANGUAGES = ["English", "French", "Spanish", "German", "Japanese", "Italian"];

export function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(user?.settings?.currency || "USD");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({ email: true, push: false, marketing: false });
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name, settings: { currency } });
      setUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const Section = ({ icon: Icon, title, iconBg, iconColor, children }) => (
    <div className="wander-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className={`h-9 w-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <Layout>
      <div className="py-6 animate-fade-in-up max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Preferences</p>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        </div>

        <div className="space-y-5">
          {/* Profile */}
          <Section icon={User} title="Profile" iconBg="bg-indigo-50" iconColor="text-indigo-500">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="input-field opacity-50 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </Section>

          {/* Preferences */}
          <Section icon={Globe} title="Travel Preferences" iconBg="bg-emerald-50" iconColor="text-emerald-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input-field"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title="Notifications" iconBg="bg-amber-50" iconColor="text-amber-500">
            <div className="space-y-4">
              {[
                { key: "email", label: "Email notifications", desc: "Receive trip updates via email" },
                { key: "push", label: "Push notifications", desc: "Browser alerts for important updates" },
                { key: "marketing", label: "Travel tips & deals", desc: "Weekly travel inspiration emails" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      notifications[key] ? "bg-indigo-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        notifications[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          {/* Appearance */}
          <Section icon={Palette} title="Appearance" iconBg="bg-violet-50" iconColor="text-violet-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-slate-600" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-semibold text-slate-800">Theme</p>
                  <p className="text-xs text-slate-500">{darkMode ? "Dark mode" : "Light mode"} is active</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  darkMode ? "bg-indigo-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </Section>

          {/* Security */}
          <Section icon={Shield} title="Account & Security" iconBg="bg-rose-50" iconColor="text-rose-500">
            <div className="space-y-3">
              {[
                { label: "Change Password", desc: "Update your account password" },
                { label: "Two-Factor Authentication", desc: "Add an extra layer of security" },
                { label: "Connected Apps", desc: "Manage third-party integrations" },
              ].map(({ label, desc }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </Section>

          {/* Save + Logout */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex-1 h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
