'use client'

import '@/src/styles/swagger-dark.css'
import dynamic from 'next/dynamic'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function SwaggerUIWrapper() {
  return (
    <div className="swagger-dark">
      <SwaggerUI
        url="/openapi.json"
        docExpansion="none"
        defaultModelsExpandDepth={-1}
        displayRequestDuration
      />
    </div>
  )
}
