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
