import React from "react";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";
import useComments from "../hooks/useComments";

const Comments = ({ postId }) => {
  //ログインしている人しかコメントできないようにする
  const { data: user } = useCurrentUser();
  //コメントを取得
  const { data: comments } = useComments(postId);
  //コメントを投稿した人のみ編集、削除できるようにする

  //コメントを投稿した人のみいいねできるようにする

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
          <Box key={comment.id} sx={{ mt: 2, bgcolor: "#808080", p: 2 }}>
            <Stack direction={"row"}>
              <Avatar src={comment.User.image} />
              <Typography variant="body2" sx={{ m: 1 }}>
                {comment.User.name}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 3, mb: 2 }}>
              {comment.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default Comments;
