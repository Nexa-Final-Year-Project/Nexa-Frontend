import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  const processed = clsx(...inputs); // Handle arrays/objects/conditionals
  return twMerge(processed); // Merge Tailwind classes
};

export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};
