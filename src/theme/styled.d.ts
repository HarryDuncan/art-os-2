import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    spacing: (multiple?: number) => number;
    colors: {
      mono: {
        background: string;
        lightText: "#fffcfc";
        darkText: "#030303";
        lightGray: "#949292";
      };

      brand: {
        brand01: "#0081a1";
        brand02: "#59cbe8";
      };
      gradients: {
        light: `linear-gradient(
                0deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(205, 205, 205, 1) 10%,
                rgba(133, 133, 133, 1) 14%,
                rgba(219, 219, 219, 1) 50%,
                rgba(255, 255, 255, 1) 100%
              );`;
        dark: `linear-gradient(180deg, rgba(15,15,15,1) 0%, rgba(33,33,33,1) 100%);`;
      };
    };
    font: {
      size: {
        xSmall: "1rem";
        small: "1.5rem";
        mediumSmall: "2rem";
        medium: "3rem";
        mediumLarge: "4rem";
        large: "5rem";
        xLarge: "7rem";
      };
      weight: {
        none: 0;
        light: 200;
        normal: 400;
        bold: 700;
      };
      default: {
        family: "var(--font-default)";
      };
      alternative: {
        family: "var(--font-hjd)";
      };
    };
    breakpoints: {
      wideScreen: 1500;
      desktop: 1280;
      laptop: 1080;
      tablet: 850;
      mobile: 600;
      smallMobile: 350;
    };
  }
}
