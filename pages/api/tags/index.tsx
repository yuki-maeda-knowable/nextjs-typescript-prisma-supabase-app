import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getだったら、タグの一覧を返す
  if (req.method === "GET") {
    try {
      const data = await prisma.tags.findMany();
      return res.status(200).json(data);
    } catch (error) {
      console.log("error: " + error);
      throw new Error(error);
    }
  }
}
