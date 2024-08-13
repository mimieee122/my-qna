import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')

const secretKey = 'mySecretKey'

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: 회원가입
 *     requestBody:
 *       required: true

 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일 주소
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호 (최소 6자)
 *     responses:
 *       200:
 *         description: 회원가입 완료!
 *       400:
 *         description: 회원가입 에러
 */

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password, email, phone } = req.body

    if (!name || !password || !email) {
        return res.status(400).json({
            message: '이름, 비밀번호,이메일 모두 작성하세요.',
        })
    }

    const hashedPassword = await hash(password, 10)

    const users = await prisma.user.create({
        data: {
            password: hashedPassword,
            email: email,
            name: name,
            phone: phone || null,
        },
    })

    // JWT 생성
    const token = jwt.sign({ id: users.idx, email: users.email }, secretKey, {
        expiresIn: '1h',
    })

    res.status(200).json({ status: 'success', idx: users.idx, token })
}
