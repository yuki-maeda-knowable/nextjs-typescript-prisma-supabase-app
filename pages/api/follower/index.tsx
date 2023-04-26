import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get通信なら、ログインユーザをフォローしているユーザーのidを取得
  if (req.method === "GET") {
    //認証を行い、認証が通らない場合はエラーを返す
    const { currentUser } = await serverAuth(req);
    if (!currentUser) return res.status(401).end();

    try {
      const follower = await prisma.follows.findMany({
        where: {
          followerId: currentUser.id,
        },
        select: {
          followingId: true,
        },
      });

      // followerIdを元にユーザー情報を取得
      const followerUser = await prisma.user.findMany({
        where: {
          id: {
            in: follower.map((f) => f.followingId),
          },
        },
      });

      return res.status(200).json(followerUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
