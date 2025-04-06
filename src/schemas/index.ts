import { JobType, WeekDays } from "@/lib/constants";
import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignUpFormSchema = z.object({
  role: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long"),
  phoneNumber: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  gender: z.string(),
  birthDate: z.string(),
});

export const CompanyConfigFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phoneNumber: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  imageUrl: z.string(),
  address: z.string(),
});

export const TreatmentBasicInfoSchema = z.object({
  treatmentName: z.string().min(2, "Name must be at least 2 characters long"),
  treatmentCategoryId: z.string().min(1, "Category is required"),
  treatmentDescription: z.string().optional(),
});

export const TreatmentPriceInfoSchema = z.object({
  price: z
    .union([
      z.number().min(0, "Price must be a positive number"),
      z.string().transform((val) => parseFloat(val)),
    ])
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Price must be a positive number",
    }),
  estimatedTime: z.string().optional(),
});

export const TreatmentVisitSchema = z.object({
  treatmentVisitName: z.string().min(2, "Name must be at least 2 characters"),
  treatmentVisitDescription: z.string().optional(),
  TreatmentVisitPrice: z
    .union([
      z.number().min(0, "Price must be a positive number"),
      z.string().transform((val) => parseFloat(val)),
    ])
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Price must be a positive number",
    }),
  treatmentVisitEstimatedTime: z.string().optional(),
});

export const TreatmentComponentSchema = z.object({
  treatmentComponentsId: z.string().min(1, "Component is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
});

export const AddTreatmentFormSchema = z.object({
  treatmentBasicInfo: TreatmentBasicInfoSchema,
  treatmentPriceInfo: TreatmentPriceInfoSchema,
  treatmentVisits: z.array(TreatmentVisitSchema).optional(),
  treatmentComponents: z.array(TreatmentComponentSchema).optional(),
});

export const StaffBasicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  jobType: z.enum([JobType.FULL_TIME, JobType.PART_TIME]),
  specialty: z.string().min(2, "Specialty must be at least 2 characters long"),
  phoneNumber: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone) || /^\d{10,15}$/.test(phone),
      "Invalid phone number"
    ),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  imageUrl: z.string().optional(),
});

export const StaffWorkingHoursSchema = z.object({
  day: z.enum([
    WeekDays.MONDAY,
    WeekDays.TUESDAY,
    WeekDays.WEDNESDAY,
    WeekDays.THURSDAY,
    WeekDays.FRIDAY,
    WeekDays.SATURDAY,
    WeekDays.SUNDAY,
  ]),
  isWorking: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const AssignedServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAssigned: z.boolean().default(false),
});

export const AddStaffFormSchema = z.object({
  staffBasicInfo: StaffBasicInfoSchema,
  staffWorkingHours: z.array(StaffWorkingHoursSchema),
  assignedServices: z.array(AssignedServiceSchema).optional(),
});

export const AddCategoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export const AddComponentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  price: z
    .union([
      z.number().min(0, "Price must be a positive number"),
      z.string().transform((val) => parseFloat(val)),
    ])
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Price must be a positive number",
    }),
});

// Step 1: Treatment & Dentist Info
export const ReservationTreatmentInfoSchema = z.object({
  treatmentId: z.string().min(1, "Treatment is required"),
  dentistId: z.string().min(1, "Dentist is required"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  quickNote: z.string().optional(),
});

// Step 2: Patient Basic Information
export const ReservationPatientInfoSchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["Male", "Female"]),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
});

// Step 3: Oral Hygiene Habits
export const ReservationOralHygieneSchema = z.object({
  lastVisit: z.string(),
  dentalCareStart: z.string(),
  brushingFrequency: z.string(),
  usesMouthwash: z.string(),
  usesDentalFloss: z.string(),
});

// Complete reservation form schema
export const AddReservationFormSchema = z.object({
  treatmentInfo: ReservationTreatmentInfoSchema,
  patientInfo: ReservationPatientInfoSchema,
  oralHygieneInfo: ReservationOralHygieneSchema,
});

// Export types for use in other files
export type ReservationTreatmentInfo = z.infer<
  typeof ReservationTreatmentInfoSchema
>;
export type ReservationPatientInfo = z.infer<
  typeof ReservationPatientInfoSchema
>;
export type ReservationOralHygieneInfo = z.infer<
  typeof ReservationOralHygieneSchema
>;
export type AddReservationForm = z.infer<typeof AddReservationFormSchema>;

export type StaffBasicInfo = z.infer<typeof StaffBasicInfoSchema>;
export type WorkingHours = z.infer<typeof StaffWorkingHoursSchema>;
export type AssignedService = z.infer<typeof AssignedServiceSchema>;
export type AddStaffForm = z.infer<typeof AddStaffFormSchema>;
