"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DangerZoneSettingsProps {
  onDeleteAccount?: () => void;
  onResetData?: () => void;
}

export const DangerZoneSettings: React.FC<DangerZoneSettingsProps> = ({
  onDeleteAccount,
  onResetData,
}) => {
  return (
    <Card className="!border-0 !shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" /> Danger Zone
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Actions in this section are irreversible. Please proceed with caution.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border hover:bg-gray-50 transition shadow-sm">
          <div>
            <span className="font-medium text-gray-900">Delete Account</span>
            <p className="text-xs text-gray-500">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteAccount}
            className="mt-2 sm:mt-0"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete Account
          </Button>
        </div>

        {/* Reset Data */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border hover:bg-gray-50 transition shadow-sm">
          <div>
            <span className="font-medium text-gray-900">Reset Data</span>
            <p className="text-xs text-gray-500">
              Reset all your app data to default settings. This will not delete
              your account.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onResetData}
            className="mt-2 sm:mt-0"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Reset Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneSettings;
