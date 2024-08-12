import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@/apis/users/createUser'
import { verify } from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        verify(req.cookies.token!, process.env.JWT_SECRET as string)
    } catch {
        return res.status(400).json({ message: '토큰이 올바르지 않습니다.' })
    }
    try {
        if (req.method === 'POST') {
            // 회원가입
            await createUser(req, res)
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
