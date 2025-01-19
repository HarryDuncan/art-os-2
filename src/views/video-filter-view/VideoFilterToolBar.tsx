import { SCENE_TAGS } from "consts/sceneConfig.consts";
import { VIEW_TYPES } from "consts/views.consts";
import { ViewToolBar } from "views/components/view-toolbar/ViewToolBar";

const TAG_FILTERS = [SCENE_TAGS.VIDEO_FILTER];

const assetConfig = {
  id: "video",
};
export const VideoFilterToolBar = () => {
  return (
    <ViewToolBar
      viewId={VIEW_TYPES.VIDEO_FILTER}
      configTagFilters={TAG_FILTERS}
    />
  );
};
