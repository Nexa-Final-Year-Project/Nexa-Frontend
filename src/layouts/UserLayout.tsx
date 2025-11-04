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
  BellIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import ProfileDropdown from "../components/user/profile/ProfileDropdown";
import { useAuthStore } from "../store/auth/authStore";
import { useModalStore } from "../store/modal/modalStore";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { openModal } = useModalStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-3 md:px-4 justify-between w-full">
            {/* Left section - Menu trigger */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1">
                <MenuIcon className="w-4 h-4" />
              </SidebarTrigger>
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
              />
            </div>

            {/* Center section - Search and Create button */}
            <div className="flex lg:items-center items-baseline gap-2 px-2 md:px-8 flex-1 justify-center max-w-2xl">
              {/* Search input - hidden on mobile, shown on md and up */}
              <div className="hidden lg:block flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search"
                  onClick={() => openModal("search.global")}
                  className="w-full"
                />
              </div>

              {/* Search icon button - shown on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden cursor-pointer"
                onClick={() => openModal("search.global")}
              >
                <SearchIcon className="w-4 h-4" />
              </Button>

              {/* Create button - text hidden on mobile */}
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => openModal("project.create")}
                size="sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden md:inline dark:text-white ml-2">
                  Create
                </span>
              </Button>
            </div>

            {/* Right section - Notifications and profile */}
            <div className="flex items-center gap-2 md:gap-4 pr-2 md:pr-12">
              {/* Notification bell - hidden on smallest screens */}
              <Button variant="ghost" size="icon" className="hidden xs:flex">
                <BellIcon className="w-4 h-4" />
              </Button>

              <ProfileDropdown user={user} />
            </div>
          </div>
        </header>

        {/* Main content area with responsive padding */}
        <div className="flex flex-1 flex-col gap-4 py-4 px-3 sm:px-6 md:px-8 lg:px-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
