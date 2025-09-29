"use client";
import Dashboard from "@/components/user/dashboard/Dashboard";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id } = useParams();
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
