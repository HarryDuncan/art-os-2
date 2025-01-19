import { HorizontalDraw } from "components/drawer/horizontal-drawer/HorizontalDrawer";
import { KEYS } from "consts/views.consts";
import { ReactNode } from "react";
import { ConfigSelector } from "./components/ConfigSelector";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { SceneIndexController } from "./components/SceneIndexController";
import { AssetUpload } from "./components/asset-upload/AssetUpload";

interface ViewToolBarProps {
  viewId: string;
  configTagFilters?: string[];
  isOpenInitially?: boolean;
  drawOpenKey?: string;
  children?: ReactNode;
}

export const ViewToolBar = ({
  viewId,
  configTagFilters = [] as string[],
  isOpenInitially = true,
  drawOpenKey = KEYS.TAB,
  children,
}: ViewToolBarProps) => (
  <HorizontalDraw isOpenInitially={isOpenInitially} keyCode={drawOpenKey}>
    <PlayPauseButton viewId={viewId} />
    <ConfigSelector viewId={viewId} configTagFilters={configTagFilters} />
    <SceneIndexController viewId={viewId} />
    <AssetUpload viewId={viewId} />
    {children}
  </HorizontalDraw>
);
