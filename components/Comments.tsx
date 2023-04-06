import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";

const Comments = () => {
  //ログインしている人しかコメントできないようにする
  const { data: user } = useCurrentUser();

  //コメントを投稿した人のみ編集、削除できるようにする

  //コメントを投稿した人のみいいねできるようにする

  const comments = [];
  return (
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6">Comments</Typography>
      {user && (
        <Link href={`/comments/commentAdd`}>
          <Button variant="text">コメントする</Button>
        </Link>
      )}
      <Box>
        {!comments?.length && (
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            コメントはありません
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default Comments;
