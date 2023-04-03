import { NextPage } from "next";
import UserInputForm from "../../components/auth/userInputForm";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const Signin: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //loginか登録かの判断
  const [variant, setVariant] = useState("login");
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  // ログイン
  const login = useCallback(async () => {
    try {
      signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  // ユーザ登録
  const signin = useCallback(async () => {
    //apiで/user/indexにpostする
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      login();
    } catch (error) {
      console.error(error);
    }
  }, [name, email, password, login]);

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Box
          sx={{ display: "flex", border: "1px solid black" }}
          justifyContent={"center"}
          flexDirection={"column"}
          width={500}
        >
          <Stack
            component="form"
            onSubmit={handleSubmit(variant === "register" ? signin : login)}
            alignItems="center"
          >
            <Typography sx={{ marginTop: "10px" }}>
              {variant === "login" ? "ログイン" : "ユーザ登録"}
            </Typography>
            {variant === "register" && (
              <UserInputForm
                id="name"
                label="name"
                type="text"
                onChange={(e: any) => {
                  setName(e.target.value);
                }}
                value={name}
                placeholder="name"
              />
            )}
            <UserInputForm
              id="email"
              label="email"
              type="email"
              onChange={(e: any) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="example@example.com"
            />
            <UserInputForm
              id="password"
              label="password"
              type="password"
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              justifyContent={"space-between"}
              width={300}
              marginBottom={"20px"}
            >
              <Button
                variant="contained"
                sx={{ ":hover": { opacity: "0.8" } }}
                type="submit"
              >
                {variant === "register" ? "register" : "Login"}
              </Button>
              <Button
                onClick={toggleVariant}
                variant="text"
                sx={{ ":hover": { opacity: "0.8" } }}
              >
                {variant === "register" ? "ログインはこっち" : "登録はこっち"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
};

export default Signin;
