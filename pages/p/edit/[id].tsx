import { Box, Stack, Button } from "@mui/material";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import usePostDetail from "../../../hooks/usePostDetail";
import UserInputForm from "../../../components/auth/userInputForm";
import { useState, useEffect } from "react";

const PostEdit = () => {
  //ルーターからidを取得
  const router = useRouter();
  const { id } = router.query;

  // //post詳細を取得
  const { data: post } = usePostDetail(id as string);

  //入力された値をstateに保存
  const [content, setContent] = useState("");

  //画面がレンダリングされたときに実行
  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  //postを更新する
  const handlePostEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/${id}/postEdit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      router.push(`/p/${id}`);
    } catch (error) {
      console.error(error);
      throw new Error("postの更新に失敗しました");
    }
  };

  return (
    <Layout>
      <Button href={`/p/${id}`}>戻る</Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
          color: "text.primary",
          height: "100vh",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{ display: "flex", border: "1px solid black", pt: 5, pb: 5 }}
          justifyContent={"center"}
          width={500}
        >
          <Stack component="form" onSubmit={handlePostEdit}>
            <UserInputForm
              id="content"
              label="content"
              value={content}
              type="text"
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <Button type="submit" variant="outlined">
              update
            </Button>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
};

export default PostEdit;
