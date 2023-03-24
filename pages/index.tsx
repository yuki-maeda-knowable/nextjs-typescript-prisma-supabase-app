import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PostSearchForm from "../components/post/postSearchForm";

type Props = {
  feed: PostProps[];
  keyword: string;
  sample: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { keyword } = context.query;

  // 検索ワードが配列になっちゃうから、一旦文字列に変換
  const keywordString: string = Array.isArray(keyword) ? keyword[0] : keyword;
  const feed = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: keywordString,
      },
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
  };
};

const Blog = (props: Props) => {
  //postが作成されたら、状態を更新する必要があるため、feedを定義
  const [feed, setFeed] = useState<PostProps[]>(props.feed);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/post`);
        const newFeed = await res.json();
        setFeed(newFeed);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [props]);

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>

        <main>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-3 rounded"
              type="button"
            >
              <Link href={`/users/${session?.user?.id}`}>profile</Link>
            </button>
          </div>
          <div className="text-right">
            <PostSearchForm />
          </div>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              {session && <Post post={post} />}
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
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

export default Blog;
