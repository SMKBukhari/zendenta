import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AddReservationForm } from "@/schemas";

interface AddReservationStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: AddReservationForm;
  setFormData: <T extends keyof AddReservationStore["formData"]>(
    section: T,
    data: Partial<AddReservationStore["formData"][T]>
  ) => void;
  reset: () => void;
}

export const useReservationStore = create<AddReservationStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      formData: {
        treatmentInfo: {
          treatmentId: "",
          dentistId: "",
          date: new Date(),
          startTime: "09:00",
          endTime: "10:00",
          quickNote: "",
        },
        patientInfo: {
          patientName: "",
          age: "",
          gender: "Male",
          email: "",
          phoneNumber: "",
          address: "",
        },
        oralHygieneInfo: {
          lastVisit: "Less than 3 months ago",
          dentalCareStart: "About 30 years old",
          brushingFrequency: "Twice",
          usesMouthwash: "Yes",
          usesDentalFloss: "No",
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
          currentStep: 1,
          formData: {
            treatmentInfo: {
              treatmentId: "",
              dentistId: "",
              date: new Date(),
              startTime: "09:00",
              endTime: "10:00",
              quickNote: "",
            },
            patientInfo: {
              patientName: "",
              age: "",
              gender: "Male",
              email: "",
              phoneNumber: "",
              address: "",
            },
            oralHygieneInfo: {
              lastVisit: "Less than 3 months ago",
              dentalCareStart: "About 30 years old",
              brushingFrequency: "Twice",
              usesMouthwash: "Yes",
              usesDentalFloss: "No",
            },
          },
        }),
    }),
    {
      name: "add-reservation-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
