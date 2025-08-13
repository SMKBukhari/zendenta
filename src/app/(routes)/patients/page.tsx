"use client";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { useSigninStore } from "@/store/useSigninStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import type { PatientsArray } from "@/types";
import AdminPatients from "./_components/AdminPatients";

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientsArray | null>(null);
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
        const response = await axios.get("/api/patients/getAll");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
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
      <AdminPatients patients={patients} />
    </div>
  );
}
