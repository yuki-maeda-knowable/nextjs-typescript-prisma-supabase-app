import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password, image } = req.body;

    // emailが重複していないか確認
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ duplicateEmail: "すでに使用されているメールアドレスです" });
    }

    const hash_password = await hash(password, 10);
    const data = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash_password,
        image: image,
      },
    });
    return res.status(200).json(data);
  }

  // getメソッドだったら、全ユーザー情報を返す
  if (req.method === "GET") {
    const data = await prisma.user.findMany();
    return res.status(200).json(data);
  }
}
