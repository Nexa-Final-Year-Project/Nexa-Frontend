import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import React from "react";

const OverviewTab = () => {
  return (
    <div className="flex flex-col gap-4 py-1">
      <div className="text-left">
        <h2 className="text-2xl dark:text-white font-bold">Worked on</h2>
        <p className="text-xs text-gray-500 mb-4">
          Recent changes across your projects
        </p>
      </div>
      <ActivityLogs />
    </div>
  );
};

export default OverviewTab;
