import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.method: ", req.method);

  // 認証
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();
  // POSTメソッドだったら、chatRoomテーブルに登録をし、chatRoomのidを返す。
  // initiatorIdをreq.bodyから取得
  // receiverIdは
  if (req.method === "POST") {
    const { initiatorId, recipientId } = req.body;
    console.log("initiatorId: ", initiatorId);
    console.log("recipientId: ", recipientId);
    try {
      const chatRoom = await prisma.chatRooms.create({
        data: {
          initiatorId: initiatorId,
          recipientId: recipientId,
        },
      });
      console.log("chatRoom: ", chatRoom);
      res.status(200).json(chatRoom);
    } catch (error) {
      console.log(error);
    }
  }
}
