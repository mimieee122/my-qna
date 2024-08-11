import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { phone, password } = req.body

    if (!phone || !password) {
        return res
            .status(400)
            .json({ message: '전화번호와 비밀번호를 모두 작성하세요.' })
    }

    const users = await prisma.user.create({
        data: {
            phone: phone,
            password: password,
        },
    })

    res.status(200).json(users)
}
