import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { UserProps } from "../../components/user/User";
import Layout from "../../components/Layout";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const data = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
  });
  const user = await JSON.parse(JSON.stringify(data));

  return {
    props: user,
  };
};

const User = (user: UserProps) => {
  return (
    <Layout>
      <div>
        <h2>User Detail</h2>
        <p>{user.id}</p>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.password}</p>
      </div>
      <div className="md:w-1/3">
        <button
          className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          <Link href={`/`}>Home</Link>
        </button>
      </div>
    </Layout>
  );
};

export default User;
