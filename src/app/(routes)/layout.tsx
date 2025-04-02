"use client";
import { AppSidebar } from "@/components/global/layout/AppSidebar";
import Header from "@/components/global/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSigninStore } from "@/store/useSigninStore";
import { Clinic, User } from "@prisma/client";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/global/skelton/DashboardSkelton";
import { KBarWrapper } from "@/providers/kbdProvider";
import { KBarModal } from "@/components/global/layout/HeaderComponents/kbar-modal";

type Props = {
  children: React.ReactNode;
};

type UserWithClinic = User & {
  clinic: Clinic | null;
};

const RoutesLayout = ({ children }: Props) => {
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
    <KBarWrapper role={user?.role}>
      <SidebarProvider>
        <div className='min-h-screen flex w-full'>
          {/* Sidebar */}
          <AppSidebar user={user} />
          <SidebarInset>
            {/* Main Content */}
            <div className='flex-1 flex flex-col'>
              {/* Header */}
              <Header userProfile={user} />

              {/* Content */}
              <main className='flex-1 overflow-auto p-4 md:px-6'>
                {children}
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <KBarModal />
    </KBarWrapper>
  );
};

export default RoutesLayout;
