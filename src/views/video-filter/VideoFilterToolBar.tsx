import { AssetFileUpload } from "components/asset-file-upload/AssetFileUpload";
import { HorizontalDraw } from "components/drawer/horizontal-drawer/HorizontalDrawer";
import { Dropdown } from "components/inputs/Dropdown";
import { SCENE_TAGS } from "consts/sceneConfig.consts";
import { KEYS, VIEW_TYPES } from "consts/views.consts";
import { useAppContext } from "context/app.context";
import { useSetUploadedAssets } from "hooks/useSetUploadedAssets";
import { useTogglePlayPause } from "hooks/useTogglePlayPause";
import { useCallback } from "react";
import { useSceneConfigs } from "views/hooks/useSceneConfigs";

const TAG_FILTERS = [SCENE_TAGS.VIDEO_FILTER];

const assetConfig = {
  id: "video",
};
export const VideoFilterToolBar = () => {
  return (
    <HorizontalDraw isOpenInitially={true} keyCode={KEYS.TAB}>
      <DrawContent />
    </HorizontalDraw>
  );
};

const DrawContent = () => {
  const { onSelect, selectableConfigs } = useSceneConfigs(
    VIEW_TYPES.VIDEO_FILTER,
    TAG_FILTERS
  );

  const uploadAsset = useSetUploadedAssets(VIEW_TYPES.VIDEO_FILTER);
  const onAssetsLoaded = useCallback(
    (fileContent: string | any) => {
      uploadAsset("video", fileContent[0].path);
    },
    [uploadAsset]
  );

  const togglePlayPause = useTogglePlayPause(VIEW_TYPES.VIDEO_FILTER);

  return (
    <div>
      <button onClick={togglePlayPause}>Play or pause</button>
      <Dropdown
        key={"video-filter-configs"}
        data={selectableConfigs}
        onChange={onSelect}
        label={"Select A Scene"}
      />
      <AssetFileUpload onFileLoad={onAssetsLoaded} />
    </div>
  );
};
