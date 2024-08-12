import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteUser } from '@/apis/users/deleteUser'
import { updateUser } from '@/apis/users/updateUser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { idx } = req.query
    const userIdx = Number(idx)

    // userIdx 데이터 베이스에 존재하는지 확인
    const user = await prisma.user.findUnique({
        where: {
            idx: userIdx,
        },
    })
    if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    try {
        if (req.method === 'PUT') {
            // 회원 수정
            await updateUser(userIdx, req, res)
        } else if (req.method === 'DELETE') {
            await deleteUser(req, res)
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
