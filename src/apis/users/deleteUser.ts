import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
    // 해당 회원의 정보, 회원의 글, 회원 글의 답변 모두 삭제
    const { userIdx, questionIdx } = req.body
    const idx = Number(userIdx)

    try {
        await prisma.answer.deleteMany({
            where: {
                questionIdx: questionIdx,
            },
        })

        await prisma.question.deleteMany({
            where: {
                userIdx: idx,
            },
        })

        await prisma.user.delete({
            where: {
                idx: userIdx,
            },
        })
        return res.status(200).json({ message: '사용자 삭제에 성공했습니다.' })
    } catch (error) {
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
