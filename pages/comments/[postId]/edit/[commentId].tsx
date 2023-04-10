import Layout from "../../../../components/Layout";
import { Typography, Box, Button } from "@mui/material";
import { getSession } from "next-auth/react";
import getCommentDetail from "../../../../lib/getCommentDetail";
import UserInputForm from "../../../../components/auth/userInputForm";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface commentEditProps {
  userId: string;
  postId: string;
  commentId: string;
}
export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { postId, commentId } = context.params;
  const comment = await getCommentDetail(commentId);

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
      comment,
      userId,
      commentId,
      postId,
    },
  };
};

const CommentEdit = ({ comment, commentId, postId }) => {
  const router = useRouter();
  //入力された値をstateに保存
  const [content, setContent] = useState("");
  //画面がレンダリングされたときに実行
  useEffect(() => {
    if (comment) {
      setContent(comment[0].content);
    }
  }, [comment]);

  const submitCommentEdit = async () => {
    const res = await fetch(`/api/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, commentId }),
    });
    router.push(`/p/${postId}`);
  };

  return (
    <Layout>
      <Box color={"text.primary"}>
        <Typography variant="h5">コメント編集ページ</Typography>
        <Link href={`/p/${postId}/`}>戻る</Link>

        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          height={"100vh"}
          width={"600px"}
          margin={"0 auto"}
        >
          <Box display={"flex"} flexDirection={"column"} m={5}>
            <UserInputForm
              id="content"
              label="content"
              type="text"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              rows={3}
            />
            <Button onClick={submitCommentEdit}>送信</Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default CommentEdit;
