import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardMedia,
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
  useEffect(() => {
    if (props.profile.id) {
      setVariant("update");
    }
  }, []);

  const thumbsOptions: Options = {
    type: "loop",
    rewind: true,
    gap: "1rem",
    pagination: true,
    fixedWidth: 200,
    fixedHeight: 200,
    cover: true,
    focus: "center",
    isNavigation: true,
    autoplay: true,
    interval: 3000,
  };
  const [variant, setVariant] = useState("register");
  const { data: currentUser } = useCurrentUser();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h6" color={`whitesmoke`}>
          Profile
        </Typography>

        <Stack component="form" alignItems="center">
          <Card sx={{ width: 300, p: 3 }}>
            {!props?.profile?.Photo ? (
              <CardMedia
                component="img"
                height="300"
                image="https://pxrfjlomzjkqxocykntv.supabase.co/storage/v1/object/public/photos/user/670cad455cd14fdb8825-beach-2836300__340.jpeg"
                alt="images"
              />
            ) : (
              <Splide aria-label="profile" options={thumbsOptions}>
                {props?.profile?.Photo?.map((photo) => {
                  return (
                    <SplideSlide key={photo.id}>
                      <Image
                        width={300}
                        height={300}
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
              {!props.profile.nickname && (
                <Typography gutterBottom variant="h5">
                  noname
                </Typography>
              )}
              <Typography gutterBottom variant="h5">
                {props.profile.nickname}
              </Typography>
              {/* 年齢が未登録だったら */}
              {props.profile.birthday === "undefined" ? (
                <Typography gutterBottom variant="h6">
                  非公開
                </Typography>
              ) : (
                <Typography gutterBottom variant="h6">
                  {differenceInCalendarYears(
                    new Date(),
                    new Date(props.profile.birthday)
                  )}
                  歳
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {props.profile.gender !== 3
                  ? props.profile.gender === 2
                    ? "男性"
                    : "女性"
                  : "その他"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
              {/* 自分以外には非表示にする */}
              {props.profile.userId === currentUser?.id && (
                <Button size="small" href={`/profile/`}>
                  {variant === "register" ? "profile作成" : "profile編集"}
                </Button>
              )}
              {/* 自分以外だったらフォローボタンを表示 */}
              {props.profile.userId !== currentUser?.id && (
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
