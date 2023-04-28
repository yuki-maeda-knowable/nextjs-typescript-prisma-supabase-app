import Layout from "../../components/Layout";
import { Typography, Box, Avatar } from "@mui/material";
import useMatches from "../../hooks/useMatches";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // sessionがなかったら、ログイン画面にリダイレクトする
  const session = await getSession(context);
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

const Matches = () => {
  // loadingの状態管理
  const [loading, setLoading] = useState(true);
  const { data: matchedUsers, mutate: mutateMatchedUsers } = useMatches();
  console.log(matchedUsers);

  useEffect(() => {
    // dataがあれば、loadingをfalseにする
    if (matchedUsers) {
      setLoading(false);
    }
    mutateMatchedUsers();
  }, [matchedUsers, mutateMatchedUsers]);

  // loading中は、ローディング画面を表示する
  if (loading) {
    return (
      <Layout>
        <Box color={"text.primary"}>
          <Typography variant="h6">loading...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box color={"text.primary"}>
        <Typography variant="h6">Matching User</Typography>

        <Box m={1}>
          {matchedUsers?.map((matchedUser) => (
            <Link
              href={`/profile/${matchedUser.follower.id}`}
              key={matchedUser.follower.id}
            >
              <Box
                display={"flex"}
                p={1}
                sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
              >
                <Avatar alt="user-image" src={matchedUser.follower.image} />
                <Typography pl={1} pt={1} color={"text.primary"}>
                  {matchedUser.follower.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Matches;
