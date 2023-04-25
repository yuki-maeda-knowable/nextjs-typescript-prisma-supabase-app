import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 認証を行う
  const { currentUser } = await serverAuth(req);
  if (!currentUser) return res.status(401).end();
  // POST通信だったら、followテーブルに情報を追加する
  if (req.method === "POST") {
    try {
      //認証が通ったら、followsテーブルに情報を追加する
      const { followerId } = req.body;
      const follow = await prisma.follows.create({
        data: {
          followerId: followerId,
          followingId: currentUser?.id,
        },
      });

      return res.status(200).json(follow);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }

  // DELETE通信だったら、followテーブルの情報を削除する
  if (req.method === "DELETE") {
    try {
      const { followerId } = req.body;
      //認証が通ったら、followsテーブルの情報を削除する
      const follow = await prisma.follows.deleteMany({
        where: {
          followerId: followerId,
          followingId: currentUser?.id,
        },
      });

      return res.status(200).json(follow);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }
}
