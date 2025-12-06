// src/components/user/profile/ProfileDropdown.tsx
"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import {
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { User } from "@/types/auth";

export default function ProfileDropdown({ user }: { user: User | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { logout } = useAuthStore();
  const router = useRouter();

  if (!user) {
    return (
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
          isDark
            ? "bg-neutral-900/60 border border-white/[0.06] hover:bg-neutral-800/60"
            : "bg-neutral-100 border border-neutral-200 hover:bg-neutral-200"
        }`}
        onClick={() => router.push("/login")}
      >
        <UserIcon
          className={`w-5 h-5 ${isDark ? "text-white/60" : "text-neutral-600"}`}
        />
      </div>
    );
  }

  const handleLogout = async () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const userLink = `/u/${user.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar
            className={`h-10 w-10 rounded-xl border-2 transition-all duration-300 group-hover:shadow-lg ${
              isDark
                ? "border-white/[0.08] group-hover:border-white/[0.15]"
                : "border-neutral-200 group-hover:border-neutral-300"
            }`}
          >
            <AvatarImage
              src={user.photoURL}
              alt={user.name}
              className="rounded-xl"
            />
            <AvatarFallback
              className={`rounded-xl font-medium ${
                isDark
                  ? "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white/80"
                  : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700"
              }`}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ${
              isDark ? "border-2 border-neutral-950" : "border-2 border-white"
            }`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`w-72 p-0 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden ${
          isDark
            ? "bg-neutral-900/95 border border-white/[0.08]"
            : "bg-white/95 border border-neutral-200"
        }`}
      >
        {/* Header */}
        <DropdownMenuLabel className="p-0">
          <div
            className={`relative p-4 ${
              isDark
                ? "bg-gradient-to-br from-white/[0.04] to-transparent"
                : "bg-gradient-to-br from-neutral-50 to-transparent"
            }`}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 rounded-full blur-2xl" />

            <div className="relative flex items-center gap-3">
              <Avatar
                className={`h-12 w-12 rounded-xl shadow-lg ${
                  isDark
                    ? "border-2 border-white/[0.1]"
                    : "border-2 border-neutral-200"
                }`}
              >
                <AvatarImage
                  src={user.photoURL}
                  alt={user.name}
                  className="rounded-xl"
                />
                <AvatarFallback
                  className={`rounded-xl font-semibold text-lg ${
                    isDark
                      ? "bg-gradient-to-br from-neutral-700 to-neutral-800 text-white"
                      : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-800"
                  }`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  {user.email}
                </p>
                {user.role && (
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-medium text-amber-400/80 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <div
          className={`h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
          }`}
        />

        {/* Menu Items */}
        <div className="p-2 space-y-0.5">
          <DropdownMenuItem
            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              isDark
                ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
                : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
            onClick={() => router.push(`${userLink}/profile`)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isDark
                    ? "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    : "bg-neutral-100 group-hover:bg-neutral-200"
                }`}
              >
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Profile</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-colors ${
                isDark
                  ? "text-white/20 group-hover:text-white/40"
                  : "text-neutral-400 group-hover:text-neutral-600"
              }`}
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              isDark
                ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
                : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
            onClick={() => router.push(`${userLink}/settings`)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isDark
                    ? "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    : "bg-neutral-100 group-hover:bg-neutral-200"
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-colors ${
                isDark
                  ? "text-white/20 group-hover:text-white/40"
                  : "text-neutral-400 group-hover:text-neutral-600"
              }`}
            />
          </DropdownMenuItem>

          {user.role === "Admin" && (
            <DropdownMenuItem
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                isDark
                  ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
              onClick={() => router.push("/admin")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <ShieldCheckIcon className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm font-medium">Admin Dashboard</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-colors ${
                  isDark
                    ? "text-white/20 group-hover:text-white/40"
                    : "text-neutral-400 group-hover:text-neutral-600"
                }`}
              />
            </DropdownMenuItem>
          )}
        </div>

        <div
          className={`h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
          }`}
        />

        {/* Theme */}
        <div className="p-2">
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${
              isDark ? "bg-white/[0.02]" : "bg-neutral-50"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div
          className={`h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
          }`}
        />

        {/* Logout */}
        <div className="p-2">
          <DropdownMenuItem
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
            onClick={handleLogout}
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <LogOutIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
