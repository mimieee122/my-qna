import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            try {
                const {
                    query: { id },
                } = req
                const questionIdx = req.body
                console.log(id)
                if (id === questionIdx) {
                    const answers = await prisma.answer.findMany({
                        where: {
                            questionIdx: Number(id), // 질문 ID에 해당하는 답변 조회
                        },
                    })
                    return res.status(200).json(answers)
                }
                const answers = await prisma.answer.findMany({
                    include: {
                        whichquestion: true,
                        whichuser: true,
                    },
                })
                res.status(200).json(answers)
            } catch (error) {
                res.status(500).json({ error: '답변 조회에 실패하였습니다.' })
            }
            break

        case 'POST':
            try {
                const { like, content, userIdx, questionIdx } = req.body

                if (
                    !content ||
                    userIdx == undefined ||
                    questionIdx == undefined
                ) {
                    return res.status(400).json('필수 항목을 입력하세요')
                }

                const newAnswer = await prisma.answer.create({
                    data: {
                        like,
                        content,
                        userIdx: Number(userIdx),
                        questionIdx: Number(questionIdx),
                    },
                })
                res.status(200).json(newAnswer)
            } catch (error) {
                res.status(500).json('답변 생성에 실패하였습니다.')
            }
            break
        default: {
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end('다른 메소드를 사용하세요.')
        }
    }
}
