import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Archive, Trash2 } from "lucide-react";
import { ProjectDangerZoneModal } from "../projects/ProjectDangerZone";
import { useState } from "react";
import { useProjects } from "@/hooks/projects/useProjects";

interface DangerZoneSettingsProps {
  project: any;
  onArchive: () => Promise<void>;
}

export const DangerZoneSettings = ({ project, onArchive }: DangerZoneSettingsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteProject } = useProjects();
  const handleDeleteProject = async () => {
    // Logic to delete the project
    console.log(`Deleting project: ${project.name}`);
    await deleteProject(project._id);
    setIsDeleteModalOpen(false);
  };
  return (
    <Card className="!bg-none !shadow-none !border-0 text-left">
      <CardHeader className="text-destructive">
        <CardTitle className="text-2xl font-bold">Danger Zone</CardTitle>
        <CardDescription className="text-muted-foreground">
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between p-4 border border-destructive/50 rounded-md">
          <div className="space-y-1">
            <h4 className="font-medium">Archive this project</h4>
            <p className="text-sm text-muted-foreground">
              Archived projects are hidden from your main dashboard but can be
              restored later.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={onArchive}
          >
            <Archive className="w-4 h-4 mr-2" />
            Archive Project
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between p-4 border border-destructive/50 rounded-md">
          <div className="space-y-1">
            <h4 className="font-medium">Delete this project</h4>
            <p className="text-sm text-muted-foreground">
              Once you delete a project, there is no going back. Please be
              certain.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
        </div>
        {isDeleteModalOpen && (
          <ProjectDangerZoneModal
            projectName={project.name}
            onDelete={handleDeleteProject}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          />
        )}
      </CardContent>
    </Card>
  );
};
