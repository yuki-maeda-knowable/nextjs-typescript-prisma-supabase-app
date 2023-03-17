import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import User, { UserProps } from "../../components/user/User";
import prisma from "../../lib/prisma";
import React from "react";
import Link from "next/link";
import UserFrom from "../../components/user/UserForm";

//ユーザ一覧の型定義
type Props = {
  users: UserProps[];
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await prisma.user.findMany({});
  const users = JSON.parse(JSON.stringify(data));
  return {
    props: { users },
    revalidate: 10,
  };
};

const Users = (props: Props) => {
  return (
    <Layout>
      <main>
        <div className="md:w-2/3">
          <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            <Link href={`/`}>Home</Link>
          </button>
        </div>
        <h1>User一覧</h1>
        <hr />
        {props.users.map((user) => (
          <div key={`${user.id}`}>
            <User user={user} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Users;
