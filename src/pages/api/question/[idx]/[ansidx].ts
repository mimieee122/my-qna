import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { userIdx } = req.body

    switch (method) {
        case 'GET': {
            try {
                const answers = await prisma.answer.findUnique({
                    where: { idx: Number(req.query.idx) },
                    include: {
                        whichquestion: true,
                        whichuser: true,
                    },
                })
                if (answers) {
                    res.status(200).json(answers)
                } else {
                    res.status(400).json({ error: '다시 찾아보세요.' })
                }
            } catch (error) {
                res.status(500).json('답변을 찾을 수 없습니다.')
            }
            break
        }

        case 'PATCH': {
            try {
                const { content, like } = req.body

                // 좋아요 수 증가 및 답변 내용 업데이트

                // 좋아요 수 증가 처리
                if (like) {
                    const updatedAnswer = await prisma.answer.update({
                        where: { idx: Number(req.query.idx) },
                        data: { like: { increment: 1 } },
                    })

                    res.status(200).json(updatedAnswer)
                }

                //  내용 업데이트
                if (content) {
                    const updatedAnswer = await prisma.answer.update({
                        where: { idx: Number(req.query.idx) },
                        data: { content },
                    })

                    res.status(200).json(updatedAnswer)
                }
            } catch (error) {
                console.error(error)
                return res.status(500).json('좋아요 업데이트에 실패하였습니다.')
            }
            break
        }

        case 'DELETE': {
            try {
                const answers = await prisma.answer.delete({
                    where: { idx: Number(req.query.idx) },
                })
                res.status(200).json(answers)
            } catch (error) {
                res.status(500).json('답변 삭제에 실패했습니다.')
            }

            break
        }

        default:
            res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
            res.status(405).end(`다른 메소드를 사용해 주세요.`)
    }
}
