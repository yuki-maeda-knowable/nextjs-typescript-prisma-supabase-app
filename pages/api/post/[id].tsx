import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    const data = await prisma.post.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json(data);
  }
}
