import {
  Avatar,
  Box,
  Button,
  Fab,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import usePost from "../../hooks/usePost";
import { useCallback } from "react";
import TagInput from "../../components/TagInput";
import useCurrentUser from "../../hooks/useCurrentUser";
import useTags from "../../hooks/useTags";

interface PostInput {
  title: string;
  content: string;
  published: boolean;
}

type Tags = {
  id?: number;
  name: string;
};

const StyleModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

export default function PostAdd() {
  const { data: session } = useSession();
  const { data: user } = useCurrentUser();
  const userImg = user?.image;

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ---- tag search start ------------
  const [tags, setTags] = useState<Tags[]>([]);

  const { data: tagsData, mutate: mutateTags } = useTags();
  const [suggestions, setSuggestions] = useState(tagsData);

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((_, i) => i !== tagIndex));
    },
    [tags]
  );

  const onAddition = useCallback(
    (newTag) => {
      // const modifiedTag = { ...newTag, name: `#${newTag.name}` };
      // setTags([...tags, modifiedTag]);
      setTags([...tags, newTag]);
    },
    [tags]
  );

  // ---- tag search end ------------

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostInput>({
    defaultValues: {
      title: "",
      content: "",
      published: true,
    },
  });

  // postsの一覧を取得しておく
  const { data: posts, mutate: mutatePosts } = usePost();

  const submitPostRegister = async (input: PostInput) => {
    const { title, content, published } = input;

    const postData = {
      title: title,
      content: content,
      published: published,
      tags: tags,
    };

    try {
      const res = await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      //postが追加されたら、キャッシュを更新する
      mutatePosts([...posts, data]);
      mutateTags([...tagsData, data.tags]);
      handleClose(); // モーダルを閉じる
      reset(); // フォームをリセットする
      setTags([]); // タグをリセットする
    } catch (error) {
      console.error("Error registration Post: ", error);
    }
  };

  return (
    <>
      <Tooltip
        onClick={handleOpen}
        title="Add"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
          color: "text.primary",
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <StyleModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(submitPostRegister)}
          width={500}
          height={"60%"}
          bgcolor={"background.default"}
          borderRadius={5}
          p={2}
          color={"text.primary"}
          sx={{ border: "solid 1px white" }}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Create Post
          </Typography>
          <UserBox>
            <Avatar sx={{ width: 30, height: 30 }} src={userImg} />
            <Typography variant="body1" fontWeight={500}>
              {session?.user?.name}
            </Typography>
          </UserBox>
          <TagInput
            tags={tags}
            suggestions={suggestions}
            onDelete={onDelete}
            onAddition={onAddition}
          />
          <TextField
            sx={{ width: 450, mt: 2, mb: 2 }}
            {...register("title", { required: "入力必須" })}
            label="title"
            type="text"
            variant="standard"
            placeholder="title"
          />
          {errors.title && (
            <span style={{ color: "red" }}>{errors.title?.message}</span>
          )}

          <TextField
            sx={{ width: 450, mt: 2, mb: 2 }}
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
          <Box>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              sx={{ mt: 4, width: "100%" }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </StyleModal>
    </>
  );
}
