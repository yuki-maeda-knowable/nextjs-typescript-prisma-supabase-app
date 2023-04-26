import Layout from "../../components/Layout";
import { Box, Typography, Avatar } from "@mui/material";
import useFollower from "../../hooks/useFollower";
import { useEffect } from "react";
import Link from "next/link";

export default function Follower() {
  // フォロワー一覧を取得
  const { data: followers, error, mutate: mutateFollower } = useFollower();
  useEffect(() => {
    mutateFollower();
  }, [followers, mutateFollower]);

  if (!followers || followers?.length === 0) {
    return (
      <Layout>
        <Box color={"text.primary"}>
          <Typography variant="h6">フォロワー一覧</Typography>
          <Box m={1}>
            <Typography variant="h6">フォロワーはいません</Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box color={"text.primary"}>
        <Typography variant="h6">フォロワー一覧</Typography>

        <Box m={1}>
          <Typography variant="h6">{followers?.length} follower</Typography>
          {followers?.map((follower) => (
            <Link href={`/profile/${follower.id}`} key={follower.id}>
              <Box
                display={"flex"}
                p={1}
                sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
              >
                <Avatar alt="user-image" src={follower.image} />
                <Typography pl={1} pt={1}>
                  {follower.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
