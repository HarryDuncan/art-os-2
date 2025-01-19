import { AssetFileUpload } from "components/asset-file-upload/AssetFileUpload";
import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { useSetUploadedAssets } from "hooks/useSetUploadedAssets";
import { useCallback } from "react";

interface AssetUploadProps {
  viewId: string;
}
export const AssetUpload = ({ viewId }: AssetUploadProps) => {
  const uploadAsset = useSetUploadedAssets(viewId);
  const onAssetsLoaded = useCallback(
    (fileContent: string | any) => {
      uploadAsset("video", fileContent[0].path);
    },
    [uploadAsset]
  );

  return (
    <TopBarItem>
      <AssetFileUpload onFileLoad={onAssetsLoaded} />
    </TopBarItem>
  );
};
