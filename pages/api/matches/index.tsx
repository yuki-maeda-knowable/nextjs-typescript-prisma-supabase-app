import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET以外がきたら、405エラーを返す
  if (req.method !== "GET") {
    res.status(405).end();
  }
  // 認証を行う
  const { currentUser } = await serverAuth(req);
  if (!currentUser) return res.status(401).end();

  // get通信だったら、followテーブルの情報を返す
  if (req.method === "GET") {
    try {
      // ログインユーザをフォローしてくれたユーザIDを取得する
      const followers = await prisma.follows.findMany({
        where: {
          followerId: currentUser?.id,
        },
        select: {
          followingId: true,
        },
      });

      // 自分をフォローしてくれたユーザに対して、自分もフォローしているユーザIDを取得する
      const matchedUser = await prisma.follows.findMany({
        where: {
          followingId: currentUser?.id,
          followerId: {
            in: followers.map((f) => f.followingId),
          },
        },
        select: {
          // followerのリレーション経由でマッチしたユーザーの情報を取得する
          follower: {
            select: {
              // ユーザーテーブルのid,name, imageを取得する
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return res.status(200).json(matchedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }
}
