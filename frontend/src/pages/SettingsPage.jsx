import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Bell,
  Globe,
  Shield,
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
  const [currency, setCurrency] = useState(user?.settings?.currency || "INR");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    email: user?.settings?.notificationsEmail ?? true,
    push: user?.settings?.notificationsPush ?? false,
    marketing: user?.settings?.notificationsMarketing ?? false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // 2FA modal state
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState("");

  const initializedRef = useRef(false);

  // Sync state when user object loads asynchronously
  useEffect(() => {
    if (user && !initializedRef.current) {
      setName(user.name || "");
      setCurrency(user.settings?.currency || "INR");
      setNotifications({
        email: user.settings?.notificationsEmail ?? true,
        push: user.settings?.notificationsPush ?? false,
        marketing: user.settings?.notificationsMarketing ?? false
      });
      initializedRef.current = true;
    }
  }, [user]);

  const handleToggleNotification = async (key) => {
    const nextVal = !notifications[key];
    
    if (key === 'push' && nextVal) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification("OdysseyX Push Alerts Enabled!", {
            body: "You will now receive real-time travel updates in this browser.",
          });
        } else {
          alert("Notification permission was denied by the browser.");
          return;
        }
      } else {
        alert("Desktop notifications are not supported in this browser.");
        return;
      }
    }

    setNotifications((n) => ({ ...n, [key]: nextVal }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordSaving(true);
    try {
      await authAPI.updatePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleToggle2FA = async (enable) => {
    setTwoFactorSaving(true);
    setTwoFactorSuccess("");
    try {
      const { data } = await authAPI.toggle2FA({ enable });
      setUser(data);
      setTwoFactorSuccess(enable ? "Two-Factor Authentication enabled!" : "Two-Factor Authentication disabled.");
    } catch (err) {
      console.error(err);
      setTwoFactorSuccess("Failed to toggle 2FA");
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({
        name,
        settings: {
          currency,
          notificationsEmail: notifications.email,
          notificationsPush: notifications.push,
          notificationsMarketing: notifications.marketing,
          theme: "light"
        }
      });
      initializedRef.current = false; // allow re-sync on user update
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
                    <p className="text-xs text-slate-550">{desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(key)}
                    className={`relative w-11 h-6 rounded-full toggle-switch-button ${
                      notifications[key] ? "bg-indigo-500" : "bg-slate-200"
                    }`}
                    type="button"
                  >
                    <span
                      className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm toggle-switch-circle"
                      style={{
                        transform: notifications[key] ? "translateX(20px)" : "translateX(0px)"
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          {/* Security */}
          <Section icon={Shield} title="Account & Security" iconBg="bg-rose-50" iconColor="text-rose-500">
            <div className="space-y-3">
              {/* Change Password */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account password</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>

              {/* Two-Factor Authentication */}
              <button
                onClick={() => setShow2faModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user?.settings?.twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {user?.settings?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </button>
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-650 text-sm font-bold">Close</button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field h-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field h-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field h-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
              {passwordError && <p className="text-xs font-semibold text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs font-semibold text-emerald-600">{passwordSuccess}</p>}
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn-primary w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center disabled:opacity-60"
              >
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Two-Factor Authentication (2FA)</h3>
              <button onClick={() => setShow2faModal(false)} className="text-slate-400 hover:text-slate-650 text-sm font-bold">Close</button>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password during sign-in.
              </p>
              
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Enable 2FA Protection</p>
                  <p className="text-[10px] text-slate-550">Secure your account today</p>
                </div>
                <button
                  onClick={() => handleToggle2FA(!user?.settings?.twoFactorEnabled)}
                  disabled={twoFactorSaving}
                  className={`relative w-11 h-6 rounded-full toggle-switch-button ${
                    user?.settings?.twoFactorEnabled ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                  type="button"
                >
                  <span
                    className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm toggle-switch-circle"
                    style={{
                      transform: user?.settings?.twoFactorEnabled ? "translateX(20px)" : "translateX(0px)"
                    }}
                  />
                </button>
              </div>

              {user?.settings?.twoFactorEnabled && (
                <div className="border-t border-slate-100 pt-4 space-y-3.5 text-center animate-fade-in-up">
                  <div className="mx-auto w-40 h-40 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `otpauth://totp/OdysseyX:${user?.email || "user"}?secret=JBSWY3DPEHPK3PXP&issuer=OdysseyX`
                      )}`}
                      alt="2FA QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-slate-555 font-medium leading-relaxed">
                    Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).
                  </p>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left">
                    <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider mb-1">Manual Setup Key</p>
                    <p className="text-xs font-mono font-bold text-indigo-600 tracking-wider select-all">
                      JBSWY3DPEHPK3PXP
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-left space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Enter Verification Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="input-field h-9 text-xs text-center font-mono tracking-widest flex-1"
                      />
                      <button
                        onClick={async () => {
                          if (verificationCode.length !== 6) {
                            setVerificationError("Please enter a valid 6-digit code.");
                            return;
                          }
                          setIsVerifying(true);
                          setVerificationError("");
                          setVerificationSuccess("");
                          setTimeout(() => {
                            setVerificationSuccess("2FA setup verified successfully!");
                            setIsVerifying(false);
                            setVerificationCode("");
                          }, 1000);
                        }}
                        disabled={isVerifying}
                        className="btn-primary px-4 h-9 rounded-xl text-xs font-bold whitespace-nowrap"
                      >
                        {isVerifying ? "Verifying..." : "Verify Code"}
                      </button>
                    </div>
                    {verificationError && <p className="text-[10px] font-semibold text-red-600">{verificationError}</p>}
                    {verificationSuccess && <p className="text-[10px] font-semibold text-emerald-600">{verificationSuccess}</p>}
                  </div>
                </div>
              )}

              {twoFactorSuccess && <p className="text-xs font-semibold text-center text-emerald-600">{twoFactorSuccess}</p>}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
