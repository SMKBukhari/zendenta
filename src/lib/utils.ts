import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPageTitle = (path: string) => {
  // Remove leading slash and split path segments
  const segments = path.replace(/^\//, "").split("/");

  // Get the base path (first segment)
  const basePath = segments[0] || "dashboard";

  // Special cases
  if (basePath === "") return "Dashboard";

  // Format the title (capitalize first letter, replace hyphens with spaces)
  return basePath
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

