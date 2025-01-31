import { AssetEditorProvider } from "./context/assetEditor.context";
import { GeometryEditor } from "./geometry-editor/GeometryEditor";

export const AssetEditor = () => {
  return (
    <AssetEditorProvider>
      <GeometryEditor />
    </AssetEditorProvider>
  );
};
