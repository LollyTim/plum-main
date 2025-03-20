import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Nigerian Naira
 * @param amount The amount to format
 * @returns Formatted amount with Naira symbol (₦)
 */
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
