import React, { useState, useEffect, useRef } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Layout from "../components/Layout";
import { PostProps } from "../types/interface";
import { getSession } from "next-auth/react";
import PostAdd from "./p/PostAdd";
import format from "date-fns/format";
import PostSearchForm from "../components/post/postSearchForm";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Box,
  Button,
  Pagination,
  Chip,
  Grid,
  CardMedia,
} from "@mui/material";
import getProfile from "../lib/getProfile";
import Link from "next/link";
import useCurrentUser from "../hooks/useCurrentUser";
import FavoriteButton from "../components/FavoriteButton";
import usePost from "../hooks/usePost";
import useSortedTags from "../hooks/useSortedTags";
import useUsers from "../hooks/useUsers";
import useFollowingCount from "../hooks/useFollowingCount";
import useFollower from "../hooks/useFollower";
import Loading from "./loading";
import { Share } from "@mui/icons-material";

type Props = {
  posts: PostProps[];
  profile: any;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const profile = await getProfile(session?.user?.id ? session?.user?.id : "");
  return {
    props: { profile },
  };
};

const Blog = (props: Props) => {
  // 記事の最大表示文字数
  const MAX_LENGTH = 20;

  // loadingの状態を管理
  const [open, setOpen] = useState(true);
  const { data: currentUser } = useCurrentUser();
  const { data: posts, mutate: mutatePosts, error } = usePost();

  // 検索後の記事を格納する配列
  const [searchQuery, setSearchQuery] = useState([]);
  const ref = useRef(null);

  const handleSearch = () => {
    setSearchQuery(
      posts.filter((post) =>
        post.content.toLowerCase().includes(ref.current.value)
      )
    );
  };

  const { data: sortedTags, mutate: mutateSortedTags } = useSortedTags();

  // followしている人の数を取得
  const { data: following, mutate: mutateFollowingCount } = useFollowingCount();
  //followerの数を取得
  const { data: follower, mutate: mutateFollower } = useFollower();

  const { data: users, mutate: mutateUsers } = useUsers();

  // posts, tag, usersに変更があったら再レンダリング
  useEffect(() => {
    if (posts) {
      setSearchQuery(posts);
      setOpen(false);
    }
    mutatePosts();
    mutateSortedTags();
    mutateUsers();
    mutateFollowingCount();
    mutateFollower();
  }, [posts, sortedTags, users]);

  // ---- pagination start ------------
  // 1ページに表示する記事数
  const itemsPerPage = 6;
  //1ページ目に表示させる最初の添字
  const [itemsOffset, setItemsOffset] = useState(0);
  //1ページ目の最後に表示させる添字
  const endOffset = itemsOffset + itemsPerPage;
  //現在のページに表示させる要素数
  const currentPosts = searchQuery?.slice(itemsOffset, endOffset);
  //ページの数。postsの全体数を1ページあたりに表示する数でmath.ceilを使って切り上げる
  const pageCount = Math.ceil(searchQuery?.length / itemsPerPage);

  //現在のページを管理するstate
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageIndex: number
  ) => {
    setCurrentPage(pageIndex);
    const selectedPage = pageIndex - 1;
    const newOffset = (selectedPage * itemsPerPage) % searchQuery?.length;
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

  // postsを取得できていない場合はローディングを表示
  if (!posts) {
    return <Loading open={open} />;
  }

  return (
    <Layout>
      <Box
        sx={{ margin: 2, width: "100%", height: "100%", color: "text.primary" }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"text.primary"}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h5">Public Feed</Typography>
            <Typography variant="h6">
              {posts?.length ? posts?.length : 0} Posts
            </Typography>

            <PostSearchForm
              id={"outlined-basic"}
              type={"text"}
              label={"Post Search"}
              inputRef={ref}
              onChange={handleSearch}
            />
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Link href={`/following`}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }}
              >
                {following?.followingCount} following
              </Typography>
            </Link>
            <Link href={`/follower`}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }}
              >
                {follower?.length === 0 || undefined ? 0 : follower?.length}{" "}
                follower
              </Typography>
            </Link>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }}
            >
              <Link href={`/matches`}>matching Users</Link>
            </Typography>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }}
            >
              <Link href={`/scraping/green`}>Greenの求人をスクレイピング</Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
            }}
          >
            <Link href={`/profile/${currentUser?.id}`}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }}
              >
                {props?.profile?.nickname
                  ? props?.profile?.nickname
                  : currentUser?.name}
                のプロフィール
              </Typography>
            </Link>
            <Box
              display={"flex"}
              width={"100%"}
              height={"100px"}
              flexWrap={"wrap"}
            >
              {sortedTags?.map((tag) => (
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
        <Box display={"flex"}>
          <Box>
            <Grid container spacing={2}>
              {currentPosts?.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card sx={{ margin: 1 }}>
                    <Link href={`/profile/${post?.authorId}`}>
                      <CardMedia
                        sx={{
                          height: 180,
                          ":hover": { opacity: "0.8" },
                        }}
                        image={post?.author?.image}
                      />
                    </Link>
                    <Link href={`/p/${post.id}`}>
                      <CardContent
                        sx={{
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          height: "100px",
                          whiteSpace: "nowrap",
                          ":hover": { opacity: "0.8" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.primary"
                          whiteSpace={"pre-wrap"}
                        >
                          {post.content.length > MAX_LENGTH
                            ? post.content.slice(0, MAX_LENGTH) + "..."
                            : post.content}
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
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{
                          fontSize: "0.8rem",
                        }}
                      >
                        {format(new Date(post?.createdAt), "yyyy/MM/dd HH:mm")}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box
              color={"text.primary"}
              textAlign={"center"}
              display={"flex"}
              justifyContent={"center"}
              mt={2}
            >
              <Pagination
                count={pageCount}
                onChange={handlePageChange}
                color="primary"
                page={currentPage}
              />
            </Box>
            <PostAdd />
          </Box>
          <Box width={"20%"} color={"text.primary"}>
            <Typography variant="h6" pl={1} pt={1}>
              Users
            </Typography>
            {users?.map(
              (user) =>
                user.id !== currentUser?.id && (
                  <Link href={`/profile/${user.id}`} key={user.id}>
                    <Box
                      display={"flex"}
                      p={1}
                      sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
                    >
                      <Avatar alt="user-image" src={user.image} />
                      <Typography pl={1} pt={1}>
                        {user.name}
                      </Typography>
                    </Box>
                  </Link>
                )
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};
export default Blog;
