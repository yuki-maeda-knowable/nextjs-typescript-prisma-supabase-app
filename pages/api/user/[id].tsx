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
    const { name, email, password, image } = req.body;
    const hash_password = await hash(password, 10);

    const { id } = req.query;
    const user = await prisma.user.update({
      where: {
        id: String(id),
      },
      data: {
        name: String(name),
        email: String(email),
        password: String(hash_password),
        image: String(image),
      },
    });
    return res.status(200).json({ message: "更新OK" });
  }
}
