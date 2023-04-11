import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../../../lib/server-auth";
import prisma from "../../../../lib/prisma";

//postに紐づくコメントを取得する
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //認証を行う
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();

  const { id } = req.query;

  const postId = String(id);

  //コメントを投稿順で取得する
  const comments = await prisma.comments.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: {
      postId: postId,
    },
    include: {
      User: true,
    },
  });

  res.status(200).json(comments);
}
