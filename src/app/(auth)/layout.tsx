import type { Metadata } from "next";
import { AuthBackground } from "@/components/auth/AuthBackground";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/shared/Logo";

// This file defines the layout for all authentication-related pages (e.g., login, register).
export const metadata: Metadata = {
  title: "NEXA | Authentication",
  description: "Project management tool authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBackground>{children}</AuthBackground>;
}
