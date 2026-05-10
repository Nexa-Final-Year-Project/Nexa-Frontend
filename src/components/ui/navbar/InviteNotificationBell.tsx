"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetPendingInvitesQuery } from "@/api/project/projectApi";
import { useProjects } from "@/hooks/projects/useProjects";
import toast from "@/lib/customToast";
import { motion, AnimatePresence } from "framer-motion";

export const InviteNotificationBell = () => {
  // Fetch once on mount; refetch when the bell opens (see useEffect below).
  // Background polling at 5-minute intervals is enough for invite notifications.
  const { data, isLoading, refetch } = useGetPendingInvitesQuery(undefined, {
    pollingInterval: 300000, // 5 minutes
  });
  const { acceptProjectInvite } = useProjects();
  const [open, setOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  const pendingInvites = data?.invites || [];
  const unreadCount = pendingInvites.length;

  // Also refetch when notification bell opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleAcceptInvite = async (token: string, projectName: string) => {
    setIsAccepting(token);
    try {
      await acceptProjectInvite(token);
      toast.success(`Joined project: ${projectName}`);
      refetch();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to accept invite");
    } finally {
      setIsAccepting(null);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Project Invites</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {unreadCount} pending
              </span>
            )}
          </div>

          {unreadCount === 0 ? (
            <div className="text-center py-6">
              <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No pending invites</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {pendingInvites.map((invite) => (
                  <motion.div
                    key={invite._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-sm">
                          {invite.projectId?.name || "Project"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Invited by{" "}
                          {invite.invitedBy?.name || invite.invitedBy?.email}
                        </p>
                      </div>

                      {invite.role && (
                        <p className="text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {invite.role}
                          </span>
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1 h-8"
                          onClick={() =>
                            handleAcceptInvite(
                              invite.token,
                              invite.projectId?.name || "Project",
                            )
                          }
                          disabled={isAccepting === invite.token}
                        >
                          {isAccepting === invite.token ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Joining...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          disabled={isAccepting === invite.token}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
