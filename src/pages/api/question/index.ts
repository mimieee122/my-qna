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
                const questions = await prisma.question.findMany({
                    include: {
                        whichuser: true,
                        Answer: true,
                    },
                })
                res.status(200).json(questions)
            } catch (error) {
                res.status(500).json('파일 조회를 실패했습니다.')
            }
            break

        case 'POST':
            try {
                const { title, content, userIdx, like } = req.body

                if (!title || !content || userIdx == undefined) {
                    return res.status(400).json('필수 항목을 입력하세요')
                }

                if (title.length < 2 || content.length < 3) {
                    return res
                        .status(400)
                        .json(
                            '제목은 두 글자 이상, 내용은 세 글자 이상으로 작성하세요.'
                        )
                }
                const newQuestion = await prisma.question.create({
                    data: {
                        title,
                        content,
                        userIdx: Number(userIdx),
                        like,
                    },
                })
                res.status(200).json(newQuestion)
            } catch (error) {
                res.status(500).json('질문 생성에 실패하였습니다.')
            }
            break
        default: {
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end('다른 메소드를 사용하세요.')
        }
    }
}
