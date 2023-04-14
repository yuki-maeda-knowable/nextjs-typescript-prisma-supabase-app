import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getだったら、使用回数の多いタグ名を10件返す
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
