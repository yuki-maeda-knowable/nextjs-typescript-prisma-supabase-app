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
          select: { name: true },
        },
      },
    });
    return {
      props: { feed, profile },
    };
  } else {
    return {
      props: { feed: [], profile },
    };
  }
};

const Blog = (props: Props) => {
  const { data: currentUser } = useCurrentUser();
  // postの一覧を取得
  const { data: posts } = usePost();

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
            {props?.feed?.length ? props?.feed?.length : posts?.length} Posts
          </Typography>
        </Box>
        <Box>
          {props?.feed?.length === 0 &&
            posts?.map((post) => (
              <Link href={`/p/${post.id}`}>
                <Card
                  key={post.id}
                  sx={{
                    margin: 3,
                    cursor: "pointer",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: "red" }}
                        aria-label="recipe"
                      ></Avatar>
                    }
                    title={post.title}
                    subheader="September 14, 2016"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {post.content}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <FavoriteButton postId={post.id} />

                    <IconButton aria-label="share">
                      <Share />
                    </IconButton>
                  </CardActions>
                </Card>
              </Link>
            ))}
          {/* 検索した結果があればこちらを表示 */}
          {props?.feed?.map((post) => (
            <Link href={`/p/${post.id}`}>
              {post.id}
              <Card key={post.id} sx={{ margin: 3 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                      A
                    </Avatar>
                  }
                  title={post.title}
                  subheader="September 14, 2016"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.content}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <FavoriteButton postId={post.id} />

                  <IconButton aria-label="share">
                    <Share />
                  </IconButton>
                </CardActions>
              </Card>
            </Link>
          ))}
        </Box>
        <PostAdd />
      </Box>
    </Layout>
  );
};

export default Blog;
