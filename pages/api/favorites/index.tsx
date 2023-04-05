import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //GET以外がきたら、405エラーを返す
  if (req.method !== "GET") {
    res.status(405).end();
  }

  try {
    //認証が通ったら、likesテーブルからいいねの情報を取得する
    const { currentUser } = await serverAuth(req);
    const favorites = await prisma.favorites.findMany({
      where: {
        userId: currentUser?.id,
      },
    });
    return res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
