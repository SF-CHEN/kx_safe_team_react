import { queryOptions } from '@tanstack/react-query'

import {
  fetchMyResourceTasks,
  type FetchMyResourceTasksQuery,
} from '@/api/evaluation/myList'
import { fetchDepthModelDropdown } from '@/api/model'
import { fetchMyTaskOverview } from '@/api/overview'

export const resourceCenterKeys = {
  all: ['resource-center'] as const,
  tasks: (query: FetchMyResourceTasksQuery) => [...resourceCenterKeys.all, 'tasks', query] as const,
  overview: (userId: number) => [...resourceCenterKeys.all, 'overview', userId] as const,
  models: (userId: number) => [...resourceCenterKeys.all, 'models', userId] as const,
}

export function resourceTasksQueryOptions(
  query: FetchMyResourceTasksQuery,
  enabled: boolean,
) {
  return queryOptions({
    queryKey: resourceCenterKeys.tasks(query),
    queryFn: () => fetchMyResourceTasks(query),
    enabled,
    placeholderData: (previousData) => previousData,
  })
}

export function resourceOverviewQueryOptions(userId: number, enabled: boolean) {
  return queryOptions({
    queryKey: resourceCenterKeys.overview(userId),
    queryFn: fetchMyTaskOverview,
    enabled,
  })
}

export function resourceModelsQueryOptions(userId: number, enabled: boolean) {
  return queryOptions({
    queryKey: resourceCenterKeys.models(userId),
    queryFn: fetchDepthModelDropdown,
    enabled,
    staleTime: 60_000,
  })
}
