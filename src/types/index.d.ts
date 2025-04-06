import {
  Treatment,
  TreatmentCategory,
  TreatmentReviews,
  TreatmentVisit,
  User,
  UserTreatment,
  WorkingHours,
} from "@prisma/client";
/* no-unused-vars */

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare type RouteItems = {
  group: string;
  routes: Route[];
};

declare type TreatmentWithRelations = Treatment & {
  treatmentVisit: TreatmentVisit[];
  treatmentCategory: TreatmentCategory | null;
  treatmentReviews: TreatmentReviews[];
};

declare type StaffWithRelations = User & {
  workingHours: WorkingHours[];
  assignedTreatments: (UserTreatment & {
    treatment: Treatment;
  })[];
};

declare type AssignedServiceCategoryWithRelations = TreatmentCategory & {
  treatments: Treatment[];
};

declare type TreatmentsArray = TreatmentWithRelations[];

declare type StaffArray = StaffWithRelations[];

declare type AssignedServiceCategoryArray =
  AssignedServiceCategoryWithRelations[];

declare interface Treatment {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
  isActive: boolean;
  category?: "Medical Service" | "Cosmetic Service";
}

declare type TreatmentsArray = Treatment[];

declare interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  position?: number;
  isNested?: boolean;
}

declare interface Visit {
  id: string;
  treatmentName: string;
  duration: string;
  description?: string;
  componentsUsed?: boolean;
  day?: number;
}

declare interface Dentist {
  id: string;
  name: string;
  imageUrl: string | null;
  specialty: string | null;
  jobType: string | null;
  appointmentCount: number;
}

declare type ReservationStatus =
  | "FINISHED"
  | "DOING_TREATMENT"
  | "REGISTERED"
  | "WAITING_PAYMENT";

declare interface Reservation {
  id: string;
  patientName: string;
  patientId: string;
  dentistId: string;
  dentistName: string;
  treatmentId: string;
  treatmentName: string;
  date: string;
  time: string;
  status: ReservationStatus;
  quickNote?: string;
}

declare interface DraggedReservation {
  id: string;
  dentistId: string;
  timeSlot: string;
  patientName: string;
  treatmentName: string;
  status: ReservationStatus;
  time: string;
}