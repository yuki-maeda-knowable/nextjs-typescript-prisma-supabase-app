import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { getSession } from "next-auth/react";
import PostAdd from "./p/PostAdd";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Box,
  Button,
  Pagination,
  Chip,
} from "@mui/material";
import { Share } from "@mui/icons-material";
import getProfile from "../lib/getProfile";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";
import FavoriteButton from "../components/FavoriteButton";
import usePost from "../hooks/usePost";
import { useEffect } from "react";
import useTags from "../hooks/useTags";

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
    const data = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    const feed = JSON.parse(JSON.stringify(data));
    return {
      props: { feed, profile },
    };
  }
};

const Blog = (props: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: posts, mutate: mutatePosts, error } = usePost();

  //tagの一覧を取得
  const { data: tags, mutate: mutateTags } = useTags();

  // postsに変更があったら再レンダリング
  useEffect(() => {
    mutatePosts();
    mutateTags();
  }, [posts, tags]);

  // ---- pagination start ------------
  // 1ページに表示する記事数
  const itemsPerPage = 5;
  //1ページ目に表示させる最初の添字
  const [itemsOffset, setItemsOffset] = useState(0);
  //1ページ目の最後に表示させる添字
  const endOffset = itemsOffset + itemsPerPage;
  //現在のページに表示させる要素数
  const currentPosts = posts?.slice(itemsOffset, endOffset);
  //ページの数。postsの全体数を1ページあたりに表示する数でmath.ceilを使って切り上げる
  const pageCount = Math.ceil(posts?.length / itemsPerPage);

  //現在のページを管理するstate
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageIndex: number
  ) => {
    setCurrentPage(pageIndex);
    const selectedPage = pageIndex - 1;
    const newOffset = (selectedPage * itemsPerPage) % posts?.length;
    setItemsOffset(newOffset);
  };
  // ---- pagination end ------------

  // ---- post delete start ------------
  const handleDeletePost = async (id: string) => {
    //apiを叩いて削除
    const res = await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    await res.json();
    mutatePosts();
  };
  // ---- post delete end ------------

  if (!posts) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Layout>
      <Box sx={{ margin: 2, width: "100%", height: "100%" }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"text.primary"}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h5" sx={{ color: "whitesmoke" }}>
              Public Feed
            </Typography>
            <Typography color="whitesmoke" variant="h6">
              {posts?.length ? posts?.length : 0} Posts
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
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
            <Box
              display={"flex"}
              width={"100%"}
              height={"100px"}
              flexWrap={"wrap"}
            >
              {tags?.map((tag) => (
                <Link href={`/tags/${tag?.id}`} key={tag?.id}>
                  <Chip
                    label={"#" + tag?.name}
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                  />
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          {currentPosts?.map((post) => (
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
          <Box
            color={"text.primary"}
            textAlign={"center"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageChange}
              color="primary"
              page={currentPage}
            />
          </Box>
        </Box>
        <PostAdd />
      </Box>
    </Layout>
  );
};
export default Blog;
