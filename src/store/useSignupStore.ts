// store/useSignupStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RoleConfig {
  role: string;
}

interface BasicInfo {
  email: string;
  password: string;
}

interface UserInfo {
  name: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
}

interface SignupStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: {
    role: RoleConfig;
    basicInfo: BasicInfo;
    userInfo: UserInfo;
  };
  setFormData: <T extends keyof SignupStore["formData"]>(
    section: T,
    data: Partial<SignupStore["formData"][T]>
  ) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      formData: {
        role: {
          role: "",
        },
        basicInfo: {
          email: "",
          password: "",
        },
        userInfo: {
          name: "",
          phoneNumber: "",
          gender: "",
          birthDate: "",
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
            role: {
              role: "",
            },
            basicInfo: {
              email: "",
              password: "",
            },
            userInfo: {
              name: "",
              phoneNumber: "",
              gender: "",
              birthDate: "",
            },
          },
        }),
    }),
    {
      name: "signup-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);