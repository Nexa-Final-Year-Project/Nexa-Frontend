"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteAccountMutation,
  useResetDataMutation,
} from "@/api/auth/authApi";
import { useAuthStore } from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import toast from "@/lib/customToast";

interface DangerZoneSettingsProps {
  onDeleteAccount?: () => void;
  onResetData?: () => void;
}

export const DangerZoneSettings: React.FC<DangerZoneSettingsProps> = ({
  onDeleteAccount,
  onResetData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteAccount] = useDeleteAccountMutation();
  const [resetData] = useResetDataMutation();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted successfully");
      logout();
      router.push("/login");
    } catch (error) {
      toast.error("Failed to delete account");
      console.error("Delete account error:", error);
    }
    setDeleteDialog(false);
    setDeleteConfirm("");
  };

  const handleResetData = async () => {
    try {
      await resetData().unwrap();
      toast.success("All data has been reset successfully");
      onResetData?.();
    } catch (error) {
      toast.error("Failed to reset data");
      console.error("Reset data error:", error);
    }
    setResetDialog(false);
  };

  return (
    <>
      <div className="p-8 space-y-10">
        {/* Danger Zone Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
            <h2
              className={`text-xl font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${isDark ? "text-rose-400" : "text-red-600"}`}
              />
              Danger Zone
            </h2>
          </div>
          <p
            className={`text-sm ml-4 mb-6 ${
              isDark ? "text-white/40" : "text-neutral-600"
            }`}
          >
            Actions in this section are irreversible. Please proceed with
            extreme caution.
          </p>

          <div className="space-y-4">
            {/* Reset Data */}
            <div
              className={`rounded-xl border transition-colors p-5 ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.06] hover:border-amber-500/20"
                  : "bg-amber-50 border-amber-200 hover:border-amber-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDark ? "bg-amber-500/10" : "bg-amber-100"
                    }`}
                  >
                    <RotateCcw
                      className={`w-5 h-5 ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-1 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      Reset All Data
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      Reset all your app data to default settings. This will not
                      delete your account but will clear all preferences and
                      history.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setResetDialog(true)}
                  className={`
                  flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  flex-shrink-0
                  ${
                    isDark
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30"
                      : "bg-amber-100 border-amber-300 text-amber-600 hover:bg-amber-200 hover:border-amber-400"
                  }
                `}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Data
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div
              className={`rounded-xl border transition-colors p-5 ${
                isDark
                  ? "bg-rose-500/[0.03] border-rose-500/10 hover:border-rose-500/20"
                  : "bg-red-50 border-red-200 hover:border-red-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDark ? "bg-rose-500/10" : "bg-red-100"
                    }`}
                  >
                    <Trash2
                      className={`w-5 h-5 ${
                        isDark ? "text-rose-400" : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-1 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      Delete Account
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white/40" : "text-neutral-600"
                      }`}
                    >
                      Permanently delete your account and all associated data.
                      This action cannot be undone and all your projects will be
                      lost.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteDialog(true)}
                  className={`
                  flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  flex-shrink-0
                  ${
                    isDark
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]"
                      : "bg-red-100 border-red-300 text-red-600 hover:bg-red-200 hover:border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.15)] hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]"
                  }
                `}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Data Confirmation Dialog */}
      <AlertDialog open={resetDialog} onOpenChange={setResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all your projects, activities, and notifications.
              Your account will remain active but completely empty. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetData}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Reset All Data
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <span className="block">
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </span>
              <span className="block font-semibold">
                Type "DELETE" to confirm:
              </span>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors ${
                  isDark
                    ? "border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus:border-rose-400/40 focus:ring-2 focus:ring-rose-400/10"
                    : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-rose-400/50 focus:ring-2 focus:ring-rose-400/10"
                }`}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteConfirm !== "DELETE"}
            >
              Delete Account
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DangerZoneSettings;
