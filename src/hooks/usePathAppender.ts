"use client";
import { usePathname, useRouter } from "next/navigation";

export const usePathAppender = () => {
  const router = useRouter();
  const pathname = usePathname();

  const appendToPath = (subPath: string) => {
    if (!subPath.startsWith("/")) {
      subPath = "/" + subPath;
    }

    const cleanPath = pathname.replace(/\/$/, "");

    // Prevent duplicate subPath
    if (!cleanPath.endsWith(subPath)) {
      router.push(`${cleanPath}${subPath}`);
    }
  };

  return appendToPath;
};
