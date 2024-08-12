import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { withSwagger } from 'next-swagger-doc'
import { sign, verify } from 'jsonwebtoken' //JWT

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
    const hashedPassword = user.password
    // user.password : 해쉬화 된 비밀번호 값이 저장
    // 보안 상 db에는 원본으로 저장되면 안 되기 때문
    // password : 원본 비밀번호 값 저장
    const isCollect = await compare(password, hashedPassword)
    if (isCollect !== true) {
        return res
            .status(400)
            .json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    const payload = {
        name: user.name,
        idx: user.idx,
        createAt: user.createdAt,
        updateAt: user.updatedAt,
    }
    // sign : 토큰 만들기
    const token = await sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    })
    res.status(200).json({ status: 'success', token })
}
