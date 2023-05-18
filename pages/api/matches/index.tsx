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

      // chatRoomテーブルから、matchedUserに含まれるユーザのチャットルーム情報を取得する
      const chatRooms = await prisma.chatRooms.findMany({
        where: {
          OR: [
            {
              initiatorId: currentUser.id,
              recipientId: {
                in: matchedUser.map((m) => m.follower.id),
              },
            },
            {
              initiatorId: {
                in: matchedUser.map((m) => m.follower.id),
              },
              recipientId: currentUser.id,
            },
          ],
        },
      });

      // matchedUserにchatRooms情報を追加してクライアント側に返す
      const result = matchedUser.map((m) => {
        const chatRoom = chatRooms.find(
          (c) =>
            (c.initiatorId === currentUser.id &&
              c.recipientId === m.follower.id) ||
            (c.initiatorId === m.follower.id &&
              c.recipientId === currentUser.id)
        );
        return {
          ...m,
          chatRoom: chatRoom || null,
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }
}
