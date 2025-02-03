import { useFetchConfig } from "art-os-package";
import { useMemo, useState } from "react";

export const useInteractionConfig = (
  selectedInteractionConfigUrl: string | null,
  interactionConfigIndex: number = 0
) => {
  const [areProcessesReady, setAreProcessesReady] = useState<boolean>(false);
  const interactionConfig = useFetchConfig(selectedInteractionConfigUrl);

  const formattedInteractionConfig = useMemo(() => {
    const selectedInteractionConfig = interactionConfig
      ? interactionConfig[interactionConfigIndex]
      : null;
    return selectedInteractionConfig;
  }, [interactionConfig]);
  return { formattedInteractionConfig, areProcessesReady };
};
