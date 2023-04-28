// ユーザ登録が完了したユーザに対してメールを送信する。name, emailを受け取る
// nodemailerを使って、Gmailからメールを送信する
// 送信元は、process.env.MAIL_FROM
// 送信先は、email
// 件名は、ユーザ登録が完了しました
// 本文は、nameさん、ユーザ登録が完了しました。ログインしてください。
// 送信に成功したら、res.status(200).json({ message: 'success' });を返す
// 送信に失敗したら、res.status(500).json({ message: 'error' });を返す

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POSTメソッドだったら
  if (req.method === "POST") {
    const nodemailer = require("nodemailer");

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    const options = {
      service: "Gmail",
      auth: {
        user: user,
        pass: pass,
      },
    };

    // メールの内容
    const msg = {
      to: req.body.email,
      from: process.env.MAIL_FROM,
      subject: "ユーザ登録が完了しました",
      text: `${req.body.name}さん、ユーザ登録が完了しました。`,
    };
    // メールを送信
    try {
      const transporter = nodemailer.createTransport(options);
      await transporter.sendMail(msg);

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "error" });
    }
  }
}
