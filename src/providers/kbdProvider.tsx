// app/providers.tsx
"use client";

import { AdminRoutes, EmployeeRoutes, PatientRoutes } from "@/lib/constants";
import { KBarProvider, useKBar, Action } from "kbar";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function KBarWrapper({
  children,
  role = "PATIENT",
}: {
  children: ReactNode;
  role?: "ADMIN" | "EMPLOYEE" | "PATIENT";
}) {
  const router = useRouter();

  // Get routes based on user role
  const routes =
    role === "ADMIN"
      ? AdminRoutes
      : role === "EMPLOYEE"
      ? EmployeeRoutes
      : PatientRoutes;

  // Transform routes into KBar actions with proper typing
  const actions: Action[] = routes.flatMap((group) => {
    return group.routes.map((route) => ({
      id: route.path,
      name: route.name,
      section: group.group,
      perform: () => router.push(route.path),
      shortcut: [], // You can add shortcuts here if needed
    }));
  });

  // Add a default search action with properly typed shortcut
  actions.unshift({
    id: "search",
    name: "Search...",
    shortcut: ["/"] as string[],
    keywords: "search find",
    section: "Navigation",
    perform: () => document.getElementById("kbar-search")?.focus(),
  });

  return (
    <KBarProvider actions={actions}>
      <KeyboardShortcuts />
      {children}
    </KBarProvider>
  );
}

function KeyboardShortcuts() {
  const { query } = useKBar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        query.toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  return null;
}
