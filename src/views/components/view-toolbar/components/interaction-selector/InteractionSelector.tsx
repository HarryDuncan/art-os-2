import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { Dropdown } from "components/inputs/Dropdown";
import { useInteractionConfigs } from "views/hooks/useInteractionConfigs";

interface InteractionSelectorProps {
  viewId: string;
  configTagFilters?: string[];
}
export const InteractionSelector = ({
  viewId,
  configTagFilters = [],
}: InteractionSelectorProps) => {
  const { onSelect, selectableConfigs } = useInteractionConfigs(
    viewId,
    configTagFilters
  );
  return (
    <TopBarItem>
      <Dropdown
        key={"interaction-configs"}
        data={selectableConfigs}
        onChange={onSelect}
        label={"Select An Interaction Config"}
      />
    </TopBarItem>
  );
};
