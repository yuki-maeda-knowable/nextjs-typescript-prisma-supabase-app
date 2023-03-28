import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";
import Layout from "../Layout";
import {
  Container,
  Stack,
  Typography,
  TextField,
  Avatar,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";

// ユーザのデフォルト画像
const defaultImg = process.env.NEXT_PUBLIC_DEFAULT_IMG;
interface UserInput {
  name: string;
  email: string;
  password: string;
  image?: string | StaticImageData;
}

type uploadImageUrl = string;

export default function UserForm() {
  const [uploadImageUrl, setUploadImageUrl] = useState<uploadImageUrl>();
  const [uploadImageFile, setUploadImageFile] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: defaultImg,
    },
  });

  // const inputRef = useRef<HTMLInputElement>();
  // 画像が選択されたら、プレビュー
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setUploadImageUrl(URL.createObjectURL(files[0]));
    setUploadImageFile(files[0]);
  };

  const submitUserRegister = async (input: UserInput) => {
    //画像があるか判断
    if (uploadImageFile) {
      const randomString = crypto.randomBytes(10).toString("hex");

      // あれば、supabaseに画像をアップロード
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(
          "user/" + randomString + "-" + uploadImageFile.name,
          uploadImageFile
        );

      //supabaseから画像のURLをDL
      const url = await supabase.storage.from("photos").getPublicUrl(data.path);

      const { publicUrl } = url.data;

      // DLしたURLをimageに格納
      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: publicUrl,
      };

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // json形式で返す
        console.log(res);

        const data = await res.json();
        const email = data.email;
        //登録済みのデータを使用するとhash化したpasswordを利用してしまうため、formに入力されたpasswordを使用
        const password = formData.password;
        //sign In()でそのままログイン

        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
          redirect: true,
        });
      } catch (error) {
        console.error("Error registering user:", error);
      }
    } else {
      // なければ、デフォルトの画像を登録
      //supabaseから画像のURLをDL
      const publicUrl = defaultImg;

      // DLしたURLをimageに格納
      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: publicUrl,
      };

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // json形式で返す
        const data = await res.json();
        const email = data.email;
        //登録済みのデータを使用するとhash化したpasswordを利用してしまうため、formに入力されたpasswordを使用
        const password = formData.password;
        //sign In()でそのままログイン

        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
          redirect: false,
        });
      } catch (error) {
        console.error("Error registering user:", error);
      }
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
          ユーザー登録
        </Typography>

        <Stack
          component="form"
          onSubmit={handleSubmit(submitUserRegister)}
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
          <Box>
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
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
}
