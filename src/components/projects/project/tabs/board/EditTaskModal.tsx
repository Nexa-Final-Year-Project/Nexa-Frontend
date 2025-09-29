"use client";
import { Modal } from "@/components/ui/modal/Modal";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import RichTextEditor from "./rich-text/RichTextEditor";
import { Task as TaskData, TaskPriority, TaskStatus } from "@/types/task";
import { useForm } from "@mantine/form";
import { FormField } from "@/components/ui/form/FormField";

interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: TaskData;
  assignees?: Assignee[];
  availableLabels?: Label[];
  onSave: (task: TaskData) => void;
}

const EditTaskModal = ({
  open,
  onClose,
  initialData,
  assignees = [],
  availableLabels = [],
  onSave,
}: EditTaskModalProps) => {
  console.log("EditTaskModal initialData:", initialData);
  const form = useForm({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      assignee: initialData?.assignee?._id || "",
      dueDate: initialData?.dueDate || "",
      priority: initialData?.priority || "Medium",
      labels: initialData?.labels || [],
      status: initialData?.status || "Backlog",
    },
  });

  const [selectedLabels, setSelectedLabels] = useState<Label[]>(
    initialData?.labels || []
  );
  const [newLabelInput, setNewLabelInput] = useState("");

  // Initialize form with task data
  useEffect(() => {
    if (initialData) {
      form.setValues({
        title: initialData.title,
        description: initialData.description || "",
        assignee: initialData.assignee?._id || "",
        dueDate: initialData.dueDate || "",
        priority: initialData.priority || "Medium",
        labels: initialData.labels || [],
        status: initialData.status || "Backlog",
      });
      setSelectedLabels(initialData.labels || []);
    }
  }, [initialData]);

  // Handle label operations
  const addLabel = () => {
    if (
      newLabelInput.trim() &&
      !selectedLabels.some((label) => label.name === newLabelInput.trim())
    ) {
      const newLabel = {
        id: `label-${Date.now()}`,
        name: newLabelInput.trim(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setSelectedLabels([...selectedLabels, newLabel]);
      setNewLabelInput("");
    }
  };

  const removeLabel = (labelId: string) => {
    setSelectedLabels(selectedLabels.filter((label) => label._id !== labelId));
  };

  const toggleLabel = (label: Label) => {
    if (selectedLabels.some((l) => l._id === label._id)) {
      removeLabel(label._id);
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!form.values.title.trim()) {
      alert("Title is required");
      return;
    }

    const selectedAssignee = assignees.find(
      (a) => a._id === form.values.assignee
    );

    const updatedTask: TaskData = {
      _id: initialData?._id || `task-${Date.now()}`,
      title: form.values.title,
      description: form.values.description,
      assignee: selectedAssignee || undefined,
      dueDate: form.values.dueDate
        ? typeof form.values.dueDate === "string"
          ? new Date(form.values.dueDate)
          : form.values.dueDate
        : undefined,
      priority: form.values.priority as TaskPriority,
      labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      status: form.values.status as TaskStatus,
    };

    onSave(updatedTask);
    onClose();
  };

  const priorityOptions = [
    {
      value: "High",
      label: "High",
      icon: <FcHighPriority className="w-4 h-4" />,
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    },
    {
      value: "Medium",
      label: "Medium",
      icon: <FcMediumPriority className="w-4 h-4" />,
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    {
      value: "Low",
      label: "Low",
      icon: <FcLowPriority className="w-4 h-4" />,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
  ];

  const statusOptions = [
    { value: "Backlog", label: "Backlog" },
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Done", label: "Done" },
  ];

  const assigneeOptions = [
    { value: "", label: "Unassigned" },
    ...assignees.map((assignee) => ({
      value: assignee._id,
      label: assignee.name,
    })),
  ];

  return (
    <Modal title="Edit Task" open={open} onOpenChange={onClose} size="xl">
      <div className="flex flex-col h-full">
        <div className="flex flex-1 p-6 gap-6 overflow-clip">
          {/* Left Section */}
          <div className="flex-1">
            {/* Title */}
            <FormField
              field={{
                name: "title",
                label: "Title",
                type: "text",
                required: true,
                placeholder: "Task title...",
                validation: {
                  required: true,
                  minLength: 2,
                  maxLength: 100,
                },
              }}
              form={form}
            />

            {/* Description Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Description
              </label>
              <RichTextEditor
                content={form.values.description}
                setContent={(content) =>
                  form.setFieldValue("description", content)
                }
              />
            </div>
          </div>

          {/* Right Section (Details) */}
          <div className="w-80 border-l pl-6 dark:border-gray-700">
            <h3 className="font-semibold mb-4 text-lg dark:text-white">
              Details
            </h3>

            {/* Status */}
            <FormField
              field={{
                name: "status",
                label: "Status",
                type: "select",
                options: statusOptions,
                required: false,
              }}
              form={form}
            />

            {/* Assignee */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Assignee
              </label>
              {form.values.assignee ? (
                <div className="flex items-center gap-2 p-2 border rounded-lg dark:border-gray-700">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        assignees.find((a) => a._id === form.values.assignee)
                          ?.avatar
                      }
                    />
                    <AvatarFallback>
                      {assignees
                        .find((a) => a._id === form.values.assignee)
                        ?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm dark:text-white">
                    {
                      assignees.find((a) => a._id === form.values.assignee)
                        ?.name
                    }
                  </span>
                  <button
                    onClick={() => form.setFieldValue("assignee", "")}
                    className="ml-auto text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>Null</>
                // <FormField
                //   field={{
                //     name: "assignee",
                //     label: "",
                //     type: "select",
                //     options: assigneeOptions,
                //     required: false,
                //   }}
                //   form={form}
                // />
              )}
            </div>

            {/* Due Date */}
            <FormField
              field={{
                name: "dueDate",
                label: "Due Date",
                type: "date",
                required: false,
              }}
              form={form}
            />

            {/* Priority */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setFieldValue("priority", option.value)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                      form.values.priority === option.value
                        ? option.className
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Labels */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Labels
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLabels.map((label) => (
                  <Badge
                    key={label._id}
                    style={{ backgroundColor: label.color }}
                    className="text-white flex items-center gap-1"
                  >
                    {label.name}
                    <button
                      onClick={() => removeLabel(label._id)}
                      className="hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add label..."
                  value={newLabelInput}
                  onChange={(e) => setNewLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLabel()}
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <Button
                  onClick={addLabel}
                  variant="outline"
                  className="dark:text-white text-lg"
                >
                  +
                </Button>
              </div>
              {availableLabels.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Available labels:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {availableLabels.map((label) => (
                      <Badge
                        key={label._id}
                        variant={
                          selectedLabels.some((l) => l._id === label._id)
                            ? "default"
                            : "outline"
                        }
                        style={{
                          backgroundColor: selectedLabels.some(
                            (l) => l._id === label._id
                          )
                            ? label.color
                            : undefined,
                        }}
                        className="cursor-pointer"
                        onClick={() => toggleLabel(label)}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {initialData?._id
              ? `Editing task ${initialData._id}`
              : "Creating new task"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="dark:bg-gray-800 dark:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
