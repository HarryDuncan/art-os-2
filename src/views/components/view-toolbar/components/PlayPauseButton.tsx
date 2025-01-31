import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { useTogglePlayPause } from "hooks/useTogglePlayPause";

interface PlayPauseButtonProps {
  viewId: string;
}
export const PlayPauseButton = ({ viewId }: PlayPauseButtonProps) => {
  const { toggleCallback, isPlaying } = useTogglePlayPause(viewId);
  return (
    <TopBarItem>
      <button onClick={toggleCallback}>{isPlaying ? "Pause" : "Play"}</button>
    </TopBarItem>
  );
};
