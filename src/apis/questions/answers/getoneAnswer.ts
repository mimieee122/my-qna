import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getoneAnswer = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const idx = req.query
        const answer = await prisma.answer.findUnique({
            where: {
                questionIdx: questionIdx,
                idx: Number(idx),
            },
        })

        if (!answer) {
            return res
                .status(400)
                .json({ message: '답변이 존재하지 않습니다.' })
        }

        return res.status(200).json(answer)
    } catch {
        return res.status(500).json({ message: '질문 조회에 실패하였습니다.' })
    }
}
