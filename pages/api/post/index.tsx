import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, published } = req.body;
    // ログインしているユーザのsession情報を取得
    const session = await getSession({ req });
    const { email } = session.user;

    const data = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
        // 登録しているユーザでemailがログインしているユーザであるか
        author: {
          connect: {
            email: email,
          },
        },
      },
    });

    return res.status(200).json(data);
  } else if (req.method === "GET") {
    const data = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    return res.status(200).json(data);
  }
}
