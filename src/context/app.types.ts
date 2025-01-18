import { SceneConfig } from "art-os-package/src/config/config.types";

export type AppViews = Record<string, ViewState>;
export type UploadedAsset = Record<string, string>;
export type ViewState = {
  selectedSceneConfigUrl: string | null;
  sceneConfig: SceneConfig[] | undefined;
  configLength?: number;
  configIndex?: number;
  uploadedAssets: UploadedAsset;
  isPlaying: boolean;
};
