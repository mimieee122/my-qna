import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import SwaggerUI from 'swagger-ui-react'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken' // jwt 직접 임포트
import swaggerHandler from './../../pages/api/doc'

const prisma = new PrismaClient()

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
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일 주소
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호 (최소 6자)
 *               phone:
 *                 type: string
 *                 description: 사용자 전화번호 (선택 사항)
 *     responses:
 *       200:
 *         description: 회원가입 완료!
 *       400:
 *         description: 회원가입 에러
 */

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { name, password, email, phone } = req.body

        if (!name || !password || !email) {
            return res.status(400).json({
                message: '이름, 비밀번호, 이메일 모두 작성하세요.',
            })
        }

        // 비밀번호 해시화
        const hashedPassword = await hash(password, 10)

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                email: email,
                name: name,
                phone: phone,
            },
        })

        // JWT 생성
        const token = sign(
            { idx: user.idx, email: user.email },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '1h',
            }
        )

        res.status(200).json({ status: 'success', idx: user.idx, token })
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}
