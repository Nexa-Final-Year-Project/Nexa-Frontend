import UserLayout from "@/layouts/UserLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXA | Authentication",
  description: "Project management tool authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
