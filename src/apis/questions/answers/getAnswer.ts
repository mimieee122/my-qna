import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getAnswer = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const answers = await prisma.answer.findMany()

        if (!answers) {
            return res.status(400).json({ message: '조회할 답변이 없습니다.' })
        }

        return res.status(200).json(answers)
    } catch {
        return res.status(500).json({ message: '답변 조회에 실패하였습니다.' })
    }
}
