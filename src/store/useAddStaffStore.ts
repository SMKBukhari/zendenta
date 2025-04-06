import { JobType, WeekDays } from "@/lib/constants";
import { AddStaffForm, StaffBasicInfo, WorkingHours } from "@/schemas";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AddStaffStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: AddStaffForm;
  setStaffBasicInfo: (data: Partial<StaffBasicInfo>) => void;
  setAssignedService: (serviceId: string, isAssigned: boolean) => void;
  updateWorkingHours: (
    day: string,
    isWorking: boolean,
    startTime?: string,
    endTime?: string
  ) => void;
  reset: () => void;
}

// Initialize default working hours for all days of the week
const initializeWorkingHours = (): WorkingHours[] => {
  return Object.values(WeekDays).map((day) => ({
    day,
    isWorking: day !== WeekDays.SUNDAY && day !== WeekDays.SATURDAY, // Default weekdays as working days
    startTime: "09:00 am",
    endTime: "05:00 pm",
  }));
};

export const useAddStaffStore = create<AddStaffStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      formData: {
        staffBasicInfo: {
          name: "",
          jobType: JobType.FULL_TIME,
          specialty: "",
          phoneNumber: "",
          email: "",
          address: "",
          imageUrl: "",
        },
        assignedServices: [], // Initialize as empty array
        staffWorkingHours: initializeWorkingHours(),
      },
      setStaffBasicInfo: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            staffBasicInfo: {
              ...state.formData.staffBasicInfo,
              ...data,
            },
          },
        })),
      setAssignedService: (serviceId, isAssigned) =>
        set((state) => {
          // Log for debugging
          console.log("Setting service", serviceId, "to", isAssigned);
          console.log("Current services:", state.formData.assignedServices);

          // Check if the service already exists in the array
          const existingServiceIndex =
            state.formData.assignedServices?.findIndex(
              (service) => service.id === serviceId
            );

          const updatedServices = [...(state.formData.assignedServices || [])];

          if (
            existingServiceIndex !== -1 &&
            existingServiceIndex !== undefined
          ) {
            // Update existing service
            updatedServices[existingServiceIndex] = {
              ...updatedServices[existingServiceIndex],
              isAssigned,
            };
          } else {
            // Service doesn't exist yet, add it with required properties
            updatedServices.push({
              id: serviceId,
              name: "Unknown Service", // This will be replaced when we have the full data
              isAssigned,
            });
          }

          // Log the updated services
          console.log("Updated services:", updatedServices);

          // Return the new state
          return {
            formData: {
              ...state.formData,
              assignedServices: updatedServices,
            },
          };
        }),
      updateWorkingHours: (day, isWorking, startTime, endTime) =>
        set((state) => {
          const updatedWorkingHours = state.formData.staffWorkingHours.map(
            (wh) =>
              wh.day === day
                ? {
                    ...wh,
                    isWorking,
                    startTime: isWorking
                      ? startTime || wh.startTime
                      : undefined,
                    endTime: isWorking ? endTime || wh.endTime : undefined,
                  }
                : wh
          );

          return {
            formData: {
              ...state.formData,
              staffWorkingHours: updatedWorkingHours,
            },
          };
        }),
      reset: () =>
        set({
          currentStep: 0,
          formData: {
            staffBasicInfo: {
              name: "",
              jobType: JobType.FULL_TIME,
              specialty: "",
              phoneNumber: "",
              email: "",
              address: "",
              imageUrl: "",
            },
            assignedServices: [],
            staffWorkingHours: initializeWorkingHours(),
          },
        }),
    }),
    {
      name: "add-staff-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
