import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateAnswer } from '@/apis/questions/answers/updateAnswer'
import { deleteAnswer } from '@/apis/questions/answers/deleteAnswer'
import { getoneAnswer } from '@/apis/questions/answers/getoneAnswer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { idx } = req.query
    const questionIdx = Number(idx)

    try {
        if (req.method === 'PUT') {
            // 답변 수정
            await updateAnswer(questionIdx, req, res)
        } else if (req.method === 'DELETE') {
            // 답변 삭제
            await deleteAnswer(req, res)
        } else if (req.method === 'GET') {
            await getoneAnswer(questionIdx, req, res)
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
