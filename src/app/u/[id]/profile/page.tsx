"use client";
import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import DashboardProjectList from "@/components/projects/DashboardProjectList";
import { Card } from "@/components/ui/card/Card";
import { ImageUploader } from "@/components/ui/image/ImageUploader";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuthStore } from "@/store/auth/authStore";
import React, { useEffect } from "react";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { projects, fetchAllProjects } = useProjects();

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header cover image placeholder */}
      <div className="h-32 bg-gray-200" />

      <div className="max-w-6xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="lg:w-1/3">
            <div className="flex flex-col items-center">
              <ImageUploader
                shape="circle"
                aspectRatio={1}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                initialImage={user?.photoURL}
                onChange={(file, url) =>
                  console.log("Avatar updated", file, url)
                }
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user?.name}
              </h2>
              <button className="mt-2 text-sm text-gray-600 hover:underline">
                Manage your account
              </button>
            </div>

            {/* About card */}
            <Card className="mt-6 p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">About</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Your job title</p>
                <p>Your department</p>
                <p>Your organisation</p>
                <p>Your location</p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              {/* <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Teams</p>
                <button className="mt-1 text-sm text-blue-600 hover:underline">
                  + Create a team
                </button>
              </div> */}
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Worked on</h3>
                <button className="text-sm text-blue-600 hover:underline">
                  View all
                </button>
              </div>
              <ActivityLogs />
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Projects</h3>
                <button className="text-sm text-blue-600 hover:underline">
                  View all
                </button>
              </div>
              <DashboardProjectList projects={projects} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
