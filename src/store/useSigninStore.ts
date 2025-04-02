import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SignInStore {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  userId: string;
  setUserId: (email: string) => void;
  loginSessionToken: string;
  setLoginSessionToken: (loginSessionToken: string) => void;
  loginSessionExpiry: string;
  setLoginSessionExpiry: (loginSessionExpiry: string) => void;
  reset: () => void;
}

export const useSigninStore = create<SignInStore>()(
  persist(
    (set) => ({
      isSignedIn: false,
      setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
      userId: "",
      setUserId: (userId) => set({ userId }),
      loginSessionToken: "",
      setLoginSessionToken: (loginSessionToken) => set({ loginSessionToken }),
      loginSessionExpiry: "",
      setLoginSessionExpiry: (loginSessionExpiry) =>
        set({ loginSessionExpiry }),
      reset: () =>
        set({
          isSignedIn: false,
          userId: "",
        }),
    }),
    {
      name: "signin-storage",
    }
  )
);
