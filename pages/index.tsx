import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { getSession } from "next-auth/react";
import PostAdd from "./p/PostAdd";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { Share } from "@mui/icons-material";
import getProfile from "../lib/getProfile";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";
import FavoriteButton from "../components/FavoriteButton";
import usePost from "../hooks/usePost";
import { Button } from "@mui/material";

type Props = {
  feed: PostProps[];
  keyword: string;
  profile: any;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const profile = await getProfile(session?.user?.id);

  const { keyword } = context.query;
  if (keyword) {
    // 検索ワードが配列になっちゃうから、一旦文字列に変換
    const keywordString: string = Array.isArray(keyword) ? keyword[0] : keyword;
    const feed = await prisma.post.findMany({
      where: {
        published: true,
        title: {
          contains: keywordString,
        },
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    return {
      props: { feed, profile },
    };
  } else {
    const feed = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    return {
      props: { feed, profile },
    };
  }
};

const Blog = (props: Props) => {
  const { data: currentUser } = useCurrentUser();

  const { data: posts, mutate: mutatePosts, error } = usePost();

  const handleDeletePost = async (id: string) => {
    //apiを叩いて削除
    const res = await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    await res.json();
    mutatePosts();
  };
  return (
    <Layout>
      <Box sx={{ margin: 2, width: "100%", height: "100%" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ color: "whitesmoke", display: "inline-block" }}
          >
            Public Feed
          </Typography>
        </Box>
        <Box sx={{ display: "inline-block" }}>
          <Typography color="whitesmoke" variant="h6">
            <Link href={`/profile/${currentUser?.id}`}>
              <a>
                {props?.profile?.nickname
                  ? props?.profile?.nickname
                  : currentUser?.name}
                のプロフィール
              </a>
            </Link>
          </Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Typography color="whitesmoke" variant="h6">
            {posts?.length ? posts?.length : 0} Posts
          </Typography>
        </Box>
        <Box>
          {posts?.map((post) => (
            <Card
              key={post.id}
              sx={{ margin: 3, ":hover": { opacity: "0.8" } }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: "white" }}
                    aria-label="recipe"
                    src={post?.author?.image}
                  ></Avatar>
                }
                title={post.title}
              />
              <Link href={`/p/${post.id}`}>
                <CardContent sx={{ cursor: "pointer" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    whiteSpace={"pre-wrap"}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
              </Link>
              <CardActions disableSpacing>
                <FavoriteButton postId={post.id} />
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
                {/* 投稿者とログインユーザが同じなら表示 */}
                {currentUser?.id === post?.authorId && (
                  <Button
                    onClick={() => {
                      handleDeletePost(post.id);
                    }}
                  >
                    削除
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
        <PostAdd />
      </Box>
    </Layout>
  );
};

export default Blog;
