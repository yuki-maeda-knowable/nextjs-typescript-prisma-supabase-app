import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id } = req.query;

    const data = await prisma.post.update({
      where: {
        id: String(id),
      },
      data: {
        published: true,
      },
    });
    return res.status(200).json(data);
  }
}
