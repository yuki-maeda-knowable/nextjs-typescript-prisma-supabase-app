import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../../../lib/server-auth";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //認証を行う
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();

  const { id } = req.query;
  const postId = String(id);
  //いいねの数を取得する
  const favoriteCount = await prisma.favorites.count({
    where: {
      postId: postId,
    },
  });

  res.status(200).json(favoriteCount);
}
