import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getアクションがきたら、400エラーを返す
  if (req.method === "GET") {
    res.status(400).end();
  }
  try {
    //postメソッドだったら、likesテーブルにいいねの登録を行う
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req);
      //postのidを取得
      const { postId } = req.body;
      const favorite = await prisma.favorites.create({
        data: {
          userId: currentUser?.id,
          postId: postId,
        },
      });
      //いいねの登録が完了したら、いいねの情報を返し、200ステータスを返す
      res.status(200).json(favorite);
    }

    //deleteメソッドだったら、likesテーブルからいいねの削除を行う
    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req);
      //postのidを取得
      const { postId } = req.body;
      const favorite = await prisma.favorites.deleteMany({
        where: {
          userId: currentUser?.id,
          postId: postId,
        },
      });
      //いいねの削除が完了したら、200ステータスを返す
      res.status(200).json(favorite);
    }
  } catch (error) {
    console.log(error);
    //エラーが発生したら、400エラーを返す
    res.status(400).end();
  }
}
