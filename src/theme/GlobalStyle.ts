import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gradients.dark};

  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.mono.background};

  }

  body {
    margin: 0;
  }
  
 h1 { font-family :  var(--font-hjd);}
 h2 { font-family :  var(--font-hjd);}
 
 @media only screen and (max-width: ${({ theme }) =>
   theme.breakpoints.tablet}px) {
    ::-webkit-scrollbar {
    width: 2px;
  }
      }
`;
