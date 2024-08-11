import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createAnswer = async (
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

        if (!req.body.userIdx || !req.body.content) {
            return res
                .status(400)
                .json({ message: '답변 내용과 유저 아이디를 모두 작성하세요.' })
        }

        const answer = await prisma.answer.create({
            data: {
                userIdx: req.body.userIdx,
                content: req.body.content,
                questionIdx: questionIdx,
            },
        })

        return res.status(200).json(answer)
    } catch {
        return res.status(500).json({ message: '답변 생성에 실패하였습니다.' })
    }
}
