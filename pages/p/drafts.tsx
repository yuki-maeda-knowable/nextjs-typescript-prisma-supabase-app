import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import Post, { PostProps } from "../../components/Post";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Drafts {
  drafts: PostProps[];
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
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
  return {
    props: {
      drafts,
    },
  };
};

const Drafts = (props: Drafts) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Drafts</h1>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: var(--geist-background);
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
