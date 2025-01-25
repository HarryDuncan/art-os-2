import { SCENE_TAGS } from "consts/sceneConfig.consts";
import { VIEW_TYPES } from "consts/views.consts";
import { InteractionSelector } from "views/components/view-toolbar/components/interaction-selector/InteractionSelector";
import { ViewToolBar } from "views/components/view-toolbar/ViewToolBar";

const TAG_FILTERS = [SCENE_TAGS.INTERACTIVE];

export const InteractiveViewToolbar = () => {
  return (
    <ViewToolBar viewId={VIEW_TYPES.INTERACTIVE} configTagFilters={TAG_FILTERS}>
      <InteractionSelector viewId={VIEW_TYPES.INTERACTIVE} />
    </ViewToolBar>
  );
};
