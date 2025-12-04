"use client";

import React from "react";
import { Trash2, AlertTriangle, RotateCcw } from "lucide-react";

interface DangerZoneSettingsProps {
  onDeleteAccount?: () => void;
  onResetData?: () => void;
}

export const DangerZoneSettings: React.FC<DangerZoneSettingsProps> = ({
  onDeleteAccount,
  onResetData,
}) => {
  return (
    <div className="p-8 space-y-10">
      {/* Danger Zone Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Danger Zone
          </h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Actions in this section are irreversible. Please proceed with extreme caution.
        </p>

        <div className="space-y-4">
          {/* Reset Data */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/20 transition-colors p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Reset All Data</h3>
                  <p className="text-sm text-white/40">
                    Reset all your app data to default settings. This will not delete your account but will clear all preferences and history.
                  </p>
                </div>
              </div>
              <button
                onClick={onResetData}
                className="
                  flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  bg-amber-500/10 border border-amber-500/20
                  text-sm font-medium text-amber-400
                  hover:bg-amber-500/20 hover:border-amber-500/30
                  transition-all duration-200 cursor-pointer
                  flex-shrink-0
                "
              >
                <RotateCcw className="w-4 h-4" />
                Reset Data
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-xl bg-rose-500/[0.03] border border-rose-500/10 hover:border-rose-500/20 transition-colors p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Delete Account</h3>
                  <p className="text-sm text-white/40">
                    Permanently delete your account and all associated data. This action cannot be undone and all your projects will be lost.
                  </p>
                </div>
              </div>
              <button
                onClick={onDeleteAccount}
                className="
                  flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  bg-rose-500/10 border border-rose-500/20
                  text-sm font-medium text-rose-400
                  hover:bg-rose-500/20 hover:border-rose-500/30
                  shadow-[0_0_20px_rgba(244,63,94,0.15)]
                  hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]
                  transition-all duration-200 cursor-pointer
                  flex-shrink-0
                "
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZoneSettings;
