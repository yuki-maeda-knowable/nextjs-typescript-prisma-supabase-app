import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../../../lib/server-auth";
import prisma from "../../../../lib/prisma";

// PUT /api/post/:id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //認証
  const user = await serverAuth(req);
  if (!user) return res.status(401).end();
  //methodがputだったら
  if (req.method === "PUT") {
    try {
      //req.bodyを取得
      const { title, content } = req.body;

      //idを取得
      const postId = req.query.id;

      //idがなかったら
      if (!postId) return res.status(400).end();

      //idがあったら更新
      const post = await prisma.post.update({
        where: { id: String(postId) },
        data: { title, content },
      });
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      throw new Error("投稿の更新に失敗しました");
    }
  } else {
    //methodがgetだったら
    if (req.method === "GET") {
      try {
        //idを取得
        const postId = req.query.id;

        //idがなかったら
        if (!postId) return res.status(400).end();

        //idがあったら返す
        const post = await prisma.post.findUnique({
          where: { id: String(postId) },
        });
        res.status(200).json(post);
      } catch (error) {
        console.log(error);
        throw new Error("投稿の取得に失敗しました");
      }
    }
  }
}
