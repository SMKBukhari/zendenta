"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RouteItems } from "@/types";

type Props = {
  items: RouteItems[];
  isActive: (url: string) => boolean;
  state: string;
};

const SidebarItems = ({ items, isActive, state }: Props) => {
  const [hoveredItem, setHoveredItem] = useState<{
    groupIndex: number;
    routeIndex: number;
  } | null>(null);

  return (
    <>
      {items.map((item, groupIndex) => (
        <SidebarGroup key={groupIndex}>
          <SidebarGroupLabel className='group-data-[collapsible=icon]:-mt-3 text-brand-neutrals/55 font-bold'>
            {item.group}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.routes.map((route, routeIndex) => {
                const IconComponent = route.icon;
                const isHovered =
                  hoveredItem?.groupIndex === groupIndex &&
                  hoveredItem?.routeIndex === routeIndex;

                return (
                  <Link
                    key={`${groupIndex}-${routeIndex}`}
                    href={route.path}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 transition-all text-brand-neutrals font-medium hover:bg-brand-light-blue/15 hover:text-brand-primary-blue",
                      isActive(route.path) &&
                        "bg-brand-light-blue/15 text-brand-primary-blue"
                    )}
                    onMouseEnter={() =>
                      setHoveredItem({ groupIndex, routeIndex })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <SidebarMenuItem className='flex items-center'>
                      {IconComponent && (
                        <IconComponent
                          color={
                            isActive(route.path) || isHovered ? "#415be7" : ""
                          }
                        />
                      )}
                      {state === "expanded" && (
                        <span className='ml-2 text-sm'>{route.name}</span>
                      )}
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarItems;
