"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form/Form";
import type { FormField as FormFieldType } from "@/types/form";
import { Switch } from "@/components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface GeneralSettingsProps {
  project: any;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  initialValues: Record<string, any>;
}

export const GeneralSettings = ({
  project,
  onSubmit,
  initialValues,
}: GeneralSettingsProps) => {
  const generalFields: FormFieldType[] = [
    {
      name: "name",
      label: "Project Name",
      type: "text",
      placeholder: "Enter project name",
      validation: (value) => (!value ? "Project name is required" : null),
      span: 12,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your project",
      span: 12,
    },
    {
      name: "visibility",
      label: "Project Visibility",
      type: "custom",
      span: 12,
      render: (form) => (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Private Project</p>
              <p className="text-sm text-muted-foreground">
                Only invited members can access this project
              </p>
            </div>
            <Switch
              checked={form.values.visibility === "public"}
              onCheckedChange={(checked) =>
                form.setFieldValue("visibility", checked ? "public" : "private")
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {form.values.visibility === "public"
              ? "Anyone with the link can view this project"
              : "This project is only visible to team members"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card className="!shadow-none !border-0">
      <CardContent className="space-y-8">
        {/* Project Information */}
        <div className="text-left">
          <h2 className="text-2xl font-bold">Project Information</h2>
          <p className="text-sm text-muted-foreground my-3">
            Update your project details and settings
          </p>
          <Form
            fields={generalFields}
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitButtonText="Save Changes"
          />
        </div>

        <Separator />

        {/* Project Avatar */}
        <div className=" text-left">
          <h2 className="text-2xl font-bold">Project Avatar</h2>
          <p className="text-sm text-muted-foreground my-3">
            Update your project avatar
          </p>
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={project.avatar} />
              <AvatarFallback className="text-xl">
                {project.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, GIF or PNG. Max size of 5MB.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
