import React, { ReactNode } from "react";
import Header from "./Header";
import { Container, Box } from "@mui/material";
type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <Container
    color={"text.primary"}
    sx={{ bgcolor: "background.default", height: "100%", padding: 3 }}
  >
    <Header />
    {props.children}
  </Container>
);

export default Layout;
