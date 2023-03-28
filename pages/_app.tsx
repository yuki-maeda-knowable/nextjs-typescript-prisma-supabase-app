import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { ThemeProvider } from "@mui/material";
import theme from "../theme";
const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App;
