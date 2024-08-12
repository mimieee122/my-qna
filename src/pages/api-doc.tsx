//api-doc.tsx: Swagger UI를 사용하여 API 문서를 클라이언트에서 보여주는 컴포넌트를 정의합니다.

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

function ApiDoc() {
    return <SwaggerUI url="/api/doc" />
}

export default ApiDoc
