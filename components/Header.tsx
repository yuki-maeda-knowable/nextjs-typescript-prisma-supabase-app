import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import useCurrentUser from "../hooks/useCurrentUser";

const Header: React.FC = () => {
  const { data: currentUser } = useCurrentUser();

  const Search = styled(Box)({
    backgroundColor: "background.default",
    padding: "0 10px",
    borderRadius: 10,
    width: "30%",
  });

  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
  });

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", sm: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          {currentUser && (
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction={"row"} justifyContent="flex-end">
                <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
              </Stack>
            </Box>
          )}
          {currentUser && (
            <Box>
              <Tooltip title="User Settings">
                <IconButton sx={{ p: 0 }}>
                  <Link href={`/users/${currentUser?.id}`}>
                    <Avatar alt="User Icon" src={currentUser?.image} />
                  </Link>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
