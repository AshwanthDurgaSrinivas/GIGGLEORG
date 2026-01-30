import { create } from 'zustand';
import type { Notification } from '@/types';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  activeModule: string;
  activeSubModule: string | null;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Modals
  activeModal: string | null;
  modalData: unknown;

  // Global search
  searchQuery: string;
  searchOpen: boolean;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModule: (module: string, subModule?: string | null) => void;

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;

  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;

  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModule: 'dashboard',
  activeSubModule: null,
  notifications: [],
  unreadCount: 0,
  activeModal: null,
  modalData: null,
  searchQuery: '',
  searchOpen: false,
  globalLoading: false,
  loadingMessage: '',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModule: (module, subModule = null) => set({ activeModule: module, activeSubModule: subModule }),

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }));
  },

  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

  setGlobalLoading: (loading, message = '') =>
    set({ globalLoading: loading, loadingMessage: message }),
}));
