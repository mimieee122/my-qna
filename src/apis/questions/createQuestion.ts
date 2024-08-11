import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createQuestion = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { title, content, userIdx } = req.body
    const idx = req.query

    if (!title && !content) {
        return res
            .status(400)
            .json({ message: '제목과 내용을 모두 작성하세요.' })
    }

    try {
        await prisma.question.create({
            data: {
                title: title,
                content: content,
                userIdx: userIdx,
                idx: Number(idx),
            },
        })

        return res.status(200).json({ message: '질문 생성에 성공하였습니다.' })
    } catch {
        return res.status(500).json({ message: '질문 생성을 실패하였습니다.' })
    }
}
