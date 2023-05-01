import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, Box } from "@mui/material";
import { getSession } from "next-auth/react";
import getProfile from "../../lib/getProfile";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Options } from "@splidejs/splide";
import Image from "next/image";
import { useState, useEffect } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import FollowButton from "../../components/FollowButton";
import Loading from "../loading";

interface profile {
  nickname: string;
  photo: [];
  userId: string;
}

export async function getServerSideProps(context) {
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
    props: { profile, id },
  };
}

const Profile = (props) => {
  // loadingの状態管理
  const [open, setOpen] = useState(true);
  const [variant, setVariant] = useState("register");
  const { data: currentUser } = useCurrentUser();

  const genderMap = {
    1: "男性",
    2: "女性",
    3: "その他",
  };

  useEffect(() => {
    // currentUserが読み込まれたらloadingをfalseにする
    if (currentUser) {
      setOpen(false);
    }
    if (props.profile.id) {
      setVariant("update");
    }
  }, [currentUser, props]);

  const thumbsOptions: Options = {
    type: "loop",
    rewind: true,
    gap: "1rem",
    pagination: true,
    fixedWidth: 400,
    fixedHeight: 400,
    cover: true,
    focus: "center",
    isNavigation: true,
    autoplay: true,
    interval: 3000,
  };

  if (!currentUser) {
    return <Loading open={open} />;
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h6">Profile</Typography>

        <Stack component="form" alignItems="center">
          <Card sx={{ width: 600, p: 3 }}>
            {props?.profile?.Photo?.length === 0 ||
            props?.profile?.Photo === undefined ? (
              <Splide aria-label="profile" options={thumbsOptions}>
                <SplideSlide>
                  <Image
                    width={400}
                    height={400}
                    src={
                      "https://pxrfjlomzjkqxocykntv.supabase.co/storage/v1/object/public/photos/user/profile/model_sora.jpeg"
                    }
                    alt="profile"
                  />
                </SplideSlide>
              </Splide>
            ) : (
              <Splide aria-label="profile" options={thumbsOptions}>
                {props?.profile?.Photo?.map((photo) => {
                  return (
                    <SplideSlide key={photo.id}>
                      <Image
                        width={400}
                        height={400}
                        key={photo.id}
                        src={photo.url}
                        alt="profile"
                      />
                    </SplideSlide>
                  );
                })}
              </Splide>
            )}
            <CardContent>
              {!props.profile?.nickname && (
                <Typography gutterBottom variant="h6">
                  名前: 非公開
                </Typography>
              )}
              <Typography gutterBottom variant="h6">
                名前: {props.profile.nickname}
              </Typography>
              {/* 年齢が未登録だったら */}
              {props.profile.birthday === "undefined" ? (
                <Typography gutterBottom variant="h6">
                  年齢: 非公開
                </Typography>
              ) : (
                <Typography gutterBottom variant="h6">
                  年齢:{" "}
                  {differenceInCalendarYears(
                    new Date(),
                    new Date(props.profile.birthday)
                  )}
                  歳
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {genderMap[props?.profile?.gender]}
              </Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
              {/* 自分以外には非表示にする */}
              {props.profile.userId === currentUser?.id && (
                <Button size="small" href={`/profile/`}>
                  {variant === "register" ? "profile作成" : "profile編集"}
                </Button>
              )}
              {props?.profile?.userId === undefined && (
                <Button size="small" href={`/profile/`}>
                  {variant === "register" ? "profile作成" : "profile編集"}
                </Button>
              )}

              {/* 自分以外だったらフォローボタンを表示 */}
              {props?.profile?.userId !== currentUser?.id &&
                props?.profile?.userId && (
                  <FollowButton followerId={props?.id} />
                )}
              {/* <Button
                href={`/profile/edit/${props?.profile?.userId}/`}
                size="small"
              >
                Edit
              </Button> */}
            </CardActions>
          </Card>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Profile;
