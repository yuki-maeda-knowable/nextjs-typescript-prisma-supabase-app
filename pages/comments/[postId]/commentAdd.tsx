import React, { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import Layout from "../../../components/Layout";
import UserInputForm from "../../../components/auth/userInputForm";
import { useCallback } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

// serverSidePropsでpostIdを取得
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const { postId } = context.params;
  const userId = session?.user?.id;
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      userId,
      postId,
    },
  };
};

const CommentAdd = ({ userId, postId }: { userId: string; postId: string }) => {
  const router = useRouter();
  //commentの状態を管理
  const [comment, setComment] = useState("");

  // コメントを投稿する
  const handleCommentAdd = useCallback(
    async (e) => {
      //apiで/post/indexにpostする
      e.preventDefault();
      try {
        const res = await fetch("/api/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment, postId, userId }),
        });
        await res.json();
        router.push(`/p/${postId}`);
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
    [comment]
  );

  return (
    <Layout>
      <Box sx={{ color: "text.primary" }}>
        <Typography variant="h5">コメント投稿ページ</Typography>
        <Box
          sx={{
            display: "flex",
            border: "1px solid black",
            width: "50%",
            mt: 6,
          }}
          justifyContent={"center"}
          flexDirection={"column"}
          width={500}
        >
          <Link href={`/p/${postId}`}>戻る</Link>
          <Stack
            component="form"
            onSubmit={handleCommentAdd}
            alignItems="center"
          >
            <UserInputForm
              id="comment"
              label="comment"
              type="text"
              onChange={(e: any) => {
                setComment(e.target.value);
              }}
              rows={3}
              value={comment}
              placeholder="comment"
            />
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              justifyContent={"space-between"}
              width={300}
              marginBottom={"20px"}
            >
              <Button
                variant="contained"
                sx={{
                  ":hover": { opacity: "0.8" },
                  color: "#808080",
                  backgroundColor: "#808080",
                  bgcolor: "white",
                }}
                type="submit"
              >
                コメントを投稿する
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
};

export default CommentAdd;
