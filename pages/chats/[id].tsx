import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Layout from "../../components/Layout";
import { getSession } from "next-auth/react";
import useCurrentUser from "../../hooks/useCurrentUser";
import Chat from "../../components/Chat";

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

  const chatRoomId = context.query.id;

  return {
    props: { chatRoomId },
  };
};
const Chats = ({ chatRoomId }) => {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <Chat chatRoomId={chatRoomId} />
    </Layout>
  );
};

export default Chats;
