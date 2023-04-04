import { NextApiResponse, NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;
    //prisma.profile.deleteで削除
    const profile = await prisma.photo.delete({
      where: {
        id: String(id),
      },
    });
    res.status(200).json(profile);
  }
}
