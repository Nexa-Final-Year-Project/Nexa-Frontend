"use client";
// Corrected relative imports from '../../...' to '../...'
import { AppSidebar } from "../components/shared/sidebar/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import {
  MenuIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  Command,
  Sparkles,
} from "lucide-react";
import ProfileDropdown from "../components/user/profile/ProfileDropdown";
import { useAuthStore } from "../store/auth/authStore";
import { useModalStore } from "../store/modal/modalStore";
import { useTheme } from "next-themes";
import { useInitializeNotifications } from "@/hooks/notifications/useInitializeNotifications";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { openModal } = useModalStore();
  const { theme } = useTheme();
  useInitializeNotifications();

  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={isDark ? "bg-[#0c0c10]" : "bg-[#fafafa]"}>
        {/* Clean Minimal Header */}
        <header
          className={`
          relative flex h-16 shrink-0 items-center gap-2 
          transition-[width,height] ease-linear 
          group-has-data-[collapsible=icon]/sidebar-wrapper:h-14
          border-b
          ${
            isDark
              ? "border-white/[0.06] bg-[#0c0c10]/95"
              : "border-neutral-200/80 bg-white/80"
          }
          backdrop-blur-xl
        `}
        >
          {/* Subtle gradient line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-neutral-300/50 to-transparent"
            }`}
          />

          <div className="flex items-center gap-2 px-3 md:px-6 justify-between w-full">
            {/* Left section - Menu trigger */}
            <div className="flex items-center gap-3">
              <SidebarTrigger
                className={`
                -ml-1 p-2 rounded-xl
                ${
                  isDark
                    ? "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]"
                    : "bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/70 hover:border-neutral-300"
                }
                transition-all duration-300 cursor-pointer
                group/trigger
              `}
              >
                <MenuIcon
                  className={`w-4 h-4 ${
                    isDark
                      ? "text-white/60 group-hover/trigger:text-white/90"
                      : "text-neutral-500 group-hover/trigger:text-neutral-700"
                  } transition-colors`}
                />
              </SidebarTrigger>
              <Separator
                orientation="vertical"
                className={`h-6 ${
                  isDark ? "bg-white/[0.06]" : "bg-neutral-200"
                } hidden sm:block`}
              />
            </div>

            {/* Center section - Clean Search Bar */}
            <div className="flex items-center gap-3 px-2 md:px-8 flex-1 justify-center max-w-2xl">
              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-lg relative group/search">
                <div
                  onClick={() => openModal("search.global")}
                  className={`
                    relative w-full flex items-center gap-3 px-4 py-2.5
                    ${
                      isDark
                        ? "bg-white/[0.03] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/[0.12]"
                        : "bg-neutral-100 hover:bg-neutral-200/70 border-neutral-200 hover:border-neutral-300"
                    }
                    border rounded-2xl cursor-pointer
                    transition-all duration-300
                  `}
                >
                  <SearchIcon
                    className={`w-4 h-4 ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-white/40" : "text-neutral-400"
                    } flex-1`}
                  >
                    Search anything...
                  </span>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                      isDark
                        ? "bg-white/[0.04] border border-white/[0.06]"
                        : "bg-white border border-neutral-200"
                    }`}
                  >
                    <Command
                      className={`w-3 h-3 ${
                        isDark ? "text-white/40" : "text-neutral-400"
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        isDark ? "text-white/40" : "text-neutral-400"
                      } font-medium`}
                    >
                      K
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className={`
                  lg:hidden p-2.5 rounded-xl
                  ${
                    isDark
                      ? "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]"
                      : "bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/70"
                  }
                  transition-all duration-300 cursor-pointer
                `}
                onClick={() => openModal("search.global")}
              >
                <SearchIcon
                  className={`w-4 h-4 ${
                    isDark ? "text-white/60" : "text-neutral-500"
                  }`}
                />
              </Button>

              {/* Create Button - Clean Style */}
              <Button
                variant="outline"
                className={`
                  relative overflow-hidden px-4 py-2 rounded-xl
                  ${
                    isDark
                      ? "bg-white text-neutral-900 border-white hover:bg-white/90"
                      : "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
                  }
                  transition-all duration-300 cursor-pointer
                  group/create
                `}
                onClick={() => openModal("project.create")}
                size="sm"
              >
                <PlusIcon
                  className={`w-4 h-4 ${
                    isDark ? "text-neutral-900" : "text-white"
                  } group-hover/create:rotate-90 transition-transform duration-300`}
                />
                <span
                  className={`hidden md:inline ${
                    isDark ? "text-neutral-900" : "text-white"
                  } ml-2 text-sm font-medium`}
                >
                  Create
                </span>
              </Button>
            </div>

            {/* Right section - Profile */}
            <div className="flex items-center gap-3 pr-2 md:pr-4">
              <ProfileDropdown user={user} />
            </div>
          </div>
        </header>

        {/* Main content area with clean background */}
        <div
          className={`
          relative flex flex-1 flex-col gap-4 py-6 px-4 sm:px-6 md:px-8 lg:px-12
          ${
            isDark
              ? "bg-gradient-to-b from-[#0c0c10] via-[#0d0d12] to-[#0c0c10]"
              : "bg-gradient-to-b from-[#fafafa] via-[#f5f5f5] to-[#fafafa]"
          }
          min-h-screen
        `}
        >
          {/* Subtle background patterns */}
          <div
            className={`absolute inset-0 ${
              isDark ? "opacity-[0.02]" : "opacity-[0.3]"
            } pointer-events-none`}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${
                isDark ? "white" : "#d4d4d4"
              } 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
