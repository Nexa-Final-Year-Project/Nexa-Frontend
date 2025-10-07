// components/ui/auth/SocialButtons.tsx
"use client";

import { Button } from "@/components/ui/button/Button";
import {
  providers,
  SocialProvider,
} from "@/lib/constants/auth/providersConstants";
import { motion } from "framer-motion";


const BASE_URL = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL : process.env.NEXT_PUBLIC_PROD_BACKEND_URL;
export function SocialButton({
  provider,
  onClick,
  className = "",
}: {
  provider: SocialProvider;
  onClick: () => void;
  className?: string;
}) {
  const providerConfig = providers[provider];
  if (!providerConfig) {
    return null;
  }
  const { Icon, label, brandColor, textColor = "#000" } = providerConfig;

  return (
    <motion.div whileTap={{ scale: 0.98 }} className="w-full">
      <Button
        variant="outline"
        color={brandColor}
        fullWidth
        className={`!bg-[${brandColor}] !text-foreground !border-[${brandColor}]  rounded-md ${className}`}
        onClick={onClick}
        Icon={<Icon size={20} />}
        iconPosition="left"
      >
        <span className="text-sm font-medium">{label}</span>
      </Button>
    </motion.div>
  );
}

export function SocialButtons({
  className = "",
  providers = ["google", "slack"], // Default providers
  direction = "horizontal", // 'vertical' or 'horizontal'
}: {
  className?: string;
  providers?: SocialProvider[];
  direction?: "vertical" | "horizontal";
}) {
  const onProviderSelect = (provider: SocialProvider) => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${provider}`,
      "_blank"
    );
  };
  const handleClick = (provider: SocialProvider) => {
    onProviderSelect(provider);
  };

  return (
    <div
      className={`flex ${
        direction === "vertical"
          ? "flex-col items-center justify-center"
          : "flex-col items-center justify-center"
      } gap-3 ${className}`}
    >
      {providers.map((provider) => (
        <SocialButton
          key={provider}
          provider={provider}
          onClick={() => handleClick(provider)}
        />
      ))}
    </div>
  );
}
