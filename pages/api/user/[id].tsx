import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    await prisma.user.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ message: "ユーザ削除OK" });
  } else if (req.method === "PUT") {
    const { name, email, password, image } = req.body as {
      name?: string;
      email?: string;
      password: string;
      image?: string;
    };
    const hash_password = await hash(password, 10);

    const { id } = req.query;
    const user = await prisma.user.update({
      where: {
        id: String(id),
      },
      data: {
        name: name,
        email: email,
        password: hash_password,
        image: image,
      },
    });
    return res.status(200).json(user);
  }

  // GET /api/user/:id
  if (req.method === "GET") {
    const { id } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json(user);
  }
}
