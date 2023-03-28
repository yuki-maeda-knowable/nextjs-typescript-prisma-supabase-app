import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Layout from "../Layout";
import {
  Container,
  Typography,
  Stack,
  Avatar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";

interface UserInput {
  email: String;
  password: String;
}

export default function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitUserSignIn = async (input: UserInput) => {
    const formData = {
      email: input.email,
      password: input.password,
    };
    try {
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/p/drafts",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signin :", error);
    }
  };

  return (
    <Layout>
      <Container>
        <Typography
          variant="h6"
          color="gray"
          sx={{ textAlign: "center", m: 2 }}
        >
          Log In
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(submitUserSignIn)}
          alignItems="center"
        >
          <TextField
            sx={{ width: 300, marginBottom: 2 }}
            {...register("email", { required: "入力必須" })}
            label="email"
            type="email"
            variant="standard"
            placeholder="example@example.jp"
          />
          {errors.email && (
            <span style={{ color: "red" }}>{errors.email?.message}</span>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 2 }}
            {...register("password", {
              required: "入力必須",
              minLength: {
                value: 8,
                message: "8文字以上入力してください",
              },
            })}
            id="standard-search"
            label="password"
            type="password"
            variant="standard"
            placeholder="password"
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password?.message}</span>
          )}
          <Button
            variant="contained"
            sx={{
              color: "whitesmoke",
              bgcolor: "background.default",
              ":hover": { bgcolor: "gray" },
              m: 2,
            }}
            type="submit"
          >
            Log in
          </Button>
        </Stack>
      </Container>
    </Layout>
  );
}
