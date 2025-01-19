import { VIEW_TYPES } from "consts/views.consts";
import { ViewToolBar } from "views/components/view-toolbar/ViewToolBar";

export const ViewSceneToolBar = () => {
  return <ViewToolBar viewId={VIEW_TYPES.VIEW_SCENE} />;
};
