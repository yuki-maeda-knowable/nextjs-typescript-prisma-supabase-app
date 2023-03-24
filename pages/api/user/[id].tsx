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
    const { name, email, password } = req.body;
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
      },
    });
    return res.status(200).json({ message: "更新OK" });
  }
}
