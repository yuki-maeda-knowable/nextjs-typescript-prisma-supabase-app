import React from "react";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";
import useComments from "../hooks/useComments";
import moment from "moment";
import { useRouter } from "next/router";

const Comments = ({ postId }) => {
  const router = useRouter();
  //ログインしている人しかコメントできないようにする
  const { data: user } = useCurrentUser();
  //コメントを取得
  const { data: comments, mutate: mutateComment } = useComments(postId);

  const handleCommentDelete = async (commentId) => {
    await fetch(`/api/comment/${commentId}`, {
      method: "DELETE",
    });
    router.push(`/p/${postId}`);
    mutateComment();
  };

  return (
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6">Comments</Typography>
      {user && (
        <Link href={`/comments/${postId}/commentAdd`}>
          <Button variant="text">コメントする</Button>
        </Link>
      )}
      <Box>
        {!comments?.length && (
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            コメントはありません
          </Typography>
        )}

        {comments?.map((comment) => (
          <Box
            key={comment.id}
            sx={{ mt: 2, bgcolor: "#808080", p: 2, borderRadius: 2 }}
          >
            <Stack direction={"row"}>
              <Avatar src={comment.User.image} />
              <Typography variant="body2" sx={{ m: 1 }}>
                {comment.User.name}
                {moment(comment.createdAt).format(" YYYY/MM/DD HH:mm")}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 3, mb: 2 }}>
              {comment.content}
            </Typography>{" "}
            {comment.User.id === user.id && (
              <Link href={`/comments/${postId}/edit/${comment.id}`}>
                <Button>編集</Button>
              </Link>
            )}
            {comment.User.id === user.id && (
              <Button onClick={() => handleCommentDelete(comment.id)}>
                削除
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default Comments;
