import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getだったら、使用回数の多いタグ名を10件返す
  if (req.method === "GET") {
    try {
      const data = await prisma.postTags.groupBy({
        by: ["tagsId"],
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: "desc",
          },
        },
        take: 10,
      });
      //tagsIdを元に、tagsのnameを取得する
      const tags = await Promise.all(
        data.map(async (tag) => {
          const tagData = await prisma.tags.findUnique({
            where: {
              id: tag.tagsId,
            },
          });
          return {
            id: tag.tagsId,
            name: tagData.name,
            count: tag._count.postId,
          };
        })
      );

      return res.status(200).json(tags);
    } catch (error) {
      console.log("error: " + error);
      throw new Error(error);
    }
  }
}
