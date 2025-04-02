// stores/useTreatmentStore.ts
import {
  AddTreatmentFormSchema,
  TreatmentComponentSchema,
  TreatmentVisitSchema,
} from "@/schemas";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AddTreatmentStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: z.infer<typeof AddTreatmentFormSchema>;
  setFormData: <T extends keyof AddTreatmentStore["formData"]>(
    section: T,
    data: Partial<AddTreatmentStore["formData"][T]>
  ) => void;
  addVisit: (visit: z.infer<typeof TreatmentVisitSchema>) => void;
  updateVisit: (
    index: number,
    visit: Partial<z.infer<typeof TreatmentVisitSchema>>
  ) => void;
  removeVisit: (index: number) => void;
  addComponent: (component: z.infer<typeof TreatmentComponentSchema>) => void;
  updateComponent: (
    index: number,
    component: Partial<z.infer<typeof TreatmentComponentSchema>>
  ) => void;
  removeComponent: (index: number) => void;
  reset: () => void;
}

export const useTreatmentStore = create<AddTreatmentStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      formData: {
        treatmentBasicInfo: {
          treatmentName: "",
          treatmentCategoryId: "",
          treatmentDescription: "",
        },
        treatmentPriceInfo: {
          price: 0,
          estimatedTime: "",
        },
        treatmentVisits: [],
        treatmentComponents: [],
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
      addVisit: (visit) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentVisits: [...(state.formData.treatmentVisits || []), visit],
          },
        })),
      updateVisit: (index, visit) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentVisits: (state.formData.treatmentVisits || []).map(
              (v, i) => (i === index ? { ...v, ...visit } : v)
            ),
          },
        })),
      removeVisit: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentVisits: (state.formData.treatmentVisits || []).filter(
              (_, i) => i !== index
            ),
          },
        })),
      addComponent: (component) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentComponents: [
              ...(state.formData.treatmentComponents || []),
              component,
            ],
          },
        })),
      updateComponent: (index, component) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentComponents: (state.formData.treatmentComponents || []).map(
              (c, i) => (i === index ? { ...c, ...component } : c)
            ),
          },
        })),
      removeComponent: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            treatmentComponents: (
              state.formData.treatmentComponents || []
            ).filter((_, i) => i !== index),
          },
        })),
      reset: () =>
        set({
          currentStep: 0,
          formData: {
            treatmentBasicInfo: {
              treatmentName: "",
              treatmentCategoryId: "",
              treatmentDescription: "",
            },
            treatmentPriceInfo: {
              price: 0,
              estimatedTime: "",
            },
            treatmentVisits: [],
            treatmentComponents: [],
          },
        }),
    }),
    {
      name: "treatment-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
