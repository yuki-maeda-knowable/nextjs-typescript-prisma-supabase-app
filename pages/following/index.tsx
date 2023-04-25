import Layout from "../../components/Layout";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import useFollower from "../../hooks/useFollowing";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import useCurrentUser from "../../hooks/useCurrentUser";
import Link from "next/link";
import FavoriteButton from "../../components/FavoriteButton";
import { Share } from "@mui/icons-material";
import useFollowingCount from "../../hooks/useFollowingCount";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  // sessionがない場合はログインページにリダイレクト
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const Following = () => {
  const { data: currentUser, mutate: mutateFollowingCount } = useCurrentUser();
  const {
    followingUsers,
    followingPosts,
    error,
    followingPostsMutate: mutateFollowingPosts,
    followingUsersMutate: mutateFollowingUsers,
  } = useFollower(currentUser?.id);

  const { data } = useFollowingCount();
  useEffect(() => {
    mutateFollowingPosts();
    mutateFollowingUsers();
    mutateFollowingCount();
  }, [
    followingUsers,
    followingPosts,
    mutateFollowingPosts,
    mutateFollowingUsers,
  ]);
  if (!followingUsers || !followingPosts) {
    return (
      <Layout>
        <Box color={"text.primary"} sx={{ margin: 2 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        color={"text.primary"}
        sx={{ margin: 2, width: "100%", height: "100%" }}
      >
        <Typography variant="h6">Following</Typography>
        <Box display={"flex"}>
          {followingPosts?.length !== 0 ? (
            <Box width={"60%"} m={1}>
              <Typography variant="body1">following posts</Typography>
              <Grid container spacing={2}>
                {followingPosts?.map((followingPost) => (
                  <Grid item xs={12} sm={6} md={4} key={followingPost.id}>
                    <Card sx={{ margin: 1, ":hover": { opacity: "0.8" } }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: "white" }}
                            aria-label="recipe"
                            src={followingPost?.author?.image}
                          ></Avatar>
                        }
                        title={followingPost.title}
                      />
                      <Link href={`/p/${followingPost.id}`}>
                        <CardContent
                          sx={{
                            cursor: "pointer",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: "100px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.primary"
                            whiteSpace={"pre-wrap"}
                          >
                            {followingPost.content}
                          </Typography>
                        </CardContent>
                      </Link>
                      <CardActions disableSpacing>
                        <FavoriteButton postId={followingPost.id} />
                        <IconButton aria-label="share">
                          <Share />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box width={"60%"} m={1} display={"flex"}>
              <Typography variant="h6">No posts found.</Typography>
            </Box>
          )}

          {followingUsers?.length !== 0 ? (
            <Box width={"40%"} m={1}>
              <Typography variant="h6">
                {data?.followingCount} following user
              </Typography>
              {followingUsers?.map((followingUser) => (
                <Link
                  href={`/profile/${followingUser.id}`}
                  key={followingUser.id}
                >
                  <Box
                    display={"flex"}
                    p={1}
                    sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
                  >
                    <Avatar alt="user-image" src={followingUser.image} />
                    <Typography pl={1} pt={1}>
                      {followingUser.name}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          ) : (
            <Box width={"40%"} m={1} color={"text.primary"}>
              <Typography variant="h6">no following</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Following;
