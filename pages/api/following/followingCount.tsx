import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import serverAuth from "../../../lib/server-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 認証
  const { currentUser } = await serverAuth(req);
  if (!currentUser) return res.status(401).end();

  // followsテーブルから、ログインしているユーザのIdをもとに、フォローしているユーザーのidを取得し、その数を返す
  const followingCount = await prisma.follows.count({
    where: {
      followingId: currentUser?.id,
    },
  });

  res.status(200).json({ followingCount });
}
