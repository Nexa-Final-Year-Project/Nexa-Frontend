// components/ui/auth/SocialButtons.tsx
"use client";

import { Button } from "@/components/ui/button/Button";
import {
  providers,
  SocialProvider,
} from "@/lib/constants/auth/providersConstants";
import { motion } from "framer-motion";

const resolveBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (typeof window !== "undefined") {
    return url || `${window.location.origin}/api`;
  }
  return url || "";
};

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
  const { Icon, label, brandColor } = providerConfig;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }} 
      className="w-full"
    >
      <Button
        variant="outline"
        color={brandColor}
        fullWidth
        className={`relative overflow-hidden !bg-white/[0.03] !text-white !border-white/[0.08] hover:!bg-white/[0.08] hover:!border-white/[0.15] rounded-xl py-3 transition-all duration-300 group ${className}`}
        onClick={onClick}
        Icon={<Icon size={20} className="text-white/70 group-hover:text-white transition-colors" />}
        iconPosition="left"
      >
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
          Continue with {label}
        </span>
      </Button>
    </motion.div>
  );
}

export function SocialButtons({
  className = "",
  providers = ["google", "slack"],
  direction = "horizontal",
}: {
  className?: string;
  providers?: SocialProvider[];
  direction?: "vertical" | "horizontal";
}) {
  const onProviderSelect = (provider: SocialProvider) => {
    const BASE_URL = resolveBaseUrl().replace(/\/$/, "");
    const oauthUrl = `${BASE_URL}/auth/${provider}`;
    window.location.href = oauthUrl;
  };
  
  const handleClick = (provider: SocialProvider) => {
    onProviderSelect(provider);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      {providers.map((provider, index) => (
        <motion.div
          key={provider}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="w-full"
        >
          <SocialButton
            provider={provider}
            onClick={() => handleClick(provider)}
          />
        </motion.div>
      ))}
    </div>
  );
}
