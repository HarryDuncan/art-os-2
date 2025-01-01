import { createContext, useReducer, useContext, ReactNode } from "react";

export type AppState = {
  isViewFullScreen: boolean;
};
export const INITIAL_APP_STATE: AppState = {
  isViewFullScreen: false,
};

export type AppActions = {
  type: "TOGGLE_VIEW_FULLSCREEN";
  payload: {};
};

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
