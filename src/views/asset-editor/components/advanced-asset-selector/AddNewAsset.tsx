import { TextInput } from "components/inputs/TextInput";
import { ModalComponent } from "components/modal/Modal";
import { AddAssetContainer } from "./AdvancedAssetSelector.styles";
import { AssetFileUpload } from "components/asset-file-upload/AssetFileUpload";
import { useCallback, useMemo, useState } from "react";
import { Asset, ASSET_TYPES } from "art-os-package/src/assets/asset.types";
import { Button } from "@mantine/core";
import { Dropdown } from "components/inputs/Dropdown";

const ASSET_MODAL_TEXT = "Add New Asset";

interface AddNewAssetProps {
  onSaveAsset: (asset: Asset) => void;
}
export const AddNewAsset = ({ onSaveAsset }: AddNewAssetProps) => {
  const [assetData, setAssetData] = useState<Partial<Asset> | null>();

  const updateAssetData = useCallback(
    (key, value) => {
      setAssetData((prev) =>
        prev ? { ...prev, [key]: value } : { [key]: value }
      );
    },
    [setAssetData]
  );
  const onFileUpload = useCallback(
    (fileContent: string | any) => {
      const selectedFilePath = fileContent[0].path;
      updateAssetData("path", selectedFilePath);
    },
    [updateAssetData]
  );

  const onChangeId = useCallback(
    (e) => {
      const value = e.target.value;
      updateAssetData("id", value);
    },
    [updateAssetData]
  );

  const onChangeAssetType = useCallback(
    (option) => {
      updateAssetData("assetType", option);
    },
    [updateAssetData]
  );

  const onSubmit = useCallback(() => {
    onSaveAsset(assetData as Asset);
  }, [assetData, onSaveAsset]);

  const assetTypeDropdownData = useAssetTypeDropdownData();

  return (
    <ModalComponent title={ASSET_MODAL_TEXT} openModalText={ASSET_MODAL_TEXT}>
      <AddAssetContainer>
        <TextInput key={"asset-id"} label={"Asset ID"} onChange={onChangeId} />
        <Dropdown
          key={""}
          data={assetTypeDropdownData}
          onChange={onChangeAssetType}
          label={"Asset Type"}
        />
        <AssetFileUpload onFileLoad={onFileUpload} />
        <Button onClick={onSubmit} disabled={assetData === null} type="submit">
          "Save Asset"
        </Button>
      </AddAssetContainer>
    </ModalComponent>
  );
};

const useAssetTypeDropdownData = () =>
  useMemo(() => Object.keys(ASSET_TYPES).map((assetType) => assetType), []);
