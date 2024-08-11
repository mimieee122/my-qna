import { create } from 'domain'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAnswer } from '@/apis/questions/answers/getAnswer'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'GET') {
            await getAnswer(req, res)
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch {
        return res.status(500).json({ message: '오류입니다.' })
    }
}

export default handler
