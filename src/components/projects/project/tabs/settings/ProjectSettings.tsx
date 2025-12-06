"use client";
import { useState } from "react";
import { Project, ProjectMember } from "@/types/project";
import { useProjects } from "@/hooks/projects/useProjects";
import toast from "@/lib/customToast";
import { ProjectSettingsSidebar } from "@/components/project-settings/ProjectSettingsSidebar";
import { GeneralSettings } from "@/components/project-settings/GeneralSettings";
import { TeamSettings } from "@/components/project-settings/TeamSettings";
import { ChevronRight, Settings } from "lucide-react";
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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white/40 text-lg">Project not found</div>
      </div>
    );
  }

  const handleUpdateProject = async (values: Record<string, any>) => {
    await updateProject(project._id, values);
  };

  const initialValues = {
    name: project.name,
    description: project.description || "",
    visibility: project.visibility || "private",
  };

  const sectionCategories: Record<string, string> = {
    general: "Project",
    appearance: "Project",
    members: "Team",
    invitations: "Team",
    "permissions-tasks": "Permissions",
    "permissions-project": "Permissions",
    "permissions-access": "Permissions",
    integrations: "System",
    notifications: "System",
    activity: "System",
    danger: "Danger Zone",
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
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
        return (
          <div className="p-6 text-white/40">
            Invitations Settings - Coming Soon
          </div>
        );
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
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900/60 border border-white/[0.06] backdrop-blur-sm">
            <Settings className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="flex items-center text-sm text-white/40 mt-1">
              <span className="hover:text-white/60 cursor-pointer transition-colors">
                {activeCategory}
              </span>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-white/20" />
              <span className="text-white/60 capitalize">
                {activeSection.replace(/-/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProjectSettingsSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <div className="flex-1">
          <div className="rounded-2xl bg-neutral-900/40 dark:bg-neutral-900/40 border border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
