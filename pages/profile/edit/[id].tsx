import { useState, useEffect } from "react";
import React from "react";
import getProfile from "../../../lib/getProfile";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { Profile } from "../../../components/profile/profileForm";
import ProfileForm from "../../../components/profile/profileForm";
import { useRouter } from "next/router";
type EditProfile = {
  profile?: Profile;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const { id } = context.query;
  const profile = await getProfile(id);
  return {
    props: { profile },
  };
}

const EditProfile: React.FC<EditProfile> = (profile) => {
  const router = useRouter();
  const [user, setUser] = useState<EditProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setUser(profile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Edit Profile</h1>
      <ProfileForm profile={user?.profile} />
    </div>
  );
};

export default EditProfile;
