"use client";

import React, { useState } from "react";
import { EditableTable } from "@/components/ui/table/EditableTable";
import { Project } from "@/types/project";
import { useGetProjectsQuery } from "@/api/project/projectApi";
import { TeamMemberAvatar } from "@/components/teams/TeamMemberAvatar";
import {
  EllipsisVerticalIcon,
  LucideStar,
  Edit2,
  Trash2,
  Eye,
  ArchiveRestore,
  FolderKanban,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/shared/customlink/CustomLink";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

const items = (projectId: string) => {
  return [
    {
      label: (
        <span className="flex items-center gap-2">
          <Edit2 className="w-4 h-4" />
          Edit
        </span>
      ),
      onClick: () => {
        console.log("Edit action clicked");
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </span>
      ),
      onClick: () => {
        console.log("Delete action clicked");
      },
    },
    {
      label: (
        <CustomLink className="flex items-center gap-2" to={`/${projectId}`}>
          <Eye className="w-4 h-4" />
          View Details
        </CustomLink>
      ),
      onClick: () => {
        console.log("View Details action clicked");
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <LucideStar className="w-4 h-4" />
          Star Project
        </span>
      ),
      onClick: () => {
        console.log("Star Project action clicked");
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <ArchiveRestore className="w-4 h-4" />
          Archive Project
        </span>
      ),
      onClick: () => {
        console.log("Archive Project action clicked");
      },
    },
  ];
};

const columns = [
  {
    header: "Name",
    editable: false,
    width: "15%",
    render: (row: Project) => (
      <div className="flex items-center gap-2">
        <LucideStar
          className="w-4 h-4 "
          color="gold"
          fill={row.starred ? "gold" : "transparent"}
        />
        <span className="font-medium">{row.name}</span>
      </div>
    ),
  },
  {
    header: "Description",
    accessor: "description",
    editable: true,
    width: "30%",
  },
  {
    header: "Members",
    accessor: "member", // Not used directly; we’ll use render instead
    editable: false,
    width: "20%",
    render: (row: Project) =>
      row.members && row.members.length > 0 ? (
        <div className="flex items-center space-x-2">
          {row.members.slice(0, 4).map((member) => (
            <TeamMemberAvatar
              key={member._id}
              name={member.name}
              role={member.role}
              avatarUrl={member.avatar || "https://via.placeholder.com/150"}
            />
          ))}
        </div>
      ) : (
        <span>No members</span>
      ),
  },
  //createdAt
  {
    header: "Created At",
    accessor: "createdAt",
    editable: false,
    width: "15%",
    render: (row: Project) => (
      <span>{new Date(row.createdAt).toLocaleDateString()}</span>
    ),
  },
  //createdAt
  {
    header: "Updated At",
    accessor: "updatedAt",
    editable: false,
    width: "15%",
    render: (row: Project) => (
      <span>{new Date(row.updatedAt).toLocaleDateString()}</span>
    ),
  },
  {
    header: "Actions",
    accessor: "actions",
    editable: false,
    width: "15%",
    render: (row: Project) => (
      <div className="flex items-center gap-2">
        <ReusableDropdownMenu
          trigger={
            <Button variant="ghost" className="p-1">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          }
          items={items(row._id)}
        />
      </div>
    ),
  },
];

export default function ProjectsPage() {
  const { data: projects, isLoading } = useGetProjectsQuery({
    sort: "createdAt",
    order: "desc",
  });
  const [projectData, setProjectData] = useState(projects || []);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const params = useParams();

  const handleTableChange = (updatedProjects: Project[]) => {
    setProjectData(updatedProjects);
    // Optional: call API to save changes here
  };

  React.useEffect(() => {
    if (projects) {
      setProjectData(projects);
    }
  }, [projects?.length]);

  return (
    <div className={cn(
      "relative p-6",
      isDark ? "bg-transparent" : "bg-neutral-50"
    )}>
      {/* Background ambient effects */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Link
              href={`/u/${params.id}`}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                isDark 
                  ? "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]"
                  : "bg-white border-neutral-200 hover:bg-neutral-50 shadow-sm"
              )}
            >
              <ArrowLeft className={cn(
                "w-5 h-5",
                isDark ? "text-white/60" : "text-neutral-500"
              )} />
            </Link>
            
            <div className={cn(
              "w-12 h-12 rounded-xl border flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200"
            )}>
              <FolderKanban className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className={cn(
                "text-2xl font-bold tracking-tight",
                isDark ? "text-white" : "text-neutral-900"
              )}>Projects</h1>
              <p className={cn(
                "text-sm mt-0.5",
                isDark ? "text-white/40" : "text-neutral-500"
              )}>Manage and organize all your projects</p>
            </div>
          </div>
          
          {/* Create Project Button */}
          <Button
            className="
              flex items-center gap-2
              px-5 py-2.5 h-auto
              text-sm font-medium text-white
              bg-gradient-to-r from-emerald-600 to-cyan-600
              border border-emerald-500/30
              rounded-xl cursor-pointer
              hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]
              transition-all duration-300
              group
            "
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            New Project
          </Button>
        </div>

        {/* Decorative divider */}
        <div className="relative h-px">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent to-transparent",
            isDark ? "via-white/[0.08]" : "via-neutral-200"
          )} />
          <div className={cn(
            "absolute left-0 w-20 h-px bg-gradient-to-r to-transparent",
            isDark ? "from-emerald-500/50" : "from-emerald-400"
          )} />
        </div>
      </div>

      {/* Table Container */}
      <div className={cn(
        "rounded-2xl overflow-hidden backdrop-blur-sm border",
        isDark 
          ? "bg-neutral-900/30 border-white/[0.06]"
          : "bg-white border-neutral-200 shadow-sm"
      )}>
        <EditableTable
          columns={columns}
          data={projectData || []}
          loading={isLoading}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}
