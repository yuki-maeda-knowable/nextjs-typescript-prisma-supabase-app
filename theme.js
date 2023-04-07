import { lime, orange } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: orange,
    secondary: lime,
    text: {
      primary: "#FFFFFF",
    },
  },
});

export default theme;
