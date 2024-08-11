import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { likeQuestion } from '@/apis/questions/likeQuestion'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { idx } = req.query

    const questionIdx = Number(idx)

    try {
        if (req.method === 'POST') {
            // 답변 좋아요
            await likeQuestion(questionIdx, req, res)
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
