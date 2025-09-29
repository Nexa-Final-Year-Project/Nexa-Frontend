"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, KeyRound, Mail, Lock, Smartphone } from "lucide-react";

interface UserSecuritySettingsProps {
  security: { twoFactor: boolean; loginAlerts: boolean };
  onToggle: (field: string, value: boolean) => void;
}

export const UserSecuritySettings = ({
  security,
  onToggle,
}: UserSecuritySettingsProps) => {
  return (
    <Card className="!border-0 !shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 " />
          Security & Login
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Manage how you sign in and secure your account.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Authentication Methods */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <KeyRound className="w-5 h-5 " />
            Authentication Methods
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email Magic Link</p>
                  <p className="text-sm text-gray-500">
                    Sign in securely via your email.
                  </p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">SMS Login</p>
                  <p className="text-sm text-gray-500">
                    Use one-time passcodes sent to your phone.
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm font-medium">
                Not Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Social Login</p>
                  <p className="text-sm text-gray-500">
                    Connect Google, GitHub, or others.
                  </p>
                </div>
              </div>
              <button className=" text-sm font-medium hover:underline">
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Security Toggles */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 " />
            Security Options
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Enable Two-Factor Authentication</span>
              <Switch
                checked={security.twoFactor}
                onCheckedChange={(v) => onToggle("twoFactor", v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Login Alerts</span>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(v) => onToggle("loginAlerts", v)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
