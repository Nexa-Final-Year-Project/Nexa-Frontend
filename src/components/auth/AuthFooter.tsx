// components/ui/auth/AuthFooter.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button/Button";

type AuthFooterProps = {
  text: string;
  linkText: string;
  href: string;
  className?: string;
};

export function AuthFooter({
  text,
  linkText,
  href,
  className,
}: AuthFooterProps) {
  return (
    <div className={`text-center text-sm ${className}`}>
      <span className="text-muted-foreground">{text}</span>{" "}
      <Link href={href} className="text-primary hover:text-primary/80">
        {linkText}
      </Link>
    </div>
  );
}
