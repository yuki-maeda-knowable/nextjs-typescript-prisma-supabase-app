import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../../lib/server-auth";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //認証を行う
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();

  //いいねの数を取得する
  const favoriteCount = await prisma.favorites.count({});

  res.status(200).json(favoriteCount);
}
