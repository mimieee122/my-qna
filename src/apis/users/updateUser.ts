import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateUser = async (
    userIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.body.name || req.body.email) {
        return res
            .status(400)
            .json({ message: '이름과 이메일은 수정할 수 없습니다.' })
    }

    try {
        await prisma.user.update({
            where: {
                idx: userIdx,
            },
            data: {
                password: req.body.password,
            },
        })
        return res
            .status(200)
            .json({ message: '비밀번호 수정을 완료하였습니다.' })
    } catch {
        return res.status(500).json({ message: '업데이트를 실패하였습니다.' })
    }
}
