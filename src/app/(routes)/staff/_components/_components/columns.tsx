"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type StaffColumns = {
  id: string;
  staffName: string;
  contactNo: string;
  email: string;
  jobType: string;
  workingDays?: { day: string; isWorking: boolean }[];
  assignedTreatments?: { id: string; name: string }[];
};

export const columns: ColumnDef<StaffColumns>[] = [
  {
    accessorKey: "staffName",
    header: "STAFF NAME",
    cell: ({ row }) => {
      const staffName = row.original.staffName;
      return (
        <span className='font-medium text-brand-neutrals'>{staffName}</span>
      );
    },
  },
  {
    accessorKey: "contactNo",
    header: "CONTACT",
    cell: ({ row }) => {
      const contactNo = row.original.contactNo;
      const email = row.original.email;
      return (
        <div className='text-brand-neutrals flex flex-col gap-2'>
          <span className='font-medium text-brand-neutrals'>{contactNo}</span>
          <span className='text-brand-primary-blue font-medium'>{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "workingDays",
    header: "WORKING DAYS",
    cell: ({ row }) => {
      const workingDays = row.original.workingDays || [];
      const days = ["S", "M", "T", "W", "T", "F", "S"];

      return (
        <div className='flex gap-1'>
          {days.map((day, index) => {
            const isWorking = workingDays.some(
              (wd) => wd.day.charAt(0).toUpperCase() === day && wd.isWorking
            );

            return (
              <div
                key={index}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  isWorking
                    ? "bg-brand-light-blue text-white"
                    : "bg-brand-neutrals/10 text-brand-neutrals"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "assignedTreatments",
    header: "ASSIGNED TREATMENT",
    cell: ({ row }) => {
      const treatments = row.original.assignedTreatments || [];

      if (treatments.length === 0) {
        return (
          <span className='text-brand-neutrals/70'>No treatments assigned</span>
        );
      }

      return (
        <div className='flex flex-col gap-1'>
          {treatments.slice(0, 2).map((treatment, index) => (
            <span key={index} className='text-brand-neutrals font-medium'>
              {treatment.name}
            </span>
          ))}
          {treatments.length > 2 && (
            <span className='text-brand-primary-blue font-medium'>
              +{treatments.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "jobType",
    header: "TYPE",
    cell: ({ row }) => {
      const jobType = row.getValue("jobType") as string;
      return (
        <Badge
          variant={
            jobType === "FULL_TIME"
              ? "brandSecondary"
              : jobType === "PART_TIME"
              ? "brandPrimary"
              : "brandSecondary"
          }
        >
          {jobType === "FULL_TIME" ? "Full-Time" : "Part-Time"}
        </Badge>
      );
    },
  },
];
