import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateAnswer = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { content } = req.body
        const idx = req.query

        const answer = await prisma.answer.update({
            where: { idx: Number(idx) },
            data: {
                content: content,
            },
        })

        return res.status(200).json(answer)
    } catch {
        return res
            .status(500)
            .json({ message: '답변 업데이트에 실패하였습니다.' })
    }
}
