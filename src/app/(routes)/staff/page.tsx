"use client";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { useSigninStore } from "@/store/useSigninStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StaffArray } from "@/types";
import AdminStaff from "./_components/AdminStaff";

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffArray | null>(null);
  const { userId } = useSigninStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const getStaff = await axios.post("/api/treatments/getAllStaff", {
          userId,
        });
        setStaff(getStaff.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <div>
      <AdminStaff staff={staff} />
    </div>
  );
}
