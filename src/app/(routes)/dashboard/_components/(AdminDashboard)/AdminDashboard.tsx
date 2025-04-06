"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type AdminDashboardProps = {
  user: User | null;
};

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/test");
      console.log(response.data);
      toast.success("Test data added successfully");
      
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Failed to add test data");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
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
      <div>
        <Button variant={"primary"} onClick={onSubmit}>
          {isLoading ? "Loading..." : "Add Test Data"}
        </Button>
      </div>
    </main>
  );
};

export default AdminDashboard;
