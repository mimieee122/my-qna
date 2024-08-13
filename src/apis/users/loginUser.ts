import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { withSwagger } from 'next-swagger-doc'
// import { sign, verify } from 'jsonwebtoken'

const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, password } = req.body
    if (!name || !password) {
        return res.status(400).json({ message: '이름, 비밀번호 필요합니다.' })
    }
    const user = await prisma.user.findFirst({
        where: {
            name: name,
        },
    })
    if (user === null) {
        return res
            .status(400)
            .json({ message: '해당 이름에 해당하는 유저가 없습니다.' })
    }

    // user.password : 해쉬화 된 비밀번호 값이 저장
    // 보안 상 db에는 원본으로 저장되면 안 되기 때문
    // password : 원본 비밀번호 값 저장
    const isCorrect = await compare(password, user.password)
    if (!isCorrect) {
        return res
            .status(400)
            .json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    // 환경변수 검증
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
        throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.')
    }

    const payload = {
        name: user.name,
        idx: user.idx,
        createAt: user.createdAt,
        updateAt: user.updatedAt,
    }
    // JWT 생성
    const token = jwt.sign(payload, secretKey, {
        expiresIn: '1h',
    })
    res.status(200).json({ status: 'success', token })
}

/**
 * @swagger
 * /api/login:
 *   post:
 *     description: 로그인
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
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공!
 *       400:
 *         description: 입력 정보 오류
 *       500:
 *         description: 서버 오류
 */
