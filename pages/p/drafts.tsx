import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { PostProps } from "../../types/interface";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import {
  Typography,
  Box,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  IconButton,
  Checkbox,
  Button,
} from "@mui/material";
import { FavoriteBorder, Favorite, Share } from "@mui/icons-material";
import { useRouter } from "next/router";

interface Drafts {
  drafts: PostProps[];
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const data = await prisma.post.findMany({
    where: {
      published: false,
      author: { email: session.user.email },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  const drafts = JSON.parse(JSON.stringify(data));
  return {
    props: {
      drafts,
    },
  };
};

const Drafts = (props: Drafts) => {
  const router = useRouter();
  const { data: session } = useSession();
  async function handlePublish(id: string): Promise<void> {
    const res = await fetch(`/api/post/${id}`, {
      method: "PUT",
    });
    router.push("/");
  }
  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  if (props.drafts.length === 0) {
    return (
      <Layout>
        <Typography variant="h6" sx={{ color: "whitesmoke" }}>
          No Draft
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h5" sx={{ color: "whitesmoke" }}>
        My Drafts
      </Typography>
      <Box>
        <Button href={"/"}>一覧へ戻る</Button>
        {props.drafts.map((post) => (
          <Card key={post.id} sx={{ margin: 3 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: "red" }}
                  aria-label="recipe"
                  src={session?.user?.image}
                ></Avatar>
              }
              title={post.title}
            />
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                whiteSpace={"pre-line"}
              >
                {post.content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: "red" }} />}
                />
              </IconButton>
              <IconButton aria-label="share">
                <Share />
              </IconButton>
            </CardActions>
            {!post.published && (
              <Button onClick={() => handlePublish(post.id)}>公開</Button>
            )}
          </Card>
        ))}
      </Box>
    </Layout>
  );
};

export default Drafts;
