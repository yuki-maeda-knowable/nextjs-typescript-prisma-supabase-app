import React, { useEffect, useState } from "react";
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
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import getProfile from "../lib/getProfile";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";

type Props = {
  feed: PostProps[];
  keyword: string;
  sample: string;
  profile: any;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/users/create",
        permanent: false,
      },
    };
  }

  const profile = await getProfile(session?.user?.id);

  const { keyword } = context.query;

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
};

const Blog = (props: Props) => {
  //postが作成されたら、状態を更新する必要があるため、feedを定義
  const [feed, setFeed] = useState<PostProps[]>(props.feed);

  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/post`);
        const newFeed = await res.json();
        setFeed(newFeed);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [props.feed]);

  return (
    <Layout>
      <Typography variant="h5" sx={{ color: "whitesmoke" }}>
        Public Feed
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Typography color="whitesmoke" variant="h6" justifyContent="flex-end">
          <Link href={`/profile/${currentUser?.id}`}>
            <a>{props?.profile?.nickname}のプロフィール</a>
          </Link>
        </Typography>
      </Box>
      <Box>
        <Typography color="whitesmoke" variant="h6">
          {props.feed.length} Posts
        </Typography>
      </Box>
      <Box>
        {props.feed.map((post) => (
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
              <IconButton aria-label="add to favorites">
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: "red" }} />}
                />
              </IconButton>
              <IconButton aria-label="share">
                <Share />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
      <PostAdd />
    </Layout>
  );
};

export default Blog;
