// modals/tasks/configs.ts
export function useTaskConfigs(close: () => void) {
  return {
    "task.create": {
      title: "Create Task",
      formFields: [
        { name: "title", label: "Task Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ],
      submitButtonText: "Create",
      onSubmit: async (values: any) => {
        console.log("Task created:", values);
        close();
      },
    },
  };
}
