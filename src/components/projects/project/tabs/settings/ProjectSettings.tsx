"use client";
import { useState } from "react";
import { Project, ProjectMember } from "@/types/project";
import { useProjects } from "@/hooks/projects/useProjects";
import toast from "@/lib/customToast";
import { ProjectSettingsSidebar } from "@/components/project-settings/ProjectSettingsSidebar";
import { GeneralSettings } from "@/components/project-settings/GeneralSettings";
import { TeamSettings } from "@/components/project-settings/TeamSettings";
import { ChevronRight } from "lucide-react";
import {
  ActivityLogsSettings,
  AppearanceSettings,
  DangerZoneSettings,
  IntegrationsSettings,
  PermissionsSettings,
} from "@/components/project-settings";

interface ProjectSettingsProps {
  project: Project | null;
  members: ProjectMember[];
}

const ProjectSettings = ({ project, members }: ProjectSettingsProps) => {
  const [activeSection, setActiveSection] = useState("general");
  const [activeCategory, setActiveCategory] = useState("Project");
  const { updateProject } = useProjects();

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleUpdateProject = async (values: Record<string, any>) => {
    await updateProject(project._id, values);
  };

  const initialValues = {
    name: project.name,
    description: project.description || "",
    visibility: project.visibility || "private",
  };

  // Map sections to their respective categories
  const sectionCategories: Record<string, string> = {
    // Project category
    general: "Project",
    appearance: "Project",

    // Team category
    members: "Team",
    invitations: "Team",

    // Permissions category
    "permissions-tasks": "Permissions",
    "permissions-project": "Permissions",
    "permissions-access": "Permissions",

    // System category
    integrations: "System",
    notifications: "System",
    activity: "System",

    // Danger Zone category
    danger: "Danger Zone",
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Update the active category based on the selected section
    const category = sectionCategories[sectionId] || "Project";
    setActiveCategory(category);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            project={project}
            onSubmit={handleUpdateProject}
            initialValues={initialValues}
          />
        );
      case "appearance":
        return <AppearanceSettings project={project} />;
      case "members":
        return <TeamSettings project={project} members={members} />;
      case "invitations":
        return <div className="p-6">Invitations Settings - Coming Soon</div>;
      case "permissions-tasks":
        return <PermissionsSettings tab="tasks" />;
      case "permissions-project":
        return <PermissionsSettings tab="project" />;
      case "permissions-access":
        return <PermissionsSettings tab="access" />;
      case "integrations":
        return <IntegrationsSettings />;
      case "activity":
        return <ActivityLogsSettings />;
      case "danger":
        return <DangerZoneSettings project={project} />;
      default:
        return (
          <GeneralSettings
            project={project}
            onSubmit={handleUpdateProject}
            initialValues={initialValues}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <span className="text-foreground font-bold text-2xl">Settings</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="hover:text-foreground cursor-pointer">
          {activeCategory}
        </span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium capitalize">
          {activeSection.replace(/-/g, " ")}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProjectSettingsSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <div className="flex-1">
          <div className="bg-background rounded-lg border-l p-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
