import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  isLoggedIn: !!localStorage.getItem("accessToken"),
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      set({ accessToken: token, isLoggedIn: true });
    } else {
      localStorage.removeItem("accessToken");
      set({ accessToken: null, isLoggedIn: false });
    }
  },
}));
