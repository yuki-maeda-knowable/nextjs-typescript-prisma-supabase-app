import serverAuth from "../../../lib/server-auth";
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 認証
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();
  // getメソッドだったら、chatRoomのデータを取得する

  if (req.method === "GET") {
    // chatRoomのidをreq.queryから取得する
    const { chatRoomId } = req.query;
    try {
      const chatRoom = await prisma.chatRooms.findUnique({
        where: {
          id: String(chatRoomId),
        },
        // initiatorとreceiverのname, imageを取得する
        include: {
          initiator: {
            select: {
              name: true,
              image: true,
            },
          },
          recipient: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      res.status(200).json(chatRoom);
    } catch (error) {
      console.log(error);
    }
  }
}
