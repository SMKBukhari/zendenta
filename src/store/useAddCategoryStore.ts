import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AddCategoryStore {
  categoryName: string;
  setCategoryName: (name: string) => void;
  reset: () => void;
}

export const useAddCategoryStore = create<AddCategoryStore>()(
  persist(
    (set) => ({
      categoryName: "",
      setCategoryName: (name) => set({ categoryName: name }),

      reset: () =>
        set({
          categoryName: "",
        }),
    }),
    {
      name: "add-category-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
