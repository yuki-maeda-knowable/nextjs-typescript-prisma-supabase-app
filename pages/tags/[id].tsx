import Layout from "../../components/Layout";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import prisma from "../../lib/prisma";
import Link from "next/link";
import FavoriteButton from "../../components/FavoriteButton";
import { Share } from "@mui/icons-material";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { TagPostProps } from "../../types/interface";

//getServerSidePropsでタグに紐づく投稿を取得する。型も定義しながら
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  //prismaでタグに紐づく投稿を降順で取得する
  const data = await prisma.tags.findMany({
    where: {
      id: String(id),
    },
    include: {
      PostTags: {
        include: {
          Post: {
            include: {
              author: true,
            },
          },
        },
        orderBy: {
          Post: {
            createdAt: "desc",
          },
        },
      },
    },
  });

  const tagPosts = JSON.parse(JSON.stringify(data));
  return {
    props: { tagPosts },
  };
};

const TagsPosts = ({ tagPosts }: { tagPosts: TagPostProps }) => {
  const posts = tagPosts[0]?.PostTags;

  const { data: user } = useCurrentUser();

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
  const pageCount = Math.ceil(tagPosts[0]?.PostTags.length / itemsPerPage);

  //現在のページを管理するstate
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (
    e: React.ChangeEvent<unknown>,
    pageIndex: number
  ) => {
    setCurrentPage(pageIndex);
    const selectedPage = pageIndex - 1;
    const newOffset =
      (selectedPage * itemsPerPage) % tagPosts[0]?.PostTags.length;
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
    //タグに紐づく投稿を再取得に変更かなあ
    // mutatePosts();
  };
  // ---- post delete end ------------

  //もしタグに紐づく投稿がなければ、タグに紐づく記事はないと表示
  if (posts?.length === 0) {
    return (
      <Layout>
        <Box color={"text.primary"}>
          <Box color={"text.primary"}>
            <Typography>タグに紐づく投稿はありません</Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box color={"text.primary"}>
        <Box color={"text.primary"}>
          <Typography>タグに紐づく投稿一覧</Typography>
        </Box>
        <Box>
          {currentPosts?.map((post) => (
            <Card
              key={post.Post.id}
              sx={{ margin: 3, ":hover": { opacity: "0.8" } }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: "white" }}
                    aria-label="recipe"
                    src={post?.Post?.author?.image}
                  ></Avatar>
                }
                title={post?.Post?.title}
              />
              <Link href={`/p/${post?.Post?.id}`}>
                <CardContent sx={{ cursor: "pointer" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    whiteSpace={"pre-wrap"}
                  >
                    {post?.Post?.content}
                  </Typography>
                </CardContent>
              </Link>
              <CardActions disableSpacing>
                <FavoriteButton postId={post?.Post?.id} />
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
                {/* 投稿者とログインユーザが同じなら表示 */}
                {user?.id === post?.Post?.authorId && (
                  <Button
                    onClick={() => {
                      handleDeletePost(post?.Post?.id);
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
      </Box>
    </Layout>
  );
};

export default TagsPosts;
