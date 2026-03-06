import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes with conflict resolution (shadcn/ui standard).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
