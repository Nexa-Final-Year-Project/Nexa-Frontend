// modals/configMap.ts
import { useProjectConfigs } from "./projects/config";
import { useSearchConfigs } from "./search/config";
import { useTaskConfigs } from "./tasks/config";

export function useModalConfigs(close: () => void) {
  const projectConfigs = useProjectConfigs(close);
  const taskConfigs = useTaskConfigs(close);
  const searchConfigs = useSearchConfigs(close);

  return {
    ...projectConfigs,
    ...taskConfigs,
    ...searchConfigs,
  };
}
