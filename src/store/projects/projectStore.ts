// stores/projectStore.ts
import { create } from "zustand";
import type { Project } from "@/types/project"; // Adjust import path as needed

type ProjectState = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, changes: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
};
export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial empty array of projects
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project: Project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
    })),

  updateProject: (id, changes) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === id ? { ...p, ...changes } : p
      ),
    })),

  getProjectById: (id) => get().projects.find((p) => p._id === id),
}));

export const useProjects = () => useProjectStore((state) => state.projects);

export const useProjectActions = () =>
  useProjectStore((state) => ({
    addProject: state.addProject,
    setProjects: state.setProjects,
    removeProject: state.removeProject,
    updateProject: state.updateProject,
  }));

export const useProject = (id: string) =>
  useProjectStore((state) => state.projects.find((p) => p._id === id));
