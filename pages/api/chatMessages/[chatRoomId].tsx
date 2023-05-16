import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // getメソッドだったら、chatのデータを全て取得する
  if (req.method === "GET") {
    // 認証を行う
    const user = await serverAuth(req);
    if (!user) return res.status(401).end();

    // req.queryからsenderIdとreceiverId, chatRoomIdを取得する
    const { chatRoomId } = req.query;

    // chatのデータとユーザーのname, imageを取得する
    try {
      const chats = await prisma.chatMessages.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          chatRoomId: String(chatRoomId),
        },
        include: {
          sender: {
            select: {
              image: true,
              name: true,
            },
          },
          receiver: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      });

      res.status(200).json(chats);
    } catch (error) {
      console.log(error);
    }
  } else if (req.method === "POST") {
    console.log("POST");

    // 認証を行う
    const user = await serverAuth(req);
    if (!user) return res.status(401).end();

    // chatのデータを追加する
    try {
      const { senderId, receiverId, message, chatRoomId } = req.body;
      const result = await prisma.chatMessages.create({
        data: {
          senderId,
          receiverId,
          message,
          chatRoomId,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  }
}
