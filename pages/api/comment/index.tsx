import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

//postメソッドだったらコメントを登録する
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // 認証を行う
    const user = await serverAuth(req);
    if (!user) return res.status(401).end();

    try {
      const { postId, userId } = req.body;
      const content = req.body.comment;
      const comment = await prisma.comments.create({
        data: {
          content,
          postId: String(postId),
          userId: userId,
        },
      });
      res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
