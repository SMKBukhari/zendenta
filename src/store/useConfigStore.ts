// store/useSignupStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CompanyBasicInfo {
  name: string;
  phoneNumber: string;
  imageUrl: string;
}

interface CompanyAddressInfo {
  address: string;
}

interface ConfigStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: {
    companyBasicInfo: CompanyBasicInfo;
    comapnyAddressInfo: CompanyAddressInfo;
  };
  setFormData: <T extends keyof ConfigStore["formData"]>(
    section: T,
    data: Partial<ConfigStore["formData"][T]>
  ) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      formData: {
        companyBasicInfo: {
          name: "",
          phoneNumber: "",
          imageUrl: "",
        },
        comapnyAddressInfo: {
          address: "",
        },
      },
      setFormData: (section, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: {
              ...state.formData[section],
              ...data,
            },
          },
        })),
      reset: () =>
        set({
          currentStep: 0,
          formData: {
            companyBasicInfo: {
              name: "",
              phoneNumber: "",
              imageUrl: "",
            },
            comapnyAddressInfo: {
              address: "",
            },
          },
        }),
    }),
    {
      name: "config-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
