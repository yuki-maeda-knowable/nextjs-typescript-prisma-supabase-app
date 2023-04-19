import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import User from "../../components/user/User";
import prisma from "../../lib/prisma";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../loading";
import { UserProps } from "../../types/interface";

export const getStaticProps: GetStaticProps = async () => {
  const data = await prisma.user.findMany({});
  const users = JSON.parse(JSON.stringify(data));
  return {
    props: { users },
    revalidate: 10,
  };
};

type Props = {
  users: UserProps[];
};

const Users = ({ users }: Props) => {
  return (
    <Layout>
      <main>
        <div className="md:w-2/3">
          <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            <Link href={`/`}>Home</Link>
          </button>
          <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            <Link href={`/auth/signin`}>add User</Link>
          </button>
        </div>
        <h1>User一覧</h1>
        <hr />
        {users.map((user) => (
          <div key={`${user.id}`}>
            <User user={user} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Users;
