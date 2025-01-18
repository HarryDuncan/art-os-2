import { ReactNode, useCallback, useState } from "react";
import { DRAWER_POSITIONS } from "../drawer.consts";
import { StyledHorizontalDraw } from "./HorizontalDrawer.styles";
import { useKeyListener } from "art-os-package";

interface HorizontalDrawProps {
  keyCode: string;
  children: ReactNode;
  isOpenInitially?: boolean;
  verticalPosition?: string;
}

export const HorizontalDraw = ({
  isOpenInitially = false,
  keyCode,
  children,
  verticalPosition = DRAWER_POSITIONS.TOP,
}: HorizontalDrawProps) => {
  const isVisible = useIsHorizontalDrawVisible(isOpenInitially, keyCode);
  return (
    <StyledHorizontalDraw
      $isVisible={isVisible}
      $drawerVerticalPosition={verticalPosition}
    >
      {children}
    </StyledHorizontalDraw>
  );
};

const useIsHorizontalDrawVisible = (
  isOpenInitially: boolean,
  toolbarKeyCode: string
) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpenInitially);
  const onTabPress = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, [setIsVisible]);
  useKeyListener(toolbarKeyCode, onTabPress);
  return isVisible;
};
