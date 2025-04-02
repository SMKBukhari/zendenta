"use client";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { useSigninStore } from "@/store/useSigninStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminTreatments from "./_components/AdminTreatments";
import { TreatmentsArray } from "@/types";
import { TreatmentCategory, TreatmentComponents } from "@prisma/client";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<TreatmentsArray | null>(null);
  const [categories, setCategories] = useState<TreatmentCategory[] | null>(
    null
  );
  const [components, setComponents] = useState<TreatmentComponents[] | null>(
    null
  );
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
        const getTreatments = await axios.post(
          "/api/treatments/getAllTreatments",
          { userId }
        );
        const getCategories = await axios.post(
          "/api/categories/getAllCategories",
          { userId }
        );
        const getComponents = await axios.post(
          "/api/components/getAllComponents",
          { userId }
        );
        setTreatments(getTreatments.data);
        setCategories(getCategories.data);
        setComponents(getComponents.data);
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
      <AdminTreatments
        treatments={treatments}
        categories={categories}
        components={components}
      />
    </div>
  );
}
