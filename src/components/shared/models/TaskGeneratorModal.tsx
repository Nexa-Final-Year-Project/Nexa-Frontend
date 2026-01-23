import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { FormField as FormFieldComponent } from "@/components/ui/form/FormField";
import { FormField as FormFieldType } from "@/types/form";
import { Project } from "@/types/project";

interface TaskGeneratorConfig {
  projectName: string;
  projectType: string;
  mainModules: string[];
  techStack: string[];
  teamRoles: string[];
  complexityLevel: string;
  preferredTaskCount: number;
  includeBugTasks: boolean;
  includeTestCases: boolean;
}

interface TaskGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName?: string;
  projectType?: string;
  project?: Project | null;
  handleSubmit: (data: {
    description: string;
    config: Partial<TaskGeneratorConfig>;
    projectId: string;
  }) => Promise<void> | void;
}

const COMMON_MODULES = [
  "Authentication",
  "Authorization",
  "Dashboard",
  "User Management",
  "Task Management",
  "Reporting",
  "Analytics",
  "Search",
  "Notifications",
  "File Management",
  "Settings",
  "Comments",
  "Workflow",
  "Integration",
];

const TaskGeneratorModal: React.FC<TaskGeneratorModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName = "Project",
  projectType = "Web App",
  handleSubmit,
}) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [useCustomModules, setUseCustomModules] = useState(false);
  const [customModulesText, setCustomModulesText] = useState("");
  const [loading, setLoading] = useState(false);

  const formFields: FormFieldType[] = [
    {
      name: "description",
      label: "Project Description",
      type: "text",
      placeholder: "Describe your project in detail...",
      required: true,
    } as FormFieldType,
    {
      name: "techStack",
      label: "Tech Stack (comma-separated)",
      type: "text",
      placeholder: "e.g., Node, MongoDB, React, FastAPI",
      required: false,
    } as FormFieldType,
    {
      name: "teamRoles",
      label: "Team Roles (comma-separated)",
      type: "text",
      placeholder: "e.g., Frontend, Backend, AI Engineer, DevOps",
      required: false,
    } as FormFieldType,
    {
      name: "complexityLevel",
      label: "Complexity Level",
      type: "select",
      placeholder: "Select complexity",
      options: [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
        { label: "Expert", value: "Expert" },
      ],
      required: false,
    } as FormFieldType,
    {
      name: "preferredTaskCount",
      label: "Preferred Task Count",
      type: "number",
      placeholder: "e.g., 40",
      required: false,
    } as FormFieldType,
    {
      name: "includeBugTasks",
      label: "Include Bug Tasks",
      type: "checkbox",
      required: false,
    } as FormFieldType,
    {
      name: "includeTestCases",
      label: "Include Test Cases",
      type: "checkbox",
      required: false,
    } as FormFieldType,
  ];

  const form = useForm({
    initialValues: {
      description: "",
      techStack: "",
      teamRoles: "",
      complexityLevel: "Advanced",
      preferredTaskCount: 40,
      includeBugTasks: false,
      includeTestCases: false,
    },
  });

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const onSubmitForm = async (formData: Record<string, any>) => {
    setLoading(true);
    try {
      // Collect main modules from selected checkboxes and custom input
      let mainModules: string[] = [...selectedModules];

      if (useCustomModules && customModulesText.trim()) {
        const customModules = customModulesText
          .split(",")
          .map((m: string) => m.trim())
          .filter((m: string) => m.length > 0);
        mainModules = [...mainModules, ...customModules];
      }

      // Parse comma-separated tech stack
      const techStack = formData.techStack
        ? formData.techStack.split(",").map((t: string) => t.trim())
        : [];

      // Parse comma-separated team roles
      const teamRoles = formData.teamRoles
        ? formData.teamRoles.split(",").map((r: string) => r.trim())
        : [];

      const config: Partial<TaskGeneratorConfig> = {
        projectName,
        projectType,
        mainModules,
        techStack,
        teamRoles,
        complexityLevel: formData.complexityLevel || "Advanced",
        preferredTaskCount: formData.preferredTaskCount || 40,
        includeBugTasks: formData.includeBugTasks || false,
        includeTestCases: formData.includeTestCases || false,
      };

      // Wait for generation to complete
      await handleSubmit({
        description: formData.description,
        config,
        projectId,
      });

      // Reset state and close only after successful generation
      setSelectedModules([]);
      setUseCustomModules(false);
      setCustomModulesText("");
      onClose();
    } catch (error) {
      console.error("Task generation failed:", error);
      // Don't close on error - let user retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Task Generator"
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      hideTrigger
      showHeader
      showFooter={false}
    >
      <form
        onSubmit={form.onSubmit(onSubmitForm)}
        className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 sm:pr-2 hide-scrollbar"
      >
        {/* Project Info Header */}
        <div className="space-y-3 p-4 rounded-2xl border bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-emerald-500/5 border-border">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Project
              </p>
              <p className="text-base font-semibold text-foreground">{projectName}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-medium border bg-background/60 text-foreground">
              Type: {projectType}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Provide context and modules so AI can generate structured, implementation-ready tasks.
          </p>
        </div>

        {/* Main Modules Selector */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Main Modules <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Select common modules used in your project
            </p>
          </div>

          {/* Common Modules Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {COMMON_MODULES.map((module) => (
              <button
                key={module}
                type="button"
                onClick={() => toggleModule(module)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                  selectedModules.includes(module)
                    ? "border-primary bg-primary/10 text-primary shadow-[0_6px_20px_rgba(124,58,237,0.18)]"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white/85 dark:hover:border-white/20 dark:hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    selectedModules.includes(module)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 dark:border-white/25"
                  }`}
                >
                  {selectedModules.includes(module) && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-sm font-medium">{module}</span>
              </button>
            ))}
          </div>

          {/* Custom/Other Modules Section */}
          <div className="mt-4 space-y-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setUseCustomModules(!useCustomModules)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all w-full ${
                useCustomModules
                  ? "border-secondary bg-secondary/10 text-secondary shadow-[0_8px_24px_rgba(16,185,129,0.18)]"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white/85 dark:hover:border-white/20 dark:hover:bg-white/5"
              }`}
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  useCustomModules
                    ? "bg-secondary border-secondary"
                    : "border-muted-foreground/40 dark:border-white/25"
                }`}
              >
                {useCustomModules && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>
              <span className="text-sm font-medium">Add Custom Modules</span>
            </button>

            {useCustomModules && (
              <div className="pl-6 space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-medium text-muted-foreground">
                  Enter additional modules (comma-separated)
                </label>
                <textarea
                  value={customModulesText}
                  onChange={(e) => setCustomModulesText(e.target.value)}
                  placeholder="e.g., Payment Gateway, Email Service, API Integration"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Selected Modules Display */}
          {selectedModules.length > 0 && (
            <div className="pt-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Selected Modules ({selectedModules.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedModules.map((module) => (
                  <span
                    key={module}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => toggleModule(module)}
                      className="hover:text-primary/70 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(0, 4).map((field) => (
              <FormFieldComponent key={field.name} field={field} form={form} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(4).map((field) => (
              <FormFieldComponent key={field.name} field={field} form={form} />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4 pb-2">
          <Button
            type="submit"
            disabled={loading || selectedModules.length === 0}
            className="w-full max-w-md h-11 text-base font-medium bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Tasks
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskGeneratorModal;
