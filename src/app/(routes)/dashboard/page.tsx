"use client";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { useSigninStore } from "@/store/useSigninStore";
import { Clinic, User } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminDashboard from "./_components/(AdminDashboard)/AdminDashboard";

type UserWithClinic = User & {
  clinic: Clinic | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserWithClinic | null>(null);
  const { userId } = useSigninStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post("/api/user/getUserProfile", {
          id: userId,
        });

        const userData = response.data as UserWithClinic;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <div>
      {user?.role === "ADMIN" && <AdminDashboard user={user} />}
      {user?.role === "EMPLOYEE" && <h1>Employee Dashboard</h1>}
      {user?.role === "PATIENT" && <h1>Patient Dashboard</h1>}
    </div>
  );
}
