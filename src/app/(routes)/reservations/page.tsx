"use client";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { useSigninStore } from "@/store/useSigninStore";
import { Clinic, Treatment, User } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminReservations from "./_components/(AdminReservations)/AdminReservations";

type UserWithClinic = User & {
  clinic: Clinic | null;
};

export default function ReservationsPage() {
  const [user, setUser] = useState<UserWithClinic | null>(null);
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
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

        const getTreatments = await axios.post(
          "/api/treatments/getAllTreatments",
          { userId }
        );

        const treatmentsData = await getTreatments.data as Treatment[];
        const userData = response.data as UserWithClinic;
        setUser(userData);
        setTreatments(treatmentsData);
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
      {user?.role === "ADMIN" && (
        <AdminReservations user={user} treatments={treatments} />
      )}
      {user?.role === "EMPLOYEE" && <h1>Employee Reservations</h1>}
      {user?.role === "PATIENT" && <h1>Patient Reservations</h1>}
    </div>
  );
}
