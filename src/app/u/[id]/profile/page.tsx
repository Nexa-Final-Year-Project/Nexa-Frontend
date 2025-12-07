"use client";
import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Card } from "@/components/ui/card/Card";
import { ImageUploader } from "@/components/ui/image/ImageUploader";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuthStore } from "@/store/auth/authStore";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import {
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Edit3,
  ArrowUpRight,
  Activity,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { projects, fetchAllProjects } = useProjects();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#0a0a0f]" : "bg-neutral-50"}`}
    >
      {/* Header cover with gradient */}
      <div
        className={`h-48 relative ${
          isDark
            ? "bg-gradient-to-br from-violet-600/30 via-violet-900/20 to-cyan-600/20"
            : "bg-gradient-to-br from-violet-100 via-violet-50 to-cyan-50"
        }`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto -mt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Profile Card */}
          <div className="lg:w-1/3">
            <div
              className={`rounded-2xl border p-6 backdrop-blur-sm ${
                isDark
                  ? "bg-neutral-900/60 border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-lg"
              }`}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name || "User"}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#0a0a0f] ring-2 ring-violet-500/30"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center border-4 border-[#0a0a0f] ring-2 ring-violet-500/30">
                      <span className="text-3xl font-bold text-white">
                        {getInitials(user?.name)}
                      </span>
                    </div>
                  )}
                  {/* Edit Button */}
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <h2
                  className={`mt-4 text-xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {user?.name || "User"}
                </h2>
                <p
                  className={`text-sm ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  @{user?.name?.toLowerCase().replace(/\s/g, "") || "user"}
                </p>

                <Link
                  href={`/u/${user?.uid}/settings`}
                  className={`mt-4 px-4 py-2 rounded-xl border text-sm transition-all flex items-center gap-2 ${
                    isDark
                      ? "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06] hover:text-white"
                      : "bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  Manage Account
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Divider */}
              <div
                className={`my-6 border-t ${
                  isDark ? "border-white/[0.06]" : "border-neutral-200"
                }`}
              />

              {/* About Section */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-4 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  About
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase
                      className={`w-4 h-4 ${
                        isDark ? "text-white/30" : "text-neutral-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-white/60" : "text-neutral-600"}
                    >
                      Product Manager
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2
                      className={`w-4 h-4 ${
                        isDark ? "text-white/30" : "text-neutral-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-white/60" : "text-neutral-600"}
                    >
                      Your Organization
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin
                      className={`w-4 h-4 ${
                        isDark ? "text-white/30" : "text-neutral-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-white/60" : "text-neutral-600"}
                    >
                      San Francisco, CA
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar
                      className={`w-4 h-4 ${
                        isDark ? "text-white/30" : "text-neutral-400"
                      }`}
                    />
                    <span
                      className={isDark ? "text-white/60" : "text-neutral-600"}
                    >
                      Joined December 2024
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className={`my-6 border-t ${
                  isDark ? "border-white/[0.06]" : "border-neutral-200"
                }`}
              />

              {/* Contact */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-4 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Contact
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <Mail
                    className={`w-4 h-4 ${
                      isDark ? "text-white/30" : "text-neutral-400"
                    }`}
                  />
                  <span
                    className={isDark ? "text-white/60" : "text-neutral-600"}
                  >
                    {user?.email || "email@example.com"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Activity & Projects */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {/* Recent Activity Card */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-neutral-900/60 border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Activity className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Recent Activity
                  </h3>
                </div>
                <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ActivityLogs />
            </div>

            {/* Projects Card */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-neutral-900/60 border-white/[0.06]"
                  : "bg-white border-neutral-200 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FolderKanban className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Projects
                  </h3>
                </div>
                <Link
                  href={`/u/${user?.uid}/p`}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <DashboardProjectList projects={projects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
