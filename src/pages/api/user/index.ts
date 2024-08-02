// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const users = await prisma.user.findMany({
                    include: {
                        Question: true,
                        Answer: true,
                    },
                })
                res.status(200).json(users)
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch users' })
            }
            break
        case 'POST':
            try {
                const { email, password, name, phone } = req.body

                // 이메일 형식 검증
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(email)) {
                    return res
                        .status(400)
                        .json({ error: '유효한 이메일 주소를 입력해주세요.' })
                }

                if (!email || !password || !phone) {
                    return res
                        .status(400)
                        .json({ error: 'Missing required fields' })
                }

                const newUser = await prisma.user.create({
                    data: { email, password, name, phone },
                })
                res.status(201).json(newUser)
            } catch (error) {
                res.status(500).json({ error: 'Failed to create user' })
            }
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
