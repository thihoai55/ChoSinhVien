import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const STORAGE_KEY = "sv_exchange_notifications";

function loadAllFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to parse notifications from localStorage", e);
    return {};
  }
}

function saveAllToStorage(all) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save notifications to localStorage", e);
  }
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load theo user hiện tại
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const all = loadAllFromStorage();
    setNotifications(all[user.id] || []);
  }, [user]);

  const addNotification = (targetUserId, data) => {
    if (!targetUserId) return;
    const all = loadAllFromStorage();
    const list = all[targetUserId] || [];

    const newNotify = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      time: new Date().toISOString(),
      ...data,
    };

    const updatedList = [newNotify, ...list];
    const updatedAll = { ...all, [targetUserId]: updatedList };
    saveAllToStorage(updatedAll);

    if (user && user.id === targetUserId) {
      setNotifications(updatedList);
    }
  };

  const markAsRead = (id) => {
    if (!user) return;
    const all = loadAllFromStorage();
    const list = all[user.id] || [];
    const updatedList = list.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const updatedAll = { ...all, [user.id]: updatedList };
    saveAllToStorage(updatedAll);
    setNotifications(updatedList);
  };

  const markAllAsRead = () => {
    if (!user) return;
    const all = loadAllFromStorage();
    const list = all[user.id] || [];
    if (!list.length) return;
    const updatedList = list.map((n) =>
      n.read ? n : { ...n, read: true }
    );
    const updatedAll = { ...all, [user.id]: updatedList };
    saveAllToStorage(updatedAll);
    setNotifications(updatedList);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
