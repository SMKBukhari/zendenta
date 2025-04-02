import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AddComponentStore {
  componentName: string;
  setComponentName: (name: string) => void;
  price: number;
  setPrice: (price: number) => void;
  reset: () => void;
}

export const useAddComponentStore = create<AddComponentStore>()(
  persist(
    (set) => ({
      componentName: "",
      setComponentName: (name) => set({ componentName: name }),
      price: 0,
      setPrice: (price) => set({ price: price }),

      reset: () =>
        set({
          componentName: "",
          price: 0,
        }),
    }),
    {
      name: "add-component-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
