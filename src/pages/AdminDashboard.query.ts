import { queryOptions } from '@tanstack/react-query'

import { fetchAdminEvaluationTasks } from '@/api/evaluation'
import { fetchOperationalOverview } from '@/api/overview'

export const adminDashboardKeys = {
  all: ['admin-dashboard'] as const,
  overview: () => [...adminDashboardKeys.all, 'overview'] as const,
}

export function adminDashboardQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: adminDashboardKeys.overview(),
    enabled,
    queryFn: async () => {
      const [evalRows, overview] = await Promise.all([
        // 运营总览只需要最近任务，不拉大页数据。
        fetchAdminEvaluationTasks({ pageSize: 10, pageCurrent: 1 }),
        fetchOperationalOverview(),
      ])
      return { evalRows, overview }
    },
  })
}
