import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import ProfileForm from "../../components/profile/profileForm";
import getProfile from "../../lib/getProfile";

import { getSession } from "next-auth/react";

// getServerSidePropsでsessionIdに紐づくプロフィールを取得
// そのプロフィールをprofileFormに渡す
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

  const userId = session?.user?.id;
  const profile = await getProfile(userId ? userId : "");
  return {
    props: { profile },
  };
};

const Profile = ({ profile }) => {
  return (
    <Layout>
      <ProfileForm profile={profile ? profile : ""} />
    </Layout>
  );
};

export default Profile;
