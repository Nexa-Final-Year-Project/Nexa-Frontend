"use client";

import { Switch } from "@/components/ui/switch";
import { ShieldCheck, KeyRound, Mail, Lock, Smartphone, ExternalLink, Check } from "lucide-react";

interface UserSecuritySettingsProps {
  security: { twoFactor: boolean; loginAlerts: boolean };
  onToggle: (field: string, value: boolean) => void;
}

export const UserSecuritySettings = ({
  security,
  onToggle,
}: UserSecuritySettingsProps) => {
  const authMethods = [
    {
      id: "email",
      label: "Email Magic Link",
      description: "Sign in securely via your email",
      icon: <Mail className="w-5 h-5" />,
      status: "enabled",
    },
    {
      id: "sms",
      label: "SMS Login",
      description: "Use one-time passcodes sent to your phone",
      icon: <Smartphone className="w-5 h-5" />,
      status: "not-connected",
    },
    {
      id: "social",
      label: "Social Login",
      description: "Connect Google, GitHub, or others",
      icon: <Lock className="w-5 h-5" />,
      status: "action",
    },
  ];

  const securityOptions = [
    {
      key: "twoFactor",
      label: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
    },
    {
      key: "loginAlerts",
      label: "Login Alerts",
      description: "Get notified when someone logs into your account",
    },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Authentication Methods Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-white/60" />
            Authentication Methods
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Manage how you sign in to your account
        </p>

        <div className="space-y-3">
          {authMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${method.status === "enabled"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.06] text-white/40"
                  }
                `}>
                  {method.icon}
                </div>
                <div>
                  <p className="font-medium text-white">{method.label}</p>
                  <p className="text-xs text-white/40">{method.description}</p>
                </div>
              </div>

              {method.status === "enabled" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Enabled</span>
                </div>
              )}

              {method.status === "not-connected" && (
                <span className="text-xs font-medium text-white/30">Not Connected</span>
              )}

              {method.status === "action" && (
                <button className="
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-white/[0.06] border border-white/[0.08]
                  text-sm font-medium text-white/70
                  hover:bg-white/[0.1] hover:text-white
                  transition-all duration-200 cursor-pointer
                ">
                  Connect
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Security Options Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white/60" />
            Security Options
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Configure additional security settings
        </p>

        <div className="space-y-3">
          {securityOptions.map((option) => {
            const value = security[option.key as keyof typeof security];
            return (
              <div
                key={option.key}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${value ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.06] text-white/40"}
                  `}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="text-xs text-white/40">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle(option.key, v)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
