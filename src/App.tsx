import { useKeyListener, WindowStateProvider } from "art-os-package";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ViewWrapper } from "components/view-wrapper/ViewWrapper";
import { KEYS, VIEW_TYPES } from "consts/views.consts";
import { Container } from "views/Container";
import { useCallback } from "react";
import { AppProvider, useAppContext } from "context/app.context";
import { GeometryPreprocess } from "views/asset-editor/GeometryPreprocess";

const App = () => {
  return (
    <WindowStateProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </WindowStateProvider>
  );
};

const AppContent = () => {
  useToggleView();
  return (
    <Router>
      <Container>
        <Routes>
          <Route
            path="/interactive"
            element={<ViewWrapper sceneType={VIEW_TYPES.INTERACTIVE} />}
          />
          <Route
            path="/video-filter"
            element={<ViewWrapper sceneType={VIEW_TYPES.VIDEO_FILTER} />}
          />
          <Route
            path="/p5"
            element={<ViewWrapper sceneType={VIEW_TYPES.P5} />}
          />
          <Route path="/asset-editor" element={<GeometryPreprocess />} />
        </Routes>
      </Container>
    </Router>
  );
};

const useToggleView = () => {
  const { dispatch } = useAppContext();
  const onTabPress = useCallback(() => {
    dispatch({ type: "TOGGLE_VIEW_FULLSCREEN", payload: {} });
  }, [dispatch]);
  useKeyListener(KEYS.Q, onTabPress);
};

export default App;

// useEffect(() => {
//   if (!streamData || !canvasRef.current) return;

//   const canvas = canvasRef.current;
//   const context = canvas.getContext("2d");

//   // Create ImageData from streamData
//   const { data, width, height } = streamData;
//   canvas.width = width;
//   canvas.height = height;
//   console.log(data);
//   const imageData = new ImageData(new Uint8ClampedArray(data), width, height);

//   // Clear and draw the updated frame
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   context.putImageData(imageData, 0, 0);
// }, [streamData]);
