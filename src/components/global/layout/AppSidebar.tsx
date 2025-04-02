"use client";

import * as React from "react";
import {
  BarChartIcon,
  ChevronLeft,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./SidebarComponents/nav-user";
import Image from "next/image";
import { Clinic, Role, User } from "@prisma/client";
import Link from "next/link";
import Dashboard from "@/icons/Dashboard";
import { usePathname } from "next/navigation";
import { AdminRoutes, EmployeeRoutes, PatientRoutes } from "@/lib/constants";
import SidebarItems from "./SidebarComponents/sidebar-items";
import { useState } from "react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: (User & { clinic: Clinic | null }) | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { state } = useSidebar();
  const pathName = usePathname();

  const isActive = (url: string) => pathName === url;
  const company = {
    name: "Zendenta",
    subName: "Dental clinic",
    logo: "/assets/icons/zendenta.png",
  };

  const clinic = {
    name: user?.clinic?.name,
    logo: user?.clinic?.imageUrl || "/assets/icons/clinic.svg",
    address: user?.clinic?.address,
  };

  const getRoutes = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return AdminRoutes;
      case Role.EMPLOYEE:
        return EmployeeRoutes;
      case Role.PATIENT:
        return PatientRoutes;
      default:
        return [];
    }
  };

  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='bg-brand-primary-light-neutrals border-r-2 border-r-brand-neutrals/20'
    >
      <SidebarTrigger className='bg-white hover:bg-white shadow-2xl rounded-full absolute -right-3.5 top-4 border border-brand-neutrals/15' />

      <SidebarHeader>
        <div
          className={`flex gap-2 py-2 text-sidebar-accent-foreground items-center ${
            state === "collapsed" && "justify-center"
          }`}
        >
          <div
            className={`flex aspect-square items-center relative justify-center rounded-lg text-sidebar-primary-foreground ${
              state === "collapsed" ? "size-8" : "size-12"
            }`}
          >
            <Image
              src={company.logo}
              alt={company.name}
              width={500}
              height={500}
            />
          </div>
          {state === "expanded" && (
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate text-brand-neutrals header font-semibold'>
                {company.name}
              </span>
              <span className='truncate text-brand-neutrals/75 font-medium'>
                {company.subName}
              </span>
            </div>
          )}
        </div>

        <div
          className={`mt-5 p-2 ${
            state === "expanded"
              ? "px-4 gap-2 rounded-lg justify-start"
              : "justify-center py-3"
          } flex items-center border border-brand-neutrals/15 rounded-md`}
        >
          <div className='flex items-center justify-center aspect-square size-5 rounded-lg bg-brand-neutrals/10'>
            <Image
              src={clinic.logo}
              alt={clinic.name || "Clinic"}
              width={500}
              height={500}
            />
          </div>
          {state === "expanded" && (
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate text-brand-neutrals font-semibold'>
                {clinic.name || "Clinic"}
              </span>
              <span className='truncate text-brand-neutrals/75 font-medium'>
                {clinic.address || "Address"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent
        className={`mt-4 p-2 ${
          state === "expanded" ? "px-3 justify-start" : "py-3"
        } flex items-center`}
      >
        {/* Dashboard Button - Always Shown */}
        <SidebarMenu className='w-full'>
          <Link
            href={"/dashboard"}
            className={`rounded-lg px-3 py-1.5 transition-all text-brand-neutrals font-medium  hover:bg-brand-light-blue/15 hover:text-brand-primary-blue hover:font-medium ${
              isActive("/dashboard") &&
              "bg-brand-light-blue/15 text-brand-primary-blue font-medium"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <SidebarMenuItem className='flex items-center'>
              <Dashboard
                color={isActive("/dashboard") || isHovered ? "#415be7" : ""}
              />
              {state === "expanded" && (
                <span className='ml-2 text-sm'>Dashboard</span>
              )}
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>

        {/* Sidebar Menu */}
        <SidebarItems items={getRoutes()} isActive={isActive} state={state} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
