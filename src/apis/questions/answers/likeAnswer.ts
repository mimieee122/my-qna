// 여기서부터 공부 시작 !

import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const likeAnswer = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        await prisma.answer.update({
            where: {
                idx: questionIdx,
            },
            data: {
                like: {
                    increment: 1,
                },
            },
        })

        return res
            .status(200)
            .json({ message: '답변 좋아요에 성공하였습니다.' })
    } catch {
        return res
            .status(500)
            .json({ message: '답변 좋아요에 실패하였습니다.' })
    }
}
