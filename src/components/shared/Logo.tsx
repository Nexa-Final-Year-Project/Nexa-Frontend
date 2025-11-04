"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  /** Image source path */
  src?: string;
  /** Alt text for the logo image */
  alt?: string;
  /** Show/hide the "NEXA" text */
  showText?: boolean;
  /** Show/hide the tagline */
  showTagline?: boolean;
  /** Custom tagline text */
  tagline?: string;
  /** Image dimensions - number or string (e.g. 64 or "64px") */
  size?: number | string;
  /** Text size - tailwind class or CSS value */
  textSize?: string;
  /** Gap between logo and text - tailwind class or CSS value */
  gap?: string;
  /** Custom class for the container */
  className?: string;
  /** Custom class for the image */
  imageClass?: string;
  /** Custom class for the main text */
  textClass?: string;
  /** Custom class for the tagline */
  taglineClass?: string;
}

const Logo = ({
  src = "/logo.svg",
  alt = "Nexa Logo",
  showText = true,
  showTagline = false,
  tagline = "Smart Project Management",
  size = 48,
  textSize = "text-2xl",
  gap = "space-x-3",
  className = "",
  imageClass = "",
  textClass = "font-bold bg-gradient-stone",
  taglineClass = "text-sm text-muted-foreground",
}: LogoProps) => {
  // Handle size prop (number or string)
  const sizeValue = typeof size === "number" ? `${size}px` : size;
  const sizeStyle = { width: sizeValue, height: sizeValue };
  const { theme } = useTheme();
  const colorClass = theme === "light" ? "text-black" : "text-white";

  return (
    <Link
      href="/"
      className={`flex flex-col ${className} group-data-[collapsible=icon]:items-center`}
    >
      <div
        className={`flex items-center ${gap} group-data-[collapsible=icon]:justify-center`}
      >
        <div className="relative" style={sizeStyle}>
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-contain ${imageClass}`}
          />
        </div>
        {showText && (
          <h1
            className={`${textSize} ${textClass} ${colorClass} group-data-[collapsible=icon]:hidden`}
          >
            NEXA
          </h1>
        )}
      </div>
      {showTagline && <p className={`mt-1 ${taglineClass}`}>{tagline}</p>}
    </Link>
  );
};

export default Logo;
