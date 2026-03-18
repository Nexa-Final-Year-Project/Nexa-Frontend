"use client";

import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  Settings,
  User,
  Crown,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/authStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";

type NavUserProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    photoURL?: string | null;
    uid?: string | null;
  } | null;
};

export function NavUser(props: NavUserProps) {
  const { user } = props;
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Defensive fallbacks so component doesn't crash when user is null (e.g. after logout)
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "";
  const photo = user?.photoURL ?? undefined;
  const userId = user?.uid ?? "";

  // compute initials for fallback avatar
  const initials = (displayName || "G")
    .split(" ")
    .map((p: string) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`${
                isDark
                  ? "data-[state=open]:bg-white/[0.06] hover:bg-white/[0.04]"
                  : "data-[state=open]:bg-neutral-100 hover:bg-neutral-50"
              } transition-all duration-200 cursor-pointer group rounded-xl`}
            >
              <Avatar
                className={`h-9 w-9 rounded-xl flex-shrink-0 ring-2 ${
                  isDark
                    ? "ring-white/[0.06] group-hover:ring-white/[0.15]"
                    : "ring-neutral-200 group-hover:ring-neutral-300"
                } transition-all`}
              >
                {photo ? (
                  <AvatarImage src={photo} alt={displayName} />
                ) : (
                  <AvatarFallback
                    className={`rounded-xl ${
                      isDark
                        ? "bg-white/[0.08] text-white"
                        : "bg-neutral-200 text-neutral-700"
                    } text-sm font-medium`}
                  >
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0 ml-3">
                <span
                  className={`truncate font-medium text-sm ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {displayName}
                </span>
                <span
                  className={`truncate text-xs ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  {displayEmail}
                </span>
              </div>
              <ChevronsUpDown
                className={`ml-auto size-4 ${
                  isDark
                    ? "text-white/30 group-hover:text-white/50"
                    : "text-neutral-400 group-hover:text-neutral-600"
                } transition-colors`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-64 rounded-2xl ${
              isDark
                ? "bg-[#0c0c10]/95 border-white/[0.08]"
                : "bg-white border-neutral-200"
            } backdrop-blur-xl shadow-2xl ${
              isDark ? "shadow-black/40" : "shadow-neutral-200/50"
            } p-2`}
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal mb-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isDark ? "bg-white/[0.03]" : "bg-neutral-50"
                }`}
              >
                <Avatar
                  className={`h-12 w-12 rounded-xl flex-shrink-0 ring-2 ${
                    isDark ? "ring-white/[0.08]" : "ring-neutral-200"
                  }`}
                >
                  {photo ? (
                    <AvatarImage src={photo} alt={displayName} />
                  ) : (
                    <AvatarFallback
                      className={`rounded-xl ${
                        isDark
                          ? "bg-white/[0.08] text-white"
                          : "bg-neutral-200 text-neutral-700"
                      } font-medium`}
                    >
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className={`truncate font-semibold text-sm ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {displayName}
                  </span>
                  <span
                    className={`truncate text-xs ${
                      isDark ? "text-white/40" : "text-neutral-500"
                    }`}
                  >
                    {displayEmail}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Free Plan
                  </span>
                </div>
              </motion.div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <Link href={`/u/${userId}/billing`}>
                <DropdownMenuItem
                  className={`rounded-lg cursor-pointer py-2.5 ${
                    isDark
                      ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:bg-transparent`}
                >
                  <Crown className="w-4 h-4 mr-3 text-amber-500" />
                  <span>Upgrade to Pro</span>
                  <Sparkles className="w-3 h-3 ml-auto text-amber-500/50" />
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator
              className={`${
                isDark ? "bg-white/[0.06]" : "bg-neutral-200"
              } my-2`}
            />

            <DropdownMenuGroup>
              <Link href={`/u/${userId}/account`}>
                <DropdownMenuItem
                  className={`rounded-lg cursor-pointer py-2.5 ${
                    isDark
                      ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:bg-transparent`}
                >
                  <User
                    className={`w-4 h-4 mr-3 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <span>Account</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/notifications">
                <DropdownMenuItem
                  className={`rounded-lg cursor-pointer py-2.5 ${
                    isDark
                      ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:bg-transparent`}
                >
                  <Bell
                    className={`w-4 h-4 mr-3 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/help">
                <DropdownMenuItem
                  className={`rounded-lg cursor-pointer py-2.5 ${
                    isDark
                      ? "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  } focus:bg-transparent`}
                >
                  <Settings
                    className={`w-4 h-4 mr-3 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <span>Settings & Help</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator
              className={`${
                isDark ? "bg-white/[0.06]" : "bg-neutral-200"
              } my-2`}
            />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg cursor-pointer py-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 focus:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
