import GlobalSearchModal from "@/components/shared/search/GlobalSearchModal";

// modals/tasks/configs.ts
export function useSearchConfigs(close: () => void) {
  return {
    "search.global": {
      component: GlobalSearchModal,
      props: {
        isOpen: true,
        onOpenChange: close,
        title: "Search",
      },
    },
  };
}
