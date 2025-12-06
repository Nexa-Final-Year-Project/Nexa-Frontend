import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StarredProjectsState {
  starredProjectIds: string[];
  toggleStar: (projectId: string) => void;
  isStarred: (projectId: string) => boolean;
  clearAllStars: () => void;
}

export const useStarredProjectsStore = create<StarredProjectsState>()(
  persist(
    (set, get) => ({
      starredProjectIds: [],

      toggleStar: (projectId: string) => {
        const { starredProjectIds } = get();
        const isCurrentlyStarred = starredProjectIds.includes(projectId);

        if (isCurrentlyStarred) {
          set({
            starredProjectIds: starredProjectIds.filter(
              (id) => id !== projectId
            ),
          });
        } else {
          set({ starredProjectIds: [...starredProjectIds, projectId] });
        }
      },

      isStarred: (projectId: string) => {
        return get().starredProjectIds.includes(projectId);
      },

      clearAllStars: () => {
        set({ starredProjectIds: [] });
      },
    }),
    {
      name: "nexa-starred-projects",
    }
  )
);
