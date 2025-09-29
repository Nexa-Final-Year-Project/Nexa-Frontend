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
} from "lucide-react";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/shared/customlink/CustomLink";

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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Projects</h1>
      <EditableTable
        columns={columns}
        data={projectData || []}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </div>
  );
}
