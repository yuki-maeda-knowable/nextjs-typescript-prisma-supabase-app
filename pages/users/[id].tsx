import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { UserProps } from "../../components/user/User";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";
import {
  Container,
  Typography,
  Stack,
  Avatar,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { useSession } from "next-auth/react";

interface UserInput {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
}
type uploadImageUrl = string;
const defaultImg = process.env.NEXT_PUBLIC_DEFAULT_IMG;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const data = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
  });
  const user = await JSON.parse(JSON.stringify(data));
  return {
    props: user,
  };
};

const User = (user: UserProps) => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      image: user.image,
    },
  });
  const router = useRouter();
  const { id } = router.query;
  //画像URL
  const [uploadImageUrl, setUploadImageUrl] = useState<uploadImageUrl>();

  // supabaseにアップロードする画像ファイル
  const [uploadImageFile, setUploadImageFile] = useState<File>();

  // 画像が選択されたら、プレビュー
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setUploadImageUrl(URL.createObjectURL(files[0]));
    setUploadImageFile(files[0]);
  };

  // 送信ボタンが押されたら
  const submitUserUpdate = async (input: UserInput) => {
    //ユーザの画像がデフォルトかつuploadImageUrlもデフォルトのままだったら、画像は更新しない
    if (user.image === defaultImg && !uploadImageUrl) {
      const { name, email, password } = input;

      const formData = {
        name: name,
        email: email,
        password: password,
        image: defaultImg,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const user = await res.json();
      console.log(user);

      router.push(`/users/${id}`);
    } // uploadImageUrlがデフォルト画像じゃなかったら更新
    else if (uploadImageUrl) {
      const randomString = crypto.randomBytes(10).toString("hex");

      // あれば、supabaseに画像をアップロード
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(
          "user/" + randomString + "-" + uploadImageFile.name,
          uploadImageFile
        );

      //supabaseから画像のURLをDL data.pathに画像のパスが入ってる
      const url = await supabase.storage.from("photos").getPublicUrl(data.path);

      const { publicUrl } = url.data;

      const { name, email, password } = input;

      const formData = {
        name: name,
        email: email,
        password: password,
        image: publicUrl,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const user = await res.json();
      console.log(user);

      router.push(`/users/${id}`);
    }
  };

  if (!session) {
    return (
      <Layout>
        <Typography variant="h6" color={"whitesmoke"}>
          ログインして
        </Typography>
      </Layout>
    );
  }
  return (
    <Layout>
      <Container>
        <Typography
          variant="h6"
          color="gray"
          sx={{ textAlign: "center", m: 2 }}
        >
          profile
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(submitUserUpdate)}
          alignItems="center"
        >
          <Stack direction={"row"}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              src={uploadImageUrl ? uploadImageUrl : ""}
            ></Avatar>
            <IconButton
              color="default"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={onChangeFile}
              />
              <AddAPhoto />
            </IconButton>
          </Stack>
          <TextField
            sx={{ width: 300, marginBottom: 2 }}
            {...register("name", { required: "入力必須" })}
            label="name"
            type="text"
            variant="standard"
            placeholder="name"
          />
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name?.message}</span>
          )}
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
          <Box>
            <Button
              variant="contained"
              sx={{
                color: "whitesmoke",
                bgcolor: "background.default",
                ":hover": { bgcolor: "gray" },
                m: 2,
              }}
            >
              <Link href={`/`}>Home</Link>
            </Button>
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
              update
            </Button>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default User;
