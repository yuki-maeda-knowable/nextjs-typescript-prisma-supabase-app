import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

//PUTメソッドだったらコメントを更新する
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // 認証を行う
    const user = await serverAuth(req);
    if (!user) return res.status(401).end();

    try {
      const { id, editComment } = req.body;
      const updateComment = await prisma.comments.update({
        where: { id: id },
        data: { content: editComment },
      });
      res.status(200).json(updateComment);
    } catch (error) {
      res.status(500).json({ error: "コメントの更新に失敗しました" });
    }
  }
  //DELETEメソッドだったらコメントを削除する
  if (req.method === "DELETE") {
    // 認証を行う
    const user = await serverAuth(req);
    if (!user) return res.status(401).end();
    try {
      const { id } = req.query;
      await prisma.comments.delete({
        where: { id: String(id) },
      });
      res.status(200).json({ message: "コメントを削除しました" });
    } catch (error) {
      res.status(500).json({ error: "コメントの削除に失敗しました" });
    }
  }
}
