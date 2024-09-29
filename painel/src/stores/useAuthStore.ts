import { LoggedUser } from '@/types/loggedUser';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: LoggedUser | null;
  //isAuthenticated: boolean;
  //setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: LoggedUser | null) => void;
  logout: () => void;
}

// export const useAuthStore = create<AuthState>(
//   (set) => ({
//     isAuthenticated: false,
//     user: null,
//     setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
//     setUser: (user) => set({ user }),
//     logout: () => {
//       set({ user: null });
//     },
//   })
// );

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth',
    }
  )
);
