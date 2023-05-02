import { NextPage } from "next";
import UserInputForm from "../../components/auth/userInputForm";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { signIn } from "next-auth/react";
import { ChangeEvent } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

type userRegisterErrorProps = {
  email?: string;
  password?: string;
};

const Signin: NextPage = () => {
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

  // errorの表示
  const [error, setError] = useState<userRegisterErrorProps>({});

  // ログイン
  const login = useCallback(async () => {
    try {
      const result = await signIn("credentials", {
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
  }, [name, email, password, login, error]);

  const handleSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      // passwordのバリデーション。8文字以上でなければエラーを返す
      if (password.length < 8) {
        setError({
          ...error,
          password: "パスワードは8文字以上で入力してください",
        });
        return;
      }

      if (variant === "login") {
        // DBに登録されているemailとpasswordが一致しているか確認
        const res = await fetch("/api/user/userValidation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (res.status === 400) {
          const errorMessage = await res.json();
          setError({ ...error, email: errorMessage.notFoundEmail });
          return;
        }

        // 401エラーの場合は、パスワードが一致していない
        if (res.status === 401) {
          const errorMessage = await res.json();
          setError({ ...error, password: errorMessage.inValidPassword });
          return;
        }

        login();
      } else {
        signin();
      }
    },
    [variant, login, signin, error]
  );
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          color: "text.primary",
        }}
      >
        <Box
          sx={{ display: "flex", border: "1px solid black" }}
          justifyContent={"center"}
          flexDirection={"column"}
          width={500}
        >
          <Stack
            component="form"
            onSubmit={handleSubmit}
            // onSubmit={handleSubmit(variant === "register" ? signin : login)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="example@example.com"
            />
            {error.email && <Alert severity="error">{error.email}</Alert>}
            <UserInputForm
              id="password"
              label="password"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            {error.password && <Alert severity="error">{error.password}</Alert>}{" "}
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              justifyContent={"space-between"}
              width={300}
              marginBottom={"20px"}
            >
              <Button
                variant="contained"
                sx={{ ":hover": { opacity: "0.8" }, color: "text.primary" }}
                type="submit"
              >
                {variant === "register" ? "register" : "Login"}
              </Button>
              <Button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                variant="text"
              >
                <GoogleIcon />
              </Button>
              <Button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                variant="text"
              >
                <GitHubIcon />
              </Button>
            </Box>
            <Button
              onClick={toggleVariant}
              variant="text"
              sx={{ ":hover": { opacity: "0.8" } }}
            >
              {variant === "register" ? "ログインはこっち" : "登録はこっち"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
};

export default Signin;
