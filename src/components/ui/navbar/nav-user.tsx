"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  ExternalLink,
  Trash2,
  Check,
  X,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  useMarkAsRead,
  useDeleteNotification,
  useMarkAllAsRead,
} from "@/store/notifications/notificationStore";

type NavUserProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
};

export function NavUser(props: NavUserProps) {
  const { user } = props;
  const { isMobile } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Notification hooks
  const notifications = useNotifications();
  // derive unread count directly from notifications so UI always stays in sync
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();
  const markAllAsRead = useMarkAllAsRead();
  const router = useRouter();

  // Filter unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  // Defensive fallbacks so component doesn't crash when user is null (e.g. after logout)
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "";
  const photo = user?.photoURL ?? undefined;

  // compute initials for fallback avatar
  const initials = (displayName || "G")
    .split(" ")
    .map((p: string) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-sidebar-accent/50 transition-colors"
            >
              <Avatar className="h-9 w-9 rounded-full flex-shrink-0">
                {photo ? (
                  <AvatarImage src={photo} alt={displayName} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0 ml-3">
                <span className="truncate font-medium text-sm">
                  {displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-full flex-shrink-0">
                  {photo ? (
                    <AvatarImage src={photo} alt={displayName} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate font-medium text-sm">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              {/* Notifications Popover */}
              <Popover
                open={notificationsOpen}
                onOpenChange={(next) => {
                  // Only allow opening via the trigger/controlled flow.
                  // Ignore close requests from outside clicks — popover will
                  // only close when we explicitly call setNotificationsOpen(false).
                  if (next) setNotificationsOpen(true);
                }}
              >
                <PopoverTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      // Always open the popover when this menu item is selected.
                      setNotificationsOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Bell className="h-4 w-4" />
                      <span className="flex-1">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-0 mr-4 rounded-2xl backdrop-blur-md bg-white/5 dark:bg-slate-900/50 border border-white/6 overflow-hidden transform -translate-y-3"
                  align="start"
                  side="right"
                  sideOffset={8}
                >
                  <div className="flex flex-col max-h-[60vh] overflow-y-auto hide-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <div className="flex gap-2 items-center">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => markAllAsRead()}
                            title="Mark all as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            router.push("/notifications");
                            setNotificationsOpen(false);
                          }}
                          title="View all notifications"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        {/* Close (X) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotificationsOpen(false);
                          }}
                          title="Close"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto hide-scrollbar">
                      {unreadNotifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No unread notifications
                        </div>
                      ) : (
                        <div className="divide-y">
                          {unreadNotifications
                            .slice(0, 5)
                            .map((notification) => (
                              <div
                                key={notification._id}
                                className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500"
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                              >
                                <div className="flex gap-3">
                                  {/* Avatar */}
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage
                                      src={notification.avatarUrl}
                                      alt={notification.senderName}
                                    />
                                    <AvatarFallback>
                                      {getInitials(notification.senderName)}
                                    </AvatarFallback>
                                  </Avatar>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <p className="font-medium text-sm">
                                        {notification.title}
                                      </p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 flex-shrink-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification._id);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {unreadNotifications.length > 5 && (
                      <div className="px-4 py-2 border-t bg-muted/30 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            router.push("/notifications");
                            setNotificationsOpen(false);
                          }}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
