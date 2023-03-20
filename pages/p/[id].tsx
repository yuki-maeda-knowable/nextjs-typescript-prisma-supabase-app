import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (props) => {
  const router = useRouter();
  async function handlePublish(id: string): Promise<void> {
    const res = await fetch(`/api/post/${id}`, {
      method: "PUT",
    });
    console.log(res);

    router.push("/");
  }

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {console.log(props.author.email)}
        {!props.published && (
          <button
            onClick={() => handlePublish(props.id)}
            type="button"
            className="w-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-2  font-small rounded-lg text-sm px-1 py-1 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            公開
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Post;
