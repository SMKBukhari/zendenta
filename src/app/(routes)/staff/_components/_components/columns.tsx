"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type StaffColumns = {
  id: string;
  staffName: string;
  contactNo: string;
  email: string;
  jobType: string;
};

export const columns: ColumnDef<StaffColumns>[] = [
  {
    accessorKey: "staffName",
    header: "STAFF NAME",
  },
  {
    accessorKey: "contactNo",
    header: "CONTACT",
    cell: ({ row }) => {
      const contactNo = row.getValue("contactNo") as string;
      const email = row.getValue("email") as string;
      return (
        <div className='text-brand-neutrals flex flex-col gap-2'>
          <span className='font-medium'>{contactNo}</span>
          <span className='text-brand-primary-blue font-medium'>{email}</span>
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
