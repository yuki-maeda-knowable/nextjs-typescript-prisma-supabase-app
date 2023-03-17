import React from "react";
import { PostProps } from "../Post";
import Link from "next/link";

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
  return (
    <div>
      <h2>{user.name}</h2>
      <div className="md:w-2/3">
        <button
          className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          <Link href={`/users/${user.id}`}>User Detail</Link>
        </button>
      </div>

      <hr />
    </div>
  );
};

export default User;
