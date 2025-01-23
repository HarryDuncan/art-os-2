import { useKeyListener, WindowStateProvider } from "art-os-package";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ViewWrapper } from "views/components/view-wrapper/ViewWrapper";
import { KEYS, VIEW_TYPES } from "consts/views.consts";
import { Container } from "views/Container";
import { useCallback } from "react";
import { AppProvider, useAppContext } from "context/app.context";
import { GeometryPreprocess } from "views/asset-editor/GeometryPreprocess";
import { VideoFilter } from "views/video-filter-view/VideoFilter";
import { GlobalStyle, THEME } from "theme";
import { ThemeProvider } from "styled-components";
import { ViewScene } from "views/view-scene-view/ViewScene";
import { InteractiveView } from "views/interactive-view/InteractiveView";
import { VideoStream } from "components/video-stream/VideoStream";

const App = () => {
  return (
    <WindowStateProvider>
      <AppProvider>
        <ThemeProvider theme={THEME}>
          <GlobalStyle />
          <AppContent />
        </ThemeProvider>
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
          <Route path="/interactive" element={<InteractiveView />} />
          <Route path="/video-filter" element={<VideoFilter />} />
          <Route path="/view-scene" element={<ViewScene />} />
          <Route path="/asset-editor" element={<GeometryPreprocess />} />
        </Routes>
        <VideoStream />
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
