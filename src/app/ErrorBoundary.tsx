import { TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'

export function AppErrorBoundary() {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || '页面错误'}`
    : '页面加载失败'
  const description =
    error instanceof Error ? error.message : '页面发生了未预期的错误，请返回首页后重试。'

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert className="size-5" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <Button className="mt-6" onClick={() => (window.location.hash = '#/')}>
          返回首页
        </Button>
      </div>
    </main>
  )
}
