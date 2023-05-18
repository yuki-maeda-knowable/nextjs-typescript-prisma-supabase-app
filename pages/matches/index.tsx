import Layout from "../../components/Layout";
import { Typography, Box, Avatar, Button } from "@mui/material";
import useMatches from "../../hooks/useMatches";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Loading from "../loading";
import { useRouter } from "next/router";
import useCurrentUser from "../../hooks/useCurrentUser";

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
  const router = useRouter();
  const { data: user } = useCurrentUser();
  // loadingの状態を管理
  const [open, setOpen] = useState(true);
  const { data: matchedUsers, mutate: mutateMatchedUsers } = useMatches();

  useEffect(() => {
    // dataがあれば、loadingをfalseにする
    if (matchedUsers) {
      setOpen(false);
    }

    mutateMatchedUsers();
  }, [matchedUsers, mutateMatchedUsers]);

  const addChatRoom = async (recipientId: string) => {
    const res = await fetch("/api/chatRooms", {
      method: "POST",
      body: JSON.stringify({
        initiatorId: user.id,
        recipientId: recipientId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const chatRoom = await res.json();
    router.push(`/chats/${chatRoom.id}`);
  };

  // loading中は、ローディング画面を表示する
  if (!matchedUsers) {
    return <Loading open={open} />;
  }
  // matchingUserがいなかったら、No matchingUserと表示する
  if (matchedUsers?.length === 0) {
    return (
      <Layout>
        <Box color={"text.primary"}>
          <Typography variant="h6">No matchingUser</Typography>
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
            <Box display={"flex"}>
              <Link
                href={`/profile/${matchedUser.follower.id}`}
                key={matchedUser?.follower?.id}
              >
                <Box
                  display={"flex"}
                  p={1}
                  sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
                >
                  <Avatar alt="user-image" src={matchedUser.follower.image} />
                  <Typography pl={1} pt={1} color={"text.primary"}>
                    {matchedUser?.follower?.name}
                  </Typography>
                </Box>
              </Link>
              <Box>
                {matchedUser?.chatRoom?.id ? (
                  <Button
                    href={`/chats/${matchedUser.chatRoom.id}`}
                    sx={{ mt: 1 }}
                  >
                    チャットを送る
                  </Button>
                ) : (
                  <Button
                    onClick={() => addChatRoom(matchedUser.follower.id)}
                    sx={{ mt: 1 }}
                  >
                    チャットを初めて送る
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Matches;
