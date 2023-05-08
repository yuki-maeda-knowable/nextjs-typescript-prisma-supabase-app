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

      const profileId = profile.id;
      const profilePhotos = url.map((url) => {
        return {
          profileId: profileId,
          url: url,
        };
      });

      const photo = await prisma.photo.createMany({
        data: profilePhotos,
      });

      return res.status(200).json({ profile, photo });
    } catch (error) {
      return res.status(401).json(error);
    }
  } else if (req.method === "DELETE") {
  }
}
