// 여기서부터 공부 시작 !

import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getQuestion = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const question = await prisma.question.findMany()

        if (!question) {
            return res
                .status(400)
                .json({ message: '질문 항목이 존재하지 않습니다.' })
        }

        return res.status(200).json(question)
    } catch {
        return res.status(500).json({ message: '질문 조회에 실패하였습니다.' })
    }
}
