import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CalendarSkelton = () => {
  return (
    <div className='border rounded-lg overflow-hidden'>
      <div className='grid grid-cols-[100px_repeat(3,1fr)] bg-brand-neutrals/5'>
        <Skeleton className='h-16 m-2' />
        <Skeleton className='h-16 m-2' />
        <Skeleton className='h-16 m-2' />
        <Skeleton className='h-16 m-2' />
      </div>
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`row-${i}`}
            className='grid grid-cols-[100px_repeat(3,1fr)]'
          >
            <Skeleton key={`time-${i}`} className='h-20 m-2' />
            <Skeleton key={`cell-1-${i}`} className='h-20 m-2' />
            <Skeleton key={`cell-2-${i}`} className='h-20 m-2' />
            <Skeleton key={`cell-3-${i}`} className='h-20 m-2' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSkelton;
