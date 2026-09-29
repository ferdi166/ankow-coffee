import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { ProfileUser } from "@/types/auth";
import { INITIAL_STATE_PROFILE } from "@/constants/auth-constant";

type AuthState = {
  user: User | null;
  profile: ProfileUser;
  setUser: (user: User | null) => void;
  setProfile: (profile: ProfileUser) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: INITIAL_STATE_PROFILE,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));
