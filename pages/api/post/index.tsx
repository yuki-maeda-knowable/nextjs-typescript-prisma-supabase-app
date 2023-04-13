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
    // すでに登録されているタグの一覧を取得
    const existingTags = await prisma.tags.findMany({});
    //tagsとexistingTagsを比較して、同じタグがあれば、そのタグを返す。trueであれば、タグの登録はせず、postの登録と中間テーブルの登録を行う
    const filteredExistingTags = existingTags.filter((existingTag) =>
      tags.some((tag) => tag.name === existingTag.name)
    );
    console.log(
      "filteredExistingTags: " + JSON.stringify(filteredExistingTags, null, 2)
    );
    // filteredExistingTagsがtrueであれば、tagsテーブルへの登録は行わない
    if (filteredExistingTags.length > 0) {
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
            create: tags.map((tag) => ({
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
    } else {
      console.log("filteredExistingTagsがない");

      //タグに重複がなければ、tagsテーブルに登録する
      //postに紐づくタグも登録するし、中間テーブルにも登録する
      const post = await Promise.all(
        tags.map(async (tag) => {
          return await prisma.post.create({
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
              // tagsの配列をmapで回して、中間テーブルとtagsテーブルに登録する
              PostTags: {
                create: {
                  Tags: {
                    create: {
                      name: tag.name,
                    },
                  },
                },
              },
            },
          });
        })
      );
      console.log(post);

      return res.status(200).json(post);
    }
  } else if (req.method === "GET") {
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
