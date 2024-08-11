// 여기서부터 공부 시작 !

import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const likeQuestion = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const question = await prisma.question.findUnique({
            where: {
                idx: questionIdx,
            },
        })

        if (!question) {
            return res
                .status(400)
                .json({ message: '해당 질문이 존재하지 않습니다.' })
        }

        await prisma.question.update({
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
            .json({ message: '질문 좋아요에 성공하였습니다.' })
    } catch {
        return res
            .status(500)
            .json({ message: '질문 좋아요에 실패하였습니다.' })
    }
}
