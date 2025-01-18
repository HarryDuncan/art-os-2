import { createContext, useReducer, useContext, ReactNode } from "react";
import { AppViews, ViewState } from "./app.types";

export type AppState = {
  isViewFullScreen: boolean;
  viewStates: AppViews;
};
export const INITIAL_APP_STATE: AppState = {
  isViewFullScreen: false,
  viewStates: {},
};

export type AppActions =
  | {
      type: "TOGGLE_VIEW_FULLSCREEN";
      payload: {};
    }
  | {
      type: "UPDATE_VIEW_STATE";
      payload: { viewId: string; viewStateData: Partial<ViewState> };
    }
  | {
      type: "UPDATE_UPLOADED_ASSETS";
      payload: { viewId: string; assetId: string; path: string };
    }
  | { type: "TOGGLE_PLAY_PAUSE"; payload: { viewId: string } };

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppActions>;
};
export const AppContext = createContext<AppContextType | undefined>(undefined);

const reducer = (state: AppState, action: AppActions) => {
  switch (action.type) {
    case "TOGGLE_VIEW_FULLSCREEN":
      return {
        ...state,
        isViewFullScreen: !state.isViewFullScreen,
      };
    case "UPDATE_VIEW_STATE": {
      const { viewId, viewStateData } = action.payload;
      const updatedViewData = state.viewStates[viewId]
        ? { ...state.viewStates[viewId], ...viewStateData }
        : viewStateData;
      return {
        ...state,
        viewStates: { ...state.viewStates, [viewId]: updatedViewData },
      };
    }
    case "UPDATE_UPLOADED_ASSETS": {
      const { viewId, assetId, path } = action.payload;
      const updatedViewData = state.viewStates[viewId]
        ? state.viewStates[viewId]
        : { uploadedAssets: {} };
      const uploadedAssets = updatedViewData.uploadedAssets
        ? { ...updatedViewData.uploadedAssets }
        : {};
      uploadedAssets[assetId] = path;

      return {
        ...state,
        viewStates: {
          ...state.viewStates,
          [viewId]: { ...updatedViewData, uploadedAssets },
        },
      };
    }
    case "TOGGLE_PLAY_PAUSE": {
      const { viewId } = action.payload;
      const isPlaying = state.viewStates[viewId]?.isPlaying ?? false;
      const updatedViewData = state.viewStates[viewId]
        ? { ...state.viewStates[viewId], isPlaying: !isPlaying }
        : { isPlaying: !isPlaying };
      return {
        ...state,
        viewStates: { ...state.viewStates, [viewId]: updatedViewData },
      };
    }
    default:
      return state;
  }
};

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_APP_STATE);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a App Provider");
  }

  return context;
};

export { AppProvider, useAppContext };
