import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getoneQuestion } from '@/apis/questions/getoneQuestion'
import { updateQuestion } from '@/apis/questions/updateQuestion'
import { deleteQuestion } from '@/apis/questions/deleteQuestion'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { idx } = req.query
    const idxStr = Array.isArray(idx) ? idx[0] : idx
    if (
        !idxStr ||
        isNaN(parseInt(idxStr, 10)) ||
        parseInt(idxStr, 10).toString() !== idxStr
    ) {
        return res.status(400).json({ message: '유효하지 않은 idx입니다.' })
    }
    const questionIdx = parseInt(idxStr, 10)

    // questionIdx 데이터 베이스에 존재하는지 확인
    const question = await prisma.question.findUnique({
        where: {
            idx: questionIdx,
        },
    })
    if (!question) {
        return res.status(404).json({ message: '질문을 찾을 수 없습니다.' })
    }
    try {
        if (req.method === 'GET') {
            // 질문 상세 조회
            await getoneQuestion(questionIdx, req, res)
        } else if (req.method === 'PUT') {
            // 질문 수정
            await updateQuestion(questionIdx, req, res)
        } else if (req.method === 'DELETE') {
            // 질문 삭제
            await deleteQuestion(req, res)
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
