import React from "react";
import DropdownSearchPanel from "../DropdownSearchPanel";
import { useActivityLogs } from "@/hooks/activityLogs/useActivityLogs";
import { useAuthStore } from "@/store/auth/authStore";
import ActivityLogs from "@/components/activityLogs/ActivityLogs";
import { ActionType, EntityType, ActivityLog } from "@/types/activityLogs";

const RecentActivityPanel = ({ trigger }: { trigger: React.ReactNode }) => {
  const { activityLogs, fetchAllActivityLogs } = useActivityLogs();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<ActionType | "">(
    ""
  );
  const [selectedEntity, setSelectedEntity] = React.useState<EntityType | "">(
    ""
  );
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    // Backend expects the query param name `user` (not `userId`), so send that.
    if (user?.id) {
      fetchAllActivityLogs({ user: user.id });
    }
  }, [user?.id, fetchAllActivityLogs]);

  // filtering logic
  const filteredLogs = React.useMemo(() => {
    return activityLogs.filter((log: ActivityLog) => {
      const matchesSearch =
        !searchTerm ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = !selectedAction || log.action === selectedAction;
      const matchesEntity =
        !selectedEntity || log.entityType === selectedEntity;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [activityLogs, searchTerm, selectedAction, selectedEntity]);

  // Show only 3 logs initially, or all if showAll is true
  const displayedLogs = showAll ? filteredLogs : filteredLogs.slice(0, 3);

  return (
    <DropdownSearchPanel
      trigger={trigger}
      content={
        <div className="p-2">
          {/* Search Input */}
          <div className="p-2 border-b flex flex-col gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activity…"
              className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedAction}
                onChange={(e) =>
                  setSelectedAction(e.target.value as ActionType | "")
                }
                className="w-1/2 px-2 py-1 text-sm border rounded-md"
              >
                <option value="">All Actions</option>
                {Object.values(ActionType).map((action) => (
                  <option key={String(action)} value={String(action)}>
                    {String(action)}
                  </option>
                ))}
              </select>
              <select
                value={selectedEntity}
                onChange={(e) =>
                  setSelectedEntity(e.target.value as EntityType | "")
                }
                className="w-1/2 px-2 py-1 text-sm border rounded-md"
              >
                <option value="">All Entities</option>
                {Object.values(EntityType).map((entity) => (
                  <option key={String(entity)} value={String(entity)}>
                    {String(entity)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logs */}
          <div className="p-2 max-h-64 overflow-y-auto">
            <ActivityLogs logs={displayedLogs} />

            {/* Show more/less button */}
            {filteredLogs.length > 3 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-blue-600 hover:text-blue-800 w-full text-center"
                >
                  {showAll ? "Show less" : `Show all (${filteredLogs.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      }
      contentClassName="p-0"
      position={{ side: "right", align: "center" }}
    />
  );
};

export default RecentActivityPanel;
