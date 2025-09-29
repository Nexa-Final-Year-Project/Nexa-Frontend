// stores/projectStore.ts
import { create } from "zustand";
import type { Sprint } from "@/types/sprint"; // Adjust import path as needed

type SprintState = {
  sprints: Sprint[];
  setSprints: (sprints: Sprint[]) => void;
  addSprint: (sprint: Sprint) => void;
  removeSprint: (id: string) => void;
  updateSprint: (id: string, changes: Partial<Sprint>) => void;
  getSprintById: (id: string) => Sprint | undefined;
};
export const useSprintStore = create<SprintState>((set, get) => ({
  // Initial empty array of sprints
  sprints: [],
  setSprints: (sprints) => set({ sprints }),
  addSprint: (sprint: Sprint) =>
    set((state) => ({
      sprints: [...state.sprints, sprint],
    })),
  removeSprint: (id) =>
    set((state) => ({
      sprints: state.sprints.filter((p) => p._id !== id),
    })),

  updateSprint: (id, changes) =>
    set((state) => ({
      sprints: state.sprints.map((p) =>
        p._id === id ? { ...p, ...changes } : p
      ),
    })),

  getSprintById: (id) => get().sprints.find((p) => p._id === id),
}));

export const useSprints = () => useSprintStore((state) => state.sprints);

export const useSprintActions = () =>
  useSprintStore((state) => ({
    addSprint: state.addSprint,
    setSprints: state.setSprints,
    removeSprint: state.removeSprint,
    updateSprint: state.updateSprint,
  }));

export const useSprint = (id: string) =>
  useSprintStore((state) => state.sprints.find((p) => p._id === id));
