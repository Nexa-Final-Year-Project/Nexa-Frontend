import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, className, children }) => {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop();
  return (
    <Link href={`${currentPath}/${to}`} className={className}>
      {children}
    </Link>
  );
};

export default CustomLink;
