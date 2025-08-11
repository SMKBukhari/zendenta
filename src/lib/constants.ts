import CalendarCheckIcon from "@/icons/CalendarCheck";
import Category from "@/icons/Category";
import ChartBar from "@/icons/ChartBar";
import Component from "@/icons/Components";
import EditUser from "@/icons/EditUser";
import MedicineBottle from "@/icons/MedicineBottle";
import Money from "@/icons/Money";
import Receipt from "@/icons/Receipt";
import Settings from "@/icons/Settings";
import Staff from "@/icons/Staff";
import StethoScope from "@/icons/StethoScope";
import Stretcher from "@/icons/Stretcher";
import UserCircle from "@/icons/UserCircle";

export const Roles = ["PATIENT", "ADMIN"];

export const TreatmentCategories = ["Medical Service", "Cosmetic Service"];

export const FreeOptions = [
  { value: "totallyFree", label: "Totally Free" },
  { value: "freeUpTo", label: "Free up to" },
];

export const SpecialtyOptions = [
  {
    value: "Pediatric Dentistry",
    label: "Pediatric Dentistry",
  },
  { value: "Orthodontics", label: "Orthodontics" },
  { value: "Periodontics", label: "Periodontics" },
  { value: "Endodontics", label: "Endodontics" },
  { value: "Oral Surgery", label: "Oral Surgery" },
  { value: "Prosthodontics", label: "Prosthodontics" },
  { value: "General Dentistry", label: "General Dentistry" },
];

export const JobType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
} as const;

export const JobTypeOption = [
  { value: JobType.FULL_TIME, label: "Full Time" },
  { value: JobType.PART_TIME, label: "Part Time" },
];

// Working days enum
export const WeekDays = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
} as const;

export const Gender = ["MALE", "FEMALE", "OTHER"];

export const GenderOptions = [
  { value: "MALE", name: "Male" },
  { value: "FEMALE", name: "Female" },
];

export const EstimatedTime = [
  { value: "15 minutes", label: "15 minutes" },
  { value: "30 minutes", label: "30 minutes" },
  { value: "45 minutes", label: "45 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "1 hour 30 minutes", label: "1 hour 30 minutes" },
  { value: "2 hours", label: "2 hours" },
  { value: "2 hours 30 minutes", label: "2 hours 30 minutes" },
  { value: "3 hours", label: "3 hours" },
  { value: "3 hours 30 minutes", label: "3 hours 30 minutes" },
  { value: "4 hours", label: "4 hours" },
];

export const BasicRoutes = [
  {
    name: "Profile",
    path: "/profile",
    icon: EditUser,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const AddButtons = [
  {
    name: "Add Patient",
    icon: UserCircle,
  },
  {
    name: "Add Treatment",
    icon: StethoScope,
  },
  {
    name: "Add Staff",
    icon: Staff,
  },
  {
    name: "Add Component",
    icon: Component,
  },
  {
    name: "Add Category",
    icon: Category,
  },
];

export const AdminRoutes = [
  {
    group: "CLINIC",
    routes: [
      { name: "Reservations", path: "/reservations", icon: CalendarCheckIcon },
      { name: "Patients", path: "/patients", icon: UserCircle },
      { name: "Treatments", path: "/treatments", icon: StethoScope },
      { name: "Staff List", path: "/staff", icon: Staff },
    ],
  },
  {
    group: "FINANCE",
    routes: [
      { name: "Accounts", path: "/accounts", icon: Money },
      { name: "Sales", path: "/sales", icon: ChartBar },
      { name: "Purchases", path: "/purchases", icon: Receipt },
    ],
  },
  {
    group: "PHYSICAL ASSET",
    routes: [
      { name: "Stocks", path: "/stocks", icon: MedicineBottle },
      { name: "Peripherals", path: "/peripherals", icon: Stretcher },
    ],
  },
];

export const EmployeeRoutes = [
  {
    group: "CLINIC",
    routes: [
      { name: "Reservations", path: "/reservations" },
      { name: "Patients", path: "/patients" },
    ],
  },
];

export const PatientRoutes = [
  {
    group: "CLINIC",
    routes: [{ name: "Reservations", path: "/reservations" }],
  },
];

// Animation variants
export const stepVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    };
  },
};
