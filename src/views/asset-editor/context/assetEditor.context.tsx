import { createContext, useReducer, useContext, ReactNode } from "react";
import { EDITOR_VIEWS } from "../assetEditor.consts";
import { Asset } from "art-os-package/src/assets/asset.types";

export type AssetEditorState = {
  editorView: string;
  assets: Asset[];
};
export const INITIAL_ASSET_EDITOR_STATE: AssetEditorState = {
  editorView: EDITOR_VIEWS.GEOMETRY,
  assets: [],
};

export type AssetEditorActions = {
  type: "ADD_ASSETS";
  payload: { viewId: string; assets: Asset[] };
};

type AssetEditorContextType = {
  state: AssetEditorState;
  dispatch: React.Dispatch<AssetEditorActions>;
};
export const AssetEditorContext = createContext<
  AssetEditorContextType | undefined
>(undefined);

const reducer = (state: AssetEditorState, action: AssetEditorActions) => {
  switch (action.type) {
    case "ADD_ASSETS":
      return {
        ...state,
        assets: action.payload.assets,
      };
    default:
      return state;
  }
};

const AssetEditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_ASSET_EDITOR_STATE);
  return (
    <AssetEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </AssetEditorContext.Provider>
  );
};

const useAssetEditorContext = () => {
  const context = useContext(AssetEditorContext);
  if (!context) {
    throw new Error(
      "useAssetEditorContext must be used within a AssetEditor Provider"
    );
  }

  return context;
};

export { AssetEditorProvider, useAssetEditorContext };
