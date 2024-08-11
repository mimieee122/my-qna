import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateQuestion = async (
    questionIdx: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { content, title } = req.body
        const idx = req.query

        if (!questionIdx) {
            return res
                .status(400)
                .json({ message: '해당 질문은 존재하지 않습니다.' })
        }

        const answers = await prisma.question.findMany({
            where: { idx: questionIdx },
            include: {
                Answer: {
                    select: {
                        idx: true,
                    },
                },
            },
        })

        if (answers) {
            return res
                .status(400)
                .json('이미 답변이 달린 글은 수정할 수 없습니다.')
        }

        const question = await prisma.question.update({
            // update할 때 where 필수
            where: {
                idx: questionIdx,
            },
            data: {
                content: content,
                title: title,
            },
        })

        return res.status(200).json(question)
    } catch {
        return res
            .status(500)
            .json({ message: '질문 업데이트에 실패하였습니다.' })
    }
}
