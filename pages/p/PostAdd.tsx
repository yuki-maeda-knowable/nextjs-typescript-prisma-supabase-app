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
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface PostInput {
  title: string;
  content: string;
  published: boolean;
}
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

// export const getServerSideProps: GetServerSideProps = async (context) => {

// };
export default function PostAdd() {
  const { data: session } = useSession();
  const router = useRouter();
  const userImg = session?.user?.image;

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>({
    defaultValues: {
      title: "",
      content: "",
      published: false,
    },
  });

  const submitPostRegister = async (input: PostInput) => {
    const { title, content, published } = input;
    const postData = {
      title: title,
      content: content,
      published: published,
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
      router.push("/p/drafts");
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
          width={400}
          height={350}
          bgcolor={"background.default"}
          borderRadius={5}
          p={2}
          color={"text.primary"}
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
          <TextField
            sx={{ width: 300, marginBottom: 2 }}
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
          <Box>
            <Button variant="outlined" color="primary" type="submit">
              Post
            </Button>
          </Box>
        </Box>
      </StyleModal>
    </>
  );
}
