"use client";

import { Form } from "@/components/ui/form/Form";
import type { FormField as FormFieldType } from "@/types/form";
import { Switch } from "@/components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { ImageIcon, Globe, Lock, Upload } from "lucide-react";

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
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
            <div className="flex items-center gap-4">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-xl transition-colors
                ${form.values.visibility === "public" 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-white/[0.06] text-white/60"
                }
              `}>
                {form.values.visibility === "public" ? (
                  <Globe className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">
                  {form.values.visibility === "public" ? "Public Project" : "Private Project"}
                </p>
                <p className="text-sm text-white/40">
                  {form.values.visibility === "public"
                    ? "Anyone with the link can view this project"
                    : "Only invited members can access"}
                </p>
              </div>
            </div>
            <Switch
              checked={form.values.visibility === "public"}
              onCheckedChange={(checked) =>
                form.setFieldValue("visibility", checked ? "public" : "private")
              }
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Project Information Section */}
      <div className="text-left">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2 className="text-xl font-bold text-white">Project Information</h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Update your project details and settings
        </p>
        
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
          <Form
            fields={generalFields}
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitButtonText="Save Changes"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Project Avatar Section */}
      <div className="text-left">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2 className="text-xl font-bold text-white">Project Avatar</h2>
        </div>
        <p className="text-sm text-white/40 ml-4 mb-6">
          Customize your project's visual identity
        </p>
        
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center gap-8">
            {/* Avatar Display */}
            <div className="relative group">
              <Avatar className="h-24 w-24 rounded-2xl border-2 border-white/[0.08] shadow-lg">
                <AvatarImage src={project.avatar} className="rounded-2xl" />
                <AvatarFallback className="text-3xl rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-white/80 font-semibold">
                  {project.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload className="w-6 h-6 text-white/80" />
              </div>
            </div>
            
            {/* Upload Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Upload a new avatar</h3>
                <p className="text-xs text-white/40">
                  Recommended: Square image, at least 256x256px
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-white/[0.06] border border-white/[0.08]
                  text-sm font-medium text-white/80
                  hover:bg-white/[0.1] hover:border-white/[0.12]
                  transition-all duration-200 cursor-pointer
                ">
                  <ImageIcon className="w-4 h-4" />
                  Choose File
                </button>
                <span className="text-xs text-white/30">
                  JPG, PNG or GIF • Max 5MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
