import { useState, useEffect } from "react";
import React from "react";
import getProfile from "../../../lib/getProfile";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
// import { Profile } from "../../../components/profile/profileForm";
import { ProfileProps } from "../../../types/interface";
import ProfileForm from "../../../components/profile/profileForm";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
type EditProfile = {
  profile?: ProfileProps;
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
    <Layout>
      <Box
        sx={{
          color: "text.primary",
        }}
      >
        <Typography variant="h4" sx={{ padding: 2 }}>
          Edit Profile
        </Typography>
        <ProfileForm profile={user?.profile} />
      </Box>
    </Layout>
  );
};

export default EditProfile;
