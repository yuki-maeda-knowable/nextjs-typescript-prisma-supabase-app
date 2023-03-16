import React from 'react';
import { PostProps } from '../Post';
import Link from 'next/link';

export type UserProps = {
  id: String;
  name: String;
  email: String;
  createdAt?: String;
  updatedAt?: String;
  posts?: PostProps[]
}

const User: React.FC<{user: UserProps }> = ({user}) => {

  return (
    <div>
      <h2>{user.name}</h2>
      <Link href={`/users/${user.id}`}>
        <button>詳細</button>
      </Link>
      <hr />
    </div>
  )
}

export default User