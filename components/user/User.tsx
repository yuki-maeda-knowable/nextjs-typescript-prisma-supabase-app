import React from "react";
import { PostProps } from "../Post";
import Link from "next/link";
import { useRouter } from "next/router";
export type UserProps = {
  id: String;
  name: String;
  email: String;
  password: String;
  createdAt?: String;
  updatedAt?: String;
  posts?: PostProps[];
};

const User: React.FC<{ user: UserProps }> = ({ user }) => {
  const router = useRouter();

  //ユーザ削除
  async function userDelete(id: String) {
    const res = await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
    router.push("/users");
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <div className="md:w-2/3">
        <button
          className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-1 rounded"
          type="button"
        >
          <Link href={`/users/${user.id}`}>Profile</Link>
        </button>
        <button
          onClick={() => userDelete(user.id)}
          className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-1 rounded"
          type="button"
        >
          Delete
        </button>
      </div>

      <hr />
    </div>
  );
};

export default User;
