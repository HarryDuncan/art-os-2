import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { Dropdown } from "components/inputs/Dropdown";
import { useSceneConfigs } from "views/hooks/useSceneConfigs";

interface ConfigSelector {
  viewId: string;
  configTagFilters?: string[];
}
export const ConfigSelector = ({
  viewId,
  configTagFilters = [] as string[],
}) => {
  const { onSelect, selectableConfigs } = useSceneConfigs(
    viewId,
    configTagFilters
  );
  return (
    <TopBarItem>
      <Dropdown
        key={"video-filter-configs"}
        data={selectableConfigs}
        onChange={onSelect}
        label={"Select A Scene"}
      />
    </TopBarItem>
  );
};
