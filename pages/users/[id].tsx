import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { UserProps } from "../../components/user/User";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";
import UserInputForm from "../../components/auth/userInputForm";
import {
  Container,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { useSession, getSession } from "next-auth/react";

interface UserInput {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
}
type uploadImageUrl = string;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const data = await prisma.user.findUnique({
    where: {
      id: String(session?.user?.id),
    },
  });
  const user = await JSON.parse(JSON.stringify(data));
  return {
    props: user,
  };
};

const User = (user: UserProps, { UserInput }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  //画像URL
  const [uploadImageUrl, setUploadImageUrl] = useState<uploadImageUrl>(
    user.image
  );

  // supabaseにアップロードする画像ファイル
  const [uploadImageFile, setUploadImageFile] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({});

  const router = useRouter();
  const { id } = router.query;

  // 画像が選択されたら、プレビュー
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setUploadImageUrl(URL.createObjectURL(files[0]));
    setUploadImageFile(files[0]);
  };

  // 送信ボタンが押されたら

  const submitUserUpdate = useCallback(async () => {
    //ユーザの画像がデフォルトかつuploadImageUrlもデフォルトのままだったら、画像は更新しない
    if (!uploadImageUrl) {
      const formData = {
        name: name,
        email: email,
        password: password,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      await res.json();
      router.push(`/`);
    } else {
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
      await res.json();
      router.push(`/`);
    }
  }, [name, email, password, uploadImageUrl, uploadImageFile]);

  return (
    <Layout>
      <Container>
        <Typography
          variant="h6"
          color="gray"
          sx={{ textAlign: "center", m: 2 }}
        >
          ユーザ情報
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(submitUserUpdate)}
          alignItems="center"
        >
          <Stack direction={"row"}>
            <Avatar
              sx={{ width: 80, height: 80, marginBottom: 5 }}
              src={uploadImageUrl}
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
          <UserInputForm
            id="name"
            label="name"
            type="text"
            placeholder="name"
            onChange={(e: any) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <UserInputForm
            id="email"
            label="email"
            type="email"
            placeholder="example@example.com"
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
          <UserInputForm
            id="password"
            label="password"
            type="password"
            placeholder="password"
            onChange={(e: any) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
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
