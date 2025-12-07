"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Smartphone,
  ExternalLink,
  Check,
} from "lucide-react";

interface UserSecuritySettingsProps {
  security: { twoFactor: boolean; loginAlerts: boolean };
  onToggle: (field: string, value: boolean) => void;
}

export const UserSecuritySettings = ({
  security,
  onToggle,
}: UserSecuritySettingsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <KeyRound
              className={`w-5 h-5 ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            />
            Authentication Methods
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Manage how you sign in to your account
        </p>

        <div className="space-y-3">
          {authMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                  : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${
                    method.status === "enabled"
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                      : isDark
                      ? "bg-white/[0.06] text-white/40"
                      : "bg-neutral-200 text-neutral-500"
                  }
                `}
                >
                  {method.icon}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {method.label}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/40" : "text-neutral-600"
                    }`}
                  >
                    {method.description}
                  </p>
                </div>
              </div>

              {method.status === "enabled" && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-emerald-100 border-emerald-300"
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    Enabled
                  </span>
                </div>
              )}

              {method.status === "not-connected" && (
                <span
                  className={`text-xs font-medium ${
                    isDark ? "text-white/30" : "text-neutral-500"
                  }`}
                >
                  Not Connected
                </span>
              )}

              {method.status === "action" && (
                <button
                  className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl border
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    isDark
                      ? "bg-white/[0.06] border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white"
                      : "bg-neutral-100 border-neutral-300 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700"
                  }
                `}
                >
                  Connect
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className={`h-px bg-gradient-to-r from-transparent via-${
          isDark ? "white/[0.08]" : "neutral-300"
        } to-transparent`}
      />

      {/* Security Options Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <ShieldCheck
              className={`w-5 h-5 ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            />
            Security Options
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-600"
          }`}
        >
          Configure additional security settings
        </p>

        <div className="space-y-3">
          {securityOptions.map((option) => {
            const value = security[option.key as keyof typeof security];
            return (
              <div
                key={option.key}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                    : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${
                      value
                        ? isDark
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-100 text-emerald-600"
                        : isDark
                        ? "bg-white/[0.06] text-white/40"
                        : "bg-neutral-200 text-neutral-500"
                    }
                  `}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle(option.key, v)}
                  className={`data-[state=checked]:${
                    isDark ? "bg-emerald-500" : "bg-emerald-600"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
