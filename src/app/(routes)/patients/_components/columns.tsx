import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type PatientColumns = {
  id: string;
  patientName: string;
  contactNo: string;
  email: string;
  status: string;
  primaryDentist: string;
  createdBy: string;
  lastVisit: string;
  medicalHistoryCount: number;
};

export const columns: ColumnDef<PatientColumns>[] = [
  {
    accessorKey: "patientName",
    header: "PATIENT NAME",
    cell: ({ row }) => (
      <span className='font-medium text-brand-neutrals'>
        {row.original.patientName}
      </span>
    ),
  },
  {
    accessorKey: "contactInfo",
    header: "CONTACT INFO",
    cell: ({ row }) => (
      <div className='text-brand-neutrals flex flex-col gap-2'>
        <span className='font-medium'>{row.original.contactNo}</span>
        <span className='text-brand-primary-blue font-medium'>
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "primaryDentist",
    header: "PRIMARY DENTIST",
    cell: ({ row }) => (
      <span className='text-brand-neutrals'>{row.original.primaryDentist}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "ACTIVE"
            ? "brandPrimary"
            : row.original.status === "INACTIVE"
            ? "brandSecondary"
            : "outline"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: "LAST VISIT",
    cell: ({ row }) => (
      <span className='text-brand-neutrals'>{row.original.lastVisit}</span>
    ),
  },
  {
    accessorKey: "medicalHistoryCount",
    header: "MEDICAL RECORDS",
    cell: ({ row }) => (
      <span className='text-brand-neutrals'>
        {row.original.medicalHistoryCount} records
      </span>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "CREATED BY",
    cell: ({ row }) => (
      <span className='text-brand-neutrals'>{row.original.createdBy}</span>
    ),
  },
];