import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req
    const { idx } = req.query
    const id = req.query.question

    if (!idx || isNaN(Number(idx))) {
        return res.status(400).json({ error: 'Invalid user id' })
    }

    switch (method) {
        case 'GET': {
            try {
                const user = await prisma.user.findUnique({
                    where: { idx: Number(idx) },
                })
                if (user) {
                    res.status(200).json(user)
                } else {
                    res.status(404).json({ error: 'User not found' })
                }
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch user' })
            }
            break
        }
        case 'PUT':
            try {
                const { name, phone } = req.body

                const updatedUser = await prisma.user.update({
                    where: { idx: Number(idx) },
                    data: { name, phone },
                })
                if (name || phone) {
                    res.status(200).json(updatedUser)
                } else {
                    res.status(400).json({
                        error: '이름과 번호만 수정 가능합니다.',
                    })
                }
            } catch (error) {
                res.status(500).json({ error: 'Failed to update user' })
            }
            break
        case 'DELETE':
            try {
                await prisma.user.deleteMany({
                    where: { idx: Number(idx) },
                })
                res.status(204).end()
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete user' })
            }
            break
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
