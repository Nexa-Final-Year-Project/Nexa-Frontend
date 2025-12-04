"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Palette,
  Shield,
  ArrowLeft,
  Camera,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDark ? "bg-neutral-950" : "bg-neutral-50"
    )}>
      {/* Background */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href={`/u/${params.userId}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm transition-colors mb-8",
            isDark 
              ? "text-white/50 hover:text-white"
              : "text-neutral-500 hover:text-neutral-900"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={cn(
            "text-3xl font-bold mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>Account Settings</h1>
          <p className={isDark ? "text-white/50" : "text-neutral-600"}>Manage your account preferences and settings</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-64 flex-shrink-0"
          >
            <div className={cn(
              "p-2 rounded-2xl border",
              isDark 
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-white border-neutral-200 shadow-sm"
            )}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? isDark 
                        ? "bg-white/[0.06] text-white"
                        : "bg-neutral-100 text-neutral-900"
                      : isDark 
                        ? "text-white/50 hover:text-white hover:bg-white/[0.03]"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className={cn(
                  "p-6 rounded-2xl border",
                  isDark 
                    ? "bg-white/[0.02] border-white/[0.06]"
                    : "bg-white border-neutral-200 shadow-sm"
                )}>
                  <h2 className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>Profile Photo</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className={cn(
                        "w-20 h-20 ring-2",
                        isDark ? "ring-white/[0.06]" : "ring-neutral-200"
                      )}>
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback className={cn(
                          "text-2xl",
                          isDark 
                            ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 text-white"
                            : "bg-gradient-to-br from-emerald-50 to-cyan-50 text-emerald-700"
                        )}>
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-400 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm mb-2",
                        isDark ? "text-white/70" : "text-neutral-600"
                      )}>
                        Upload a new photo. Max file size: 5MB
                      </p>
                      <Button variant="outline" size="sm" className={cn(
                        isDark 
                          ? "border-white/10 text-white/70"
                          : "border-neutral-200 text-neutral-600"
                      )}>
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className={cn(
                  "p-6 rounded-2xl border",
                  isDark 
                    ? "bg-white/[0.02] border-white/[0.06]"
                    : "bg-white border-neutral-200 shadow-sm"
                )}>
                  <h2 className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={cn(
                        "block text-sm mb-2",
                        isDark ? "text-white/50" : "text-neutral-600"
                      )}>Display Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || ""}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none",
                          isDark 
                            ? "bg-white/[0.03] border-white/[0.06] text-white placeholder-white/30 focus:border-white/10"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-300"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm mb-2",
                        isDark ? "text-white/50" : "text-neutral-600"
                      )}>Email Address</label>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          defaultValue={user?.email || ""}
                          disabled
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl border cursor-not-allowed",
                            isDark 
                              ? "bg-white/[0.02] border-white/[0.04] text-white/50"
                              : "bg-neutral-100 border-neutral-200 text-neutral-500"
                          )}
                        />
                        <Button variant="outline" className={cn(
                          isDark 
                            ? "border-white/10 text-white/70"
                            : "border-neutral-200 text-neutral-600"
                        )}>
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button className={cn(
                      isDark 
                        ? "bg-white text-neutral-900 hover:bg-white/90"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    )}>
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className={cn(
                "p-6 rounded-2xl border",
                isDark 
                  ? "bg-white/[0.02] border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-sm"
              )}>
                <h2 className={cn(
                  "text-lg font-semibold mb-6",
                  isDark ? "text-white" : "text-neutral-900"
                )}>Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { title: "Task Assignments", desc: "When a task is assigned to you" },
                    { title: "Task Comments", desc: "When someone comments on your tasks" },
                    { title: "Sprint Updates", desc: "Sprint start, end, and updates" },
                    { title: "Project Invites", desc: "When you're invited to a project" },
                    { title: "Weekly Digest", desc: "Weekly summary of your activity" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-colors",
                        isDark ? "hover:bg-white/[0.02]" : "hover:bg-neutral-50"
                      )}
                    >
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>{item.title}</p>
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-white/40" : "text-neutral-500"
                        )}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className={cn(
                          "w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white",
                          isDark 
                            ? "bg-white/[0.06] after:bg-white/50"
                            : "bg-neutral-200 after:bg-white"
                        )}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className={cn(
                  "p-6 rounded-2xl border",
                  isDark 
                    ? "bg-white/[0.02] border-white/[0.06]"
                    : "bg-white border-neutral-200 shadow-sm"
                )}>
                  <h2 className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={cn(
                        "block text-sm mb-2",
                        isDark ? "text-white/50" : "text-neutral-600"
                      )}>Current Password</label>
                      <input
                        type="password"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none",
                          isDark 
                            ? "bg-white/[0.03] border-white/[0.06] text-white placeholder-white/30 focus:border-white/10"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-300"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm mb-2",
                        isDark ? "text-white/50" : "text-neutral-600"
                      )}>New Password</label>
                      <input
                        type="password"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none",
                          isDark 
                            ? "bg-white/[0.03] border-white/[0.06] text-white placeholder-white/30 focus:border-white/10"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-300"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm mb-2",
                        isDark ? "text-white/50" : "text-neutral-600"
                      )}>Confirm New Password</label>
                      <input
                        type="password"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none",
                          isDark 
                            ? "bg-white/[0.03] border-white/[0.06] text-white placeholder-white/30 focus:border-white/10"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-300"
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button className={cn(
                      isDark 
                        ? "bg-white text-neutral-900 hover:bg-white/90"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    )}>
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className={cn(
                  "p-6 rounded-2xl border",
                  isDark 
                    ? "bg-rose-500/5 border-rose-500/20"
                    : "bg-rose-50 border-rose-200"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      isDark ? "bg-rose-500/10" : "bg-rose-100"
                    )}>
                      <AlertTriangle className={cn(
                        "w-5 h-5",
                        isDark ? "text-rose-400" : "text-rose-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h2 className={cn(
                        "text-lg font-semibold mb-1",
                        isDark ? "text-rose-300" : "text-rose-700"
                      )}>Danger Zone</h2>
                      <p className={cn(
                        "text-sm mb-4",
                        isDark ? "text-rose-200/60" : "text-rose-600/70"
                      )}>
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="outline" className={cn(
                        isDark 
                          ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                          : "border-rose-300 text-rose-600 hover:bg-rose-100"
                      )}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className={cn(
                "p-6 rounded-2xl border",
                isDark 
                  ? "bg-white/[0.02] border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-sm"
              )}>
                <h2 className={cn(
                  "text-lg font-semibold mb-6",
                  isDark ? "text-white" : "text-neutral-900"
                )}>Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className={cn(
                      "block text-sm mb-3",
                      isDark ? "text-white/50" : "text-neutral-600"
                    )}>Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                        { value: "system", label: "System" }
                      ].map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => setTheme(themeOption.value)}
                          className={cn(
                            "p-4 rounded-xl border transition-all",
                            theme === themeOption.value
                              ? isDark 
                                ? "bg-white/[0.06] border-emerald-500/30"
                                : "bg-emerald-50 border-emerald-300"
                              : isDark 
                                ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                                : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          <div className="text-center">
                            <div className={cn(
                              "w-8 h-8 rounded-lg mx-auto mb-2 border",
                              themeOption.value === "light" 
                                ? "bg-white border-neutral-200" 
                                : themeOption.value === "dark" 
                                ? "bg-neutral-900 border-neutral-700" 
                                : "bg-gradient-to-br from-white to-neutral-900 border-neutral-400"
                            )} />
                            <span className={cn(
                              "text-sm",
                              isDark ? "text-white/70" : "text-neutral-600"
                            )}>{themeOption.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={cn(
                      "block text-sm mb-3",
                      isDark ? "text-white/50" : "text-neutral-600"
                    )}>Language</label>
                    <select className={cn(
                      "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none",
                      isDark 
                        ? "bg-white/[0.03] border-white/[0.06] text-white focus:border-white/10"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-300"
                    )}>
                      <option value="en" className={isDark ? "bg-neutral-900" : "bg-white"}>English</option>
                      <option value="es" className={isDark ? "bg-neutral-900" : "bg-white"}>Spanish</option>
                      <option value="fr" className={isDark ? "bg-neutral-900" : "bg-white"}>French</option>
                      <option value="de" className={isDark ? "bg-neutral-900" : "bg-white"}>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
