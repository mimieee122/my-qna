//api-doc.tsx: Swagger UI를 사용하여 API 문서를 클라이언트에서 보여주는 컴포넌트를 정의합니다.
// doc.ts: Swagger 문서의 설정을 정의하고, API 문서를 생성하는 역할을 합니다.

import { withSwagger } from 'next-swagger-doc'

const swaggerHandler = withSwagger({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NextJS Swagger',
            version: '0.1.0',
        },
    },
    apiFolder: 'src',
})

export default swaggerHandler()
