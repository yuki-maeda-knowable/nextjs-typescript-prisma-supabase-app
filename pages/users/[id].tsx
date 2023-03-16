import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import { UserProps } from '../../components/User';
import Layout from '../../components/Layout';

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const data = await prisma.user.findUnique({
    where: {
      id: String(params?.id)
    }
  })
  const user = await JSON.parse(JSON.stringify(data))
  return {
    props:{
      user,
    },
  }
}

const User: React.FC<UserProps> = (props) => {
  return (
    <Layout>
      <div>
        <h2>user詳細</h2>
        <p>{props.user.id}</p>
        <p>{props.user.name}</p>
        <p>{props.user.email}</p>
      </div>
    </Layout>
  );
}

export default User