import {
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  SelectChangeEvent,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";
import { AddAPhoto, HighlightOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useEffect } from "react";
export type Profile = {
  nickname?: string;
  photo?: [];
  gender?: number;
  birthday?: Date;
};

const ProfileForm = ({ profile }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({});

  const router = useRouter();
  const { data: session } = useSession();
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nickname, setNickname] = useState("");
  const maxImagesUpload = 4;
  const [profileImage, setProfileImage] = useState([]);
  const [createObjectURL, setCreateObjectURL] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [variant, setVariant] = useState("register");
  const userId = session?.user?.id;

  // //プロフィールのデータが既にあったら読み込んでおく
  useEffect(() => {
    //プロフィールのデータが既にあったら読み込んでおく
    if (profile) {
      setVariant("update");
      setProfileImage(profile.Photo);
      setCreateObjectURL(profile.Photo);
      setBirthday(profile.birthday);
      setNickname(profile.nickname);
      profile?.Photo?.map((url) => {
        photoUrls.push(url.url);
      });
    }
  }, [profile]);

  const handleChangeNickname = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNickname(e.target.value);
  };

  const handleChangeBirthday = (e: SelectChangeEvent) => {
    setBirthday(e.target.value);
    console.log(birthday);
  };

  const handleChangeGender = (e: SelectChangeEvent) => {
    setGender(e.target.value);
    console.log(gender);
  };

  // 画像がアップロードされたら、URLとファイルの中身をset
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const list = [...profileImage];
      list.push(file);

      setProfileImage(list);
      const urlList = [...createObjectURL];
      urlList.push({ url: URL.createObjectURL(file) });

      setCreateObjectURL(urlList);
    }
  };

  // 画像削除
  const deleteImg = (index: number) => {
    const newImage = [...profileImage];
    const newImageUrl = [...createObjectURL];
    newImage.splice(index, 1);
    setProfileImage(newImage);
    newImageUrl.splice(index, 1);
    setCreateObjectURL(newImageUrl);
  };

  const deleteProfileImg = async (photoId: string, index: number) => {
    alert(photoId);
    const res = await fetch(`/api/photo/${photoId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    const newImage = [...profileImage];
    const newImageUrl = [...createObjectURL];
    newImage.splice(index, 1);
    setProfileImage(newImage);
    newImageUrl.splice(index, 1);
    setCreateObjectURL(newImageUrl);
  };

  // 送信ボタンが押されたら
  const registerProfile = async (profile: Profile) => {
    alert("register");
    //画像があるか判断。あればランダム文字列生成
    if (profileImage?.length != 0) {
      const urls = await Promise.all(
        profileImage?.map(async (img, index) => {
          // mapでループさせる？_
          //既に登録ずみprofileのurlが存在するか確認し、存在しなければアップロード
          if (!img.url) {
            //ランダムな文字列を生成
            const randomString = crypto.randomBytes(10).toString("hex");
            //supabaseに画像をアップロード
            const { data, error } = await supabase.storage
              .from("photos")
              .upload("user/profile/" + randomString + "-" + img.name, img);
            //supabaseから画像のURLをDL
            const url = await supabase.storage
              .from("photos")
              .getPublicUrl(data.path);
            photoUrls.push(url.data.publicUrl);
          }
        })
      );
    }
    const { nickname, gender, birthday } = profile;
    alert(birthday);
    const formData = {
      nickname: nickname,
      birthday: birthday,
      gender: gender,
      userId: userId,
      url: photoUrls,
    };
    //なければinsert
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/");
  };

  // TODO: 画像の更新処理(未実装).nicknameは更新できる
  const updateProfile = async (profile: Profile) => {
    const { nickname } = profile;
    const formData = {
      nickname: nickname,
      userId: userId,
      url: photoUrls,
    };
    const res = await fetch(`/api/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    router.push(`/profile/${userId}`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h6" color="whitesmoke">
        {variant === "register" ? "profile作成" : "profile編集"}
      </Typography>
      <Stack
        component="form"
        onSubmit={handleSubmit(
          variant === "register" ? registerProfile : updateProfile
        )}
        direction="row"
        justifyContent={"center"}
      >
        <Box>
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {createObjectURL?.map((item, i) => (
              <ImageListItem key={i}>
                <img src={item.url} loading="lazy" />
                <IconButton
                  color="default"
                  aria-label="upload picture"
                  component="label"
                  onClick={() =>
                    variant === "register"
                      ? deleteImg(i)
                      : deleteProfileImg(item.id, i)
                  }
                >
                  <HighlightOff />
                </IconButton>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        <Stack direction={"row"}>
          <IconButton
            color="default"
            aria-label="upload picture"
            component="label"
            disabled={profileImage?.length >= maxImagesUpload}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={onChangeFile}
              multiple
            />
            <AddAPhoto />
          </IconButton>
        </Stack>
        <Box>
          <TextField
            sx={{ width: 300, marginBottom: 5, display: "flex" }}
            {...register("nickname", { required: "入力必須" })}
            label="nickname"
            type="text"
            variant="standard"
            placeholder="nickname"
            value={nickname}
            onChange={handleChangeNickname}
          />
          {errors.nickname && (
            <span style={{ color: "red" }}>{errors.nickname?.message}</span>
          )}
          {variant === "register" && (
            <TextField
              sx={{ width: 300, marginBottom: 5, display: "flex" }}
              id="date"
              label="Birthday"
              type="date"
              defaultValue="2017-05-24"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeBirthday}
              {...register("birthday")}
            />
          )}
          {variant === "register" && (
            <FormControl sx={{ width: 100, marginBottom: 2, display: "flex" }}>
              <InputLabel>gender</InputLabel>
              <Select
                {...register("gender", { required: true })}
                onChange={handleChangeGender}
                value={gender}
              >
                <MenuItem value={1}>おとこ</MenuItem>
                <MenuItem value={2}>おんな</MenuItem>
                <MenuItem value={3}>その他</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            sx={{
              color: "whitesmoke",
              ":hover": { bgcolor: "secondary" },
              m: 2,
            }}
            type="submit"
          >
            {variant === "update" ? "update" : "register"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};
export default ProfileForm;
