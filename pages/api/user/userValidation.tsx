import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET通信だったら、emailが存在しているか確認する
  if (req.method === "POST") {
    const { email, password } = req.body;

    // emailが存在しているか確認
    const data = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    // emailが存在していなかったら、エラーを返す
    if (!data) {
      return res
        .status(400)
        .json({ notFoundEmail: "メールアドレスが存在しません" });
    }

    // passwordが一致しているか確認
    const comparePassword = await bcrypt.compare(password, data.password);
    // passwordが一致していなかったら、エラーを返す
    if (!comparePassword) {
      return res
        .status(401)
        .json({ inValidPassword: "パスワードが一致しません" });
    }

    return res.status(200).json(data);
  }
}
