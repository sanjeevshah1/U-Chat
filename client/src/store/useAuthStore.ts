import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string | null, userId: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  isLoggedIn: !!localStorage.getItem("accessToken"),
  setAccessToken: (token, userId) => {
    if (token && userId) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId);
      set({ accessToken: token, isLoggedIn: true });
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      set({ accessToken: null, isLoggedIn: false });
    }
  },
}));
