import Layout from "../../../../components/Layout";
import { Typography, Box, Button } from "@mui/material";
import { getSession } from "next-auth/react";
import getCommentDetail from "../../../../lib/getCommentDetail";
import UserInputForm from "../../../../components/auth/userInputForm";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CommentEditProps } from "../../../../types/interface";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

type Params = {
  commentId: string;
};
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<Params>
) => {
  const session = await getSession(context);
  const { commentId } = context.params;

  const comment: CommentEditProps = await getCommentDetail(commentId);

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
    },
  };
};

const CommentEdit = ({ comment }: { comment: CommentEditProps }) => {
  const { content, postId, id } = comment[0];

  const router = useRouter();
  //入力された値をstateに保存
  const [editComment, setEditComment] = useState("");
  //画面がレンダリングされたときに実行
  useEffect(() => {
    setEditComment(content);
  }, []);

  const submitCommentEdit = async () => {
    await fetch(`/api/comment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ editComment, id }),
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
              onChange={(e) => setEditComment(e.target.value)}
              value={editComment}
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
