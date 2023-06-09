import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "../Layout";
import { Container, Typography, Stack, TextField, Button } from "@mui/material";
import { PostProps } from "../../types/interface";

export default function PostForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostProps>({
    defaultValues: {
      content: "",
    },
  });

  const submitPostRegister = async (input: PostProps) => {
    const { content } = input;
    const postData = {
      content: content,
    };

    try {
      const res = await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(postData),
      });
      await res.json();
      router.push("/");
    } catch (error) {
      console.error("Error registration Post: ", error);
    }
  };

  return (
    <Layout>
      <Container sx={{ border: "solid 1 white" }}>
        <Typography
          variant="h6"
          color="gray"
          sx={{ textAlign: "center", m: 2 }}
        >
          New Post
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(submitPostRegister)}
          alignItems="center"
        >
          <TextField
            sx={{ width: 300, marginBottom: 2 }}
            {...register("content", { required: "入力必須" })}
            label="content"
            type="text"
            variant="standard"
            placeholder="content"
            multiline
            rows={3}
          />
          {errors.content && (
            <span style={{ color: "red" }}>{errors.content?.message}</span>
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
            send
          </Button>
        </Stack>
      </Container>
    </Layout>
  );
}
