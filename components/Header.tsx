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
import PostSearchForm from "./post/postSearchForm";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

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

          <Search sx={{ display: { xs: "none", sm: "flex" } }}>
            <PostSearchForm />
          </Search>

          <Button>
            <Link href={`/profile/1`}>profile</Link>
          </Button>
          {!session && (
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction={"row"} justifyContent="flex-end">
                <MenuItem onClick={() => signIn()}>Log In</MenuItem>
                <MenuItem>
                  <Link href={`/users/create`}>Sign Up</Link>
                </MenuItem>
              </Stack>
            </Box>
          )}
          {session && (
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction={"row"} justifyContent="flex-end">
                <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
              </Stack>
            </Box>
          )}
          {session && (
            <Box>
              <Tooltip title="User Settings">
                <IconButton sx={{ p: 0 }}>
                  <Link href={`/users/${session?.user?.id}`}>
                    <Avatar alt="User Icon" src={session?.user?.image} />
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
