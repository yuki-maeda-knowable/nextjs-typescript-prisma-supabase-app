import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import prisma from "../lib/prisma";

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error("Not found Email");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    throw new Error("Not registered user");
  }

  return { currentUser };
};

export default serverAuth;
