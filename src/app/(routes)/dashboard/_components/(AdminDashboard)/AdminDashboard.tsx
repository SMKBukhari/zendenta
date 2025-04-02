import { User } from "@prisma/client";
import { format } from "date-fns";
import React from "react";

type AdminDashboardProps = {
  user: User | null;
};

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");
  return (
    <main>
      <div className='flex flex-col'>
        <h1 className='text-lg text-brand-neutrals font-medium'>
          Good morning, {user?.name}!
        </h1>
        <span className='text-brand-neutrals/70 font-medium'>
          {formattedDate}
        </span>
      </div>
    </main>
  );
};

export default AdminDashboard;
