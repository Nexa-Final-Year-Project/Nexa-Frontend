"use client";

import React from "react";
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
import {
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { User } from "@/types/auth";
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter } from "next/navigation";

export default function ProfileDropdown({ user }: { user: User }) {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const userLink = `/u/${user.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL} alt={user.name} />
          <AvatarFallback>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* Header */}
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Options */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`${userLink}/profile`)}
        >
          <UserIcon className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`${userLink}/settings`)}
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>

        {user.role === "Admin" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/admin")}
          >
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuItem className="flex justify-between items-center">
          <span>Theme</span>
          <ThemeToggle />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onClick={handleLogout}
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
