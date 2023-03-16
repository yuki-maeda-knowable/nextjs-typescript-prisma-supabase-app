import prisma from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email
      },
    })
    return res.status(200).json({message: 'ユーザ登録OK'})
  }
}