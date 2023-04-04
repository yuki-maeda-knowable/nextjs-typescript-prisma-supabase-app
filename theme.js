import { lime, orange } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: orange,
    secondary: lime,
    text: {
      primary: "#FFFFFF",
      // その他のテキスト色の設定
    },
  },
});

export default theme;
