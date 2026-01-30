import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  sidebarCompact: boolean;
  animationsEnabled: boolean;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  toggleAnimations: () => void;
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      sidebarCompact: false,
      animationsEnabled: true,
      
      setMode: (mode) => {
        set({ mode });
        const isDark = mode === 'dark' || 
          (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
      },
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCompact: !state.sidebarCompact 
      })),
      
      toggleAnimations: () => set((state) => ({ 
        animationsEnabled: !state.animationsEnabled 
      })),
      
      isDark: () => {
        const { mode } = get();
        return mode === 'dark' || 
          (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      },
    }),
    {
      name: 'nexus-theme',
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  const isDark = store.mode === 'dark' || 
    (store.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}
