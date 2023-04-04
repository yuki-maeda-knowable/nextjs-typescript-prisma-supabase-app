import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { nickname, gender, birthday, url, userId } = req.body;
      const profile = await prisma.profile.create({
        data: {
          nickname: nickname,
          gender: gender,
          birthday: new Date(birthday),
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
  }
}
