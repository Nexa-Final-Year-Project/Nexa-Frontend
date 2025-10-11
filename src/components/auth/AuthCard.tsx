"use client";

import { AnimatedDiv } from "@/components/shared/AnimatedDiv";
import { Card } from "../ui/card/Card";
import { cn } from "@/lib/utils/utils";
import Logo from "@/components/shared/Logo";
// import { Card } from '@/_components/ui/card';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
};

export const AuthCard = ({
  title,
  subtitle,
  children,
  className,
}: AuthCardProps) => {
  return (
    <AnimatedDiv variant="fade" direction="up" className="max-w-md w-full ">
      <Card className=" p-8 space-y-6 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Logo size={64} textSize="text-4xl" />
        </div>

        <div className="space-y-2 text-center ">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm">{subtitle}</p>
        </div>
        {children}
      </Card>
     </AnimatedDiv>
  );
};
