"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone } from "lucide-react";

interface UserNotificationsSettingsProps {
  notifications: {
    email: { marketing: boolean; product: boolean; security: boolean };
    push: { product: boolean; security: boolean };
  };
}

export const UserNotificationSettings = ({
  notifications,
}: UserNotificationsSettingsProps) => {
  const onToggle = (method: "email" | "push", type: string, value: boolean) => {
    if (method === "email") {
      notifications.email[type as keyof typeof notifications.email] = value;
    }
    if (method === "push") {
      notifications.push[type as keyof typeof notifications.push] = value;
    }
  };
  return (
    <Card className="!border-0 !shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Customize how and when you receive notifications.
        </p>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-500" /> Email Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications.email).map(([type, value]) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition shadow-sm"
              >
                <div>
                  <span className="capitalize font-medium text-gray-900">
                    {type} emails
                  </span>
                  <p className="text-xs text-gray-500">
                    {type === "marketing"
                      ? "Promotions, newsletters, and updates."
                      : type === "product"
                      ? "Product updates and new features."
                      : "Important security alerts."}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("email", type, v)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-green-500" /> Push Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications.push).map(([type, value]) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition shadow-sm"
              >
                <div>
                  <span className="capitalize font-medium text-gray-900">
                    {type} alerts
                  </span>
                  <p className="text-xs text-gray-500">
                    {type === "product"
                      ? "Updates about new features and product improvements."
                      : "Critical security notifications for your account."}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => onToggle("push", type, v)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
