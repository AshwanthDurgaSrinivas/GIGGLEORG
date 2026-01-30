import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Permission } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (module: string, actions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        permissions: user?.permissions || []
      }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true,
        permissions: user.permissions || []
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        permissions: []
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      hasPermission: (module, action) => {
        const { permissions } = get();
        const modulePerms = permissions.find(p => p.module === module);
        return modulePerms?.actions.includes(action as any) || false;
      },
      
      hasAnyPermission: (module, actions) => {
        const { permissions } = get();
        const modulePerms = permissions.find(p => p.module === module);
        if (!modulePerms) return false;
        return actions.some(action => modulePerms.actions.includes(action as any));
      },
    }),
    {
      name: 'nexus-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      }),
    }
  )
);
