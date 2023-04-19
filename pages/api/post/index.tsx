import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, published, tags } = req.body;
    // ログインしているユーザのsession情報を取得
    const session = await getSession({ req });
    const { email } = session.user;

    //tagsがなければ、postのみ登録する
    if (!tags || tags.length === 0) {
      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          published: published,
          // 登録しているユーザでemailがログインしているユーザであるか
          author: {
            connect: {
              email: email,
            },
          },
        },
      });
      return res.status(200).json(post);
    }

    // tagsがあれば、tag, post, postTagsに登録する
    if (tags.length > 0) {
      // tagsの中で新規登録のタグを取得する
      const newTags = tags.filter((tag) => !tag.id);

      // 新規タグがあれば登録する
      if (newTags.length > 0) {
        await Promise.all(
          newTags.map(async (tag) => {
            return await prisma.tags.create({
              data: {
                name: tag.name,
              },
            });
          })
        );
      }
      // タグの一覧を取得する
      const existingTags = await prisma.tags.findMany({});

      // 新規登録したタグはidがないので、idを取得する
      const filteredExistingTags = existingTags.filter((existingTag) =>
        tags.some((tag) => tag.name === existingTag.name)
      );

      // tagsに紐づくpostを登録する
      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          published: published,
          // 登録しているユーザでemailがログインしているユーザであるか
          author: {
            connect: {
              email: email,
            },
          },
          // tagsの配列をmapで回して、中間テーブルに登録する
          PostTags: {
            create: filteredExistingTags.map((tag) => ({
              Tags: {
                connect: {
                  id: tag.id,
                },
              },
            })),
          },
        },
      });
      return res.status(200).json(post);
    }
  }

  // GETリクエストの場合
  if (req.method === "GET") {
    const data = await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });
    //Date型をJsonに変換して返す
    const newData = JSON.parse(JSON.stringify(data));

    return res.status(200).json(newData);
  }
}
