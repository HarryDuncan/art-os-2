import { SceneConfig } from "art-os-package/src/config/config.types";
import { InteractionConfig } from "art-os-package/src/interaction/interactions.types";

export type AppViews = Record<string, ViewState>;
export type UploadedAsset = Record<string, string>;
export type ViewState = {
  selectedSceneConfigUrl: string | null;
  selectedInteractionConfigUrl: string | null;
  selectedInteractionConfig: InteractionConfig[] | undefined;
  sceneConfig: SceneConfig[] | undefined;
  configLength?: number;
  configIndex?: number;
  uploadedAssets: UploadedAsset;
  isPlaying: boolean;
};
