import { GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import User, { UserProps } from '../../components/User';
import prisma from '../../lib/prisma';
import React from 'react';
import Link from 'next/link';

type Props = {
  users: UserProps[]
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await prisma.user.findMany({})
  const users = JSON.parse(JSON.stringify(data))
  return{
    props: {users},
    revalidate: 10
  }
}

const Users: React.FC<Props> = (props) => {
  return(
    <Layout>
      <Link href={`/`}>
        Home
      </Link>
      <h1>User一覧</h1>
      <main>
        {props.users.map((user) => (
          <div key={`${user.id}`}>
            <User user={user}/>
          </div>
        ))}

      </main>
    </Layout>
    
  )
}

export default Users