import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Share } from "@mui/icons-material";
import FavoriteButton from "../../components/FavoriteButton";
import useCurrentUser from "../../hooks/useCurrentUser";
import { getSession } from "next-auth/react";
import useUser from "../../hooks/useUser";
import Comments from "../../components/Comments";

export const getServerSideProps: GetServerSideProps = async (context) => {
  //ログインしていなかったらリダイレクト
  const user = await getSession(context);
  if (!user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: String(context?.params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (post) => {
  const { data: user } = useCurrentUser();
  const { data: author } = useUser(post.authorId);

  return (
    <Layout>
      <Box sx={{ margin: 2, width: "100%", height: "100%" }}>
        <Button href={"/"}>一覧へ戻る</Button>
        <Card key={post.id} sx={{ margin: 3 }}>
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: "red" }}
                aria-label="recipe"
                src={author?.image}
              />
            }
            title={post.title}
          />
          {post?.author?.name || "Unknown author"}
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              whiteSpace={"pre-line"}
            >
              {post.content}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <FavoriteButton postId={post.id} />
            <IconButton aria-label="share">
              <Share />
            </IconButton>
            {post.authorId === user?.id && (
              <Button href={`/p/edit/${post.id}`}>編集</Button>
            )}
          </CardActions>
        </Card>
        <Comments postId={post.id} />
      </Box>
    </Layout>
  );
};

export default Post;
