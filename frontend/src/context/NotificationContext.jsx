import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load notifications when user changes
  useEffect(() => {
    const userId = user ? user._id || user.email : 'guest';
    const storageKey = `odysseyx_notifications_${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing notifications", e);
        setNotifications([]);
      }
    } else {
      // Default initial notifications
      const defaultNotifications = [
        {
          id: 'default-1',
          title: "Welcome to OdysseyX!",
          desc: "Start planning your dream vacation from the dashboard.",
          time: new Date().toISOString(),
          read: false,
          type: 'info'
        },
        {
          id: 'default-2',
          title: "Premium Travel Planner Online",
          desc: "Gemini 2.5-flash is now powering all itinerary generation.",
          time: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          read: false,
          type: 'system'
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
    }
  }, [user]);

  const saveNotifications = (updated) => {
    setNotifications(updated);
    const userId = user ? user._id || user.email : 'guest';
    const storageKey = `odysseyx_notifications_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addNotification = (title, desc, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      desc,
      time: new Date().toISOString(),
      read: false,
      type
    };
    // Keep max 30 notifications
    saveNotifications([newNotif, ...notifications].slice(0, 30));
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
