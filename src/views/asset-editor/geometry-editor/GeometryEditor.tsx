import { Button } from "@mantine/core";
import { AdvancedAssetSelector } from "../components/advanced-asset-selector/AdvancedAssetSelector";
import { EditorToolBar } from "../components/editor-toolbar/EditorToolbar";
import { useCallback, useMemo } from "react";
import { useAssetEditorContext } from "../context/assetEditor.context";
import { Asset } from "art-os-package/src/assets/asset.types";
import { EDITOR_VIEWS } from "../assetEditor.consts";
import { sendMessage } from "ipc";

const preTransformConfig = {
  centerGeometry: true,
};

const PROGRAMS = [{ id: "sameVerticies", label: "Same Vertices" }];

export const GeometryEditor = () => {
  const {
    dispatch,
    state: { assets },
  } = useAssetEditorContext();

  const updateAddedAssets = useCallback(
    (updatedAssets) => {
      dispatch({
        type: "ADD_ASSETS",
        payload: { viewId: EDITOR_VIEWS.GEOMETRY, assets: updatedAssets },
      });
    },
    [dispatch]
  );
  const performFunction = useCallback(
    (id) => {
      const message = { url: "process_command", data: { command: id, assets } };
      console.log(message);
      sendMessage(message);
    },
    [assets, sendMessage]
  );

  const assetFunctionsEnabled = useMemo(() => assets.length > 0, [assets]);
  return (
    <div className="view-container">
      <h1>Geometry Editor</h1>
      <AdvancedAssetSelector onAssetsUpdated={updateAddedAssets} />
      <EditorToolBar>
        {PROGRAMS.map(({ id, label }) => (
          <Button
            key={`${id}-${assetFunctionsEnabled}`}
            disabled={!assetFunctionsEnabled}
            onClick={() => performFunction(id)}
          >
            {label}
          </Button>
        ))}
      </EditorToolBar>
    </div>
  );
};
