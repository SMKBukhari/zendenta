import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className='space-y-8 p-6'>
      {/* Header Section */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-6 w-64' />
      </div>

      {/* Clinic and Reservations Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-48' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-48' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-48' />
        </div>
      </div>

      {/* Finance Section */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-32' />
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-20 rounded-lg' />
          ))}
        </div>
      </div>

      {/* Physical Asset Section */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-32' />
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-20 rounded-lg' />
          ))}
        </div>
      </div>

      {/* Total Asset Value */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-full max-w-xs' />
        <Skeleton className='h-6 w-32' />
      </div>

      {/* Inventory Section */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Search Order Section */}
      <div className='space-y-4'>
        <Skeleton className='h-10 w-64' />

        {/* Table Skeleton */}
        <div className='space-y-2'>
          {/* Table Header */}
          <div className='grid grid-cols-6 gap-4'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-6' />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className='grid grid-cols-6 gap-4'>
              <Skeleton className='h-12' />
              <Skeleton className='h-12' />
              <Skeleton className='h-12' />
              <Skeleton className='h-12' />
              <Skeleton className='h-12' />
              <Skeleton className='h-12' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
