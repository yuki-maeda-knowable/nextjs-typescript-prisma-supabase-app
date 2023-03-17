import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    const hash_password = await hash(password, 10);
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash_password,
      },
    });
    return res.status(200).json({ message: "ユーザ登録OK" });
  }
}
