import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { idx } = req.query
    const userIdx = Number(idx)

    switch (method) {
        case 'GET': {
            try {
                const question = await prisma.question.findUnique({
                    where: {
                        idx: userIdx,
                    },
                })
                if (question) {
                    res.status(200).json(question)
                } else {
                    res.status(404).json({
                        error: '질문을 찾을 수 없습니다.',
                    })
                }
            } catch (error) {
                res.status(500).json('질문 조회를 실패하였습니다.')
            }

            break
        }

        case 'PATCH': {
            try {
                const { title, content, like } = req.body

                // 업데이트할 항목이 없는 경우
                if (
                    title === undefined &&
                    content === undefined &&
                    like === undefined
                ) {
                    return res
                        .status(400)
                        .json({ error: '업데이트할 항목이 없습니다.' })
                }

                // 질문의 답변이 있는지 확인
                const question = await prisma.question.findUnique({
                    where: { idx: Number(req.query.idx) },
                    include: {
                        Answer: true,
                    },
                })

                if (!question) {
                    return res.status(404).json('질문을 찾을 수 없습니다.')
                }

                // 답변이 달린 질문일 경우 제목이나 내용을 수정할 수 없음
                if (question.Answer.length > 0 && (title || content)) {
                    return res
                        .status(400)
                        .json('이미 답변이 달린 글은 수정할 수 없습니다.')
                }

                // 좋아요 수 증가 처리
                if (like) {
                    const updatedQuestion = await prisma.question.update({
                        where: { idx: Number(req.query.idx) },
                        data: { like: { increment: 1 } },
                    })

                    res.status(200).json(updatedQuestion)
                }

                // 제목 또는 내용 업데이트

                const updatedQuestion = await prisma.question.update({
                    where: { idx: Number(req.query.idx) },
                    data: { title, content },
                })

                res.status(200).json(updatedQuestion)
            } catch (error) {
                console.error(error)
                return res.status(500).json('질문 업데이트에 실패하였습니다.')
            }
            break
        }

        case 'DELETE': {
            try {
                await prisma.answer.deleteMany({
                    where: { questionIdx: Number(userIdx) },
                })

                await prisma.question.delete({
                    where: { idx: Number(userIdx) },
                })
                res.status(204).end()
            } catch (error) {
                res.status(500).json('삭제에 실패하였습니다.')
            }
            break
        }
        default:
            res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
            res.status(405).end(`해당 메소드가 존재하지 않습니다.`)
    }
}
