import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getリクエストの場合
  if (req.method === "GET") {
    // 認証
    const { currentUser } = await serverAuth(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const followingId = currentUser?.id;
      const follower = await prisma.follows.findMany({
        where: { followingId: followingId },
      });

      // フォローしている人のidを取得できたから、そのidを元にユーザー情報を取得する
      const followingUsers = await prisma.user.findMany({
        where: {
          id: {
            in: follower.map((f) => f.followerId),
          },
        },
      });

      // フォローしている人のidを元にユーザー情報を取得できたから、そのユーザー情報を元に投稿を取得し、投稿を新しい順に並び替える
      const followingPosts = await prisma.post.findMany({
        where: {
          authorId: {
            in: followingUsers.map((u) => u.id),
          },
        },
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ followingUsers, followingPosts });
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  }
}
