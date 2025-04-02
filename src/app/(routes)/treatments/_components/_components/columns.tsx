"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type TreatmentColumns = {
  id: string;
  treatmentName: string;
  price: number;
  estimateDuration: string;
  typeOfVisit: string;
  rating: string;
  review: string;
};

export const columns: ColumnDef<TreatmentColumns>[] = [
  {
    accessorKey: "treatmentName",
    header: "TREATMENT NAME",
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className='text-brand-neutrals gap-2'>
          <span className='text-brand-neutrals/50 font-medium mr-1'>
            Start From
          </span>
          {`$${price.toFixed(0)}`}
        </div>
      );
    },
  },
  {
    accessorKey: "estimateDuration",
    header: "ESTIMATE DURATION",
    cell: ({ row }) => {
      const duration = row.getValue("estimateDuration") as string;
      return (
        <div className='flex gap-2 text-brand-neutrals'>
          <span className='text-brand-neutrals/60 font-medium'>≅</span>
          <span>{duration}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "typeOfVisit",
    header: "TYPE OF VISIT",
    cell: ({ row }) => {
      const typeOfVisit = row.getValue("typeOfVisit") as string;
      return (
        <Badge
          variant={
            typeOfVisit === "SINGLE VISIT"
              ? "brandSecondary"
              : typeOfVisit === "MULTIPLE VISIT"
              ? "brandPrimary"
              : "brandSecondary"
          }
        >
          {typeOfVisit}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "RATING",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as string;
      return rating === "No Rating" ? (
        <span className='text-brand-neutrals'>{rating}</span>
      ) : (
        <div className='flex gap-2 text-brand-neutrals'>
          <span>⭐</span>
          <span>{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "review",
    header: "REVIEW",
    cell: ({ row }) => {
      const review = row.getValue("review") as string;
      return (
        <div className='flex gap-2 text-brand-neutrals'>
          <span>{review}</span>
          {review !== "0 Review(s)" && <span>Review(s)</span>}
        </div>
      );
    },
  },
];
