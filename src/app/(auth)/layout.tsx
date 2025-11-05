import type { Metadata } from "next";
import { AuthBackground } from "@/components/auth/AuthBackground";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "NEXA | Authentication",
  description: "Project management tool authentication",
};

// This layout is used for all authentication-related pages
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthBackground>{children}</AuthBackground>;
}
