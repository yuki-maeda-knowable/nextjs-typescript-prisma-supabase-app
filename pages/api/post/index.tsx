import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, published } = req.body;

    await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
      },
    });
    return res.status(200).json({ message: "post登録できたよ" });
  } else if (req.method === "GET") {
    await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    return res.status(200).json({ message: "post再取得" });
  }
}
