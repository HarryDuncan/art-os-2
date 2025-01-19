import { TopBarItem } from "components/drawer/horizontal-drawer/HorizontalDrawer.styles";
import { useTogglePlayPause } from "hooks/useTogglePlayPause";

interface PlayPauseButtonProps {
  viewId: string;
}
export const PlayPauseButton = ({ viewId }: PlayPauseButtonProps) => {
  const togglePlayPause = useTogglePlayPause(viewId);
  return (
    <TopBarItem>
      <button onClick={togglePlayPause}>Play or pause</button>
    </TopBarItem>
  );
};
