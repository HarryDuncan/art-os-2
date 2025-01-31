import { TableComponent } from "components/table/Table";
import { AddNewAsset } from "./AddNewAsset";
import { AssetSelectorContainer } from "./AdvancedAssetSelector.styles";
import { Asset } from "art-os-package/src/assets/asset.types";
import { useCallback, useEffect, useState } from "react";

const ASSET_TABLE_COLUMNS = [
  { title: "Asset Name", key: "id" },
  { title: "Path", key: "path" },
  { title: "Asset Type", key: "assetType" },
];

interface AdvancedAssetSelectorProps {
  onAssetsUpdated: (assets: Asset[]) => void;
}
export const AdvancedAssetSelector = ({
  onAssetsUpdated,
}: AdvancedAssetSelectorProps) => {
  const [savedAssets, setSavedAssets] = useState<Asset[]>([]);

  const onAssetAdded = useCallback(
    (addedAsset: Asset) => {
      setSavedAssets((prev) => [...prev, addedAsset]);
    },
    [setSavedAssets]
  );

  useEffect(() => {
    onAssetsUpdated(savedAssets);
  }, [onAssetsUpdated, savedAssets]);

  return (
    <AssetSelectorContainer>
      <AddNewAsset onSaveAsset={onAssetAdded} />
      <TableComponent
        tableColumns={ASSET_TABLE_COLUMNS}
        rowItems={savedAssets}
      />
    </AssetSelectorContainer>
  );
};
