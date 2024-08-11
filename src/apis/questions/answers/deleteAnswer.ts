import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteAnswer = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const idx = req.query
        await prisma.answer.delete({
            where: {
                idx: Number(idx),
            },
        })

        return res.status(200).json({ message: '답변 삭제에 성공하였습니다.' })
    } catch {
        return res.status(500).json({ message: '답변 삭제에 실패하였습니다.' })
    }
}
