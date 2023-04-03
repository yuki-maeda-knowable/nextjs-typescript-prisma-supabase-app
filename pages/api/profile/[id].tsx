import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

// 更新削除のAPIをここで作成する
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { nickname, url, userId } = req.body;
      const profile = await prisma.profile.update({
        where: {
          userId: userId,
        },
        data: {
          nickname: nickname,
          userId: userId,
        },
      });

      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(401).json(error);
    }
  } else if (req.method === "DELETE") {
  }
}
