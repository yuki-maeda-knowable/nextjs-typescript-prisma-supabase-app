import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //GET以外がきたら、405エラーを返す
  if (req.method !== "GET") {
    res.status(405).end();
  }
  // 認証を行う
  const { currentUser } = await serverAuth(req);
  if (!currentUser) return res.status(401).end();

  // get通信だったら、followテーブルの情報を返す
  if (req.method === "GET") {
    try {
      //認証が通ったら、followsテーブルの情報を取得する
      const follows = await prisma.follows.findMany({});
      return res.status(200).json(follows);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }
}
