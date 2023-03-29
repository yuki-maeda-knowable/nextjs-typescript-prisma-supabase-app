import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { useSession } from "next-auth/react";
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
import { Favorite, FavoriteBorder, MoreVert, Share } from "@mui/icons-material";

type Props = {
  feed: PostProps[];
  keyword: string;
  sample: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    props: { feed },
  };
};

const Blog = (props: Props) => {
  //postが作成されたら、状態を更新する必要があるため、feedを定義
  const [feed, setFeed] = useState<PostProps[]>(props.feed);
  const { data: session } = useSession();

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
