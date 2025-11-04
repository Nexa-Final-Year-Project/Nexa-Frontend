// src/components/user/profile/ProfileDropdown.tsx
"use client";

import React from "react";
// ... (Your other imports)
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import {
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ShieldCheckIcon,
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
import { User } from "@/types/auth"; // Assuming this is correct

// ✅ 1. Allow user to be null
export default function ProfileDropdown({ user }: { user: User | null }) {
  // ✅ 2. Use the new logout action
  const { logout } = useAuthStore();
  const router = useRouter();

  // Defensive logic: If no user, show a fallback (e.g., a login link or just the UserIcon)
  if (!user) {
    // This handles the split second when user is null, but the redirect hasn't happened.
    return (
      <Avatar className="cursor-pointer" onClick={() => router.push("/login")}>
        <AvatarFallback>
          <UserIcon className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
    );
  }

  // ✅ 3. Updated handleLogout to use the store's complete cleanup
  const handleLogout = async () => {
    // 1. Call your server logout API here (if you have one for clearing HTTP-only cookies)
    // Example: await triggerLogout().unwrap();

    // 2. Clear client-side state, persistence, and local tokens (using the store function)
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // 3. Redirect
    router.push("/login");
  };

  // ✅ 4. Safely compute userLink (though not strictly necessary since we return early if user is null)
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
        {/* Header (Already safe because of the early return) */}
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          {/* ... (Header content using user.name, user.email, etc.) ... */}
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

        {/* ... (Settings, Admin Dashboard, Theme Toggle) ... */}
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
