'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { LogFilters } from '@/lib/types'

function filtersToParams(filters?: LogFilters): Record<string, string> {
  if (!filters) return {}

  const params: Record<string, string> = {}

  if (filters.page) params.page = String(filters.page)
  if (filters.page_size) params.page_size = String(filters.page_size)
  if (filters.severity) params.severity = filters.severity
  if (filters.source) params.source = filters.source
  if (filters.search) params.search = filters.search
  if (filters.start_date) params.start_date = filters.start_date
  if (filters.end_date) params.end_date = filters.end_date
  if (filters.sort_by) params.sort_by = filters.sort_by
  if (filters.sort_order) params.sort_order = filters.sort_order

  return params
}

export function useLogs(filters?: LogFilters) {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: () => api.listLogs(filtersToParams(filters)),
  })
}

export function useLog(id: string) {
  return useQuery({
    queryKey: ['log', id],
    queryFn: () => api.getLog(id),
    enabled: !!id,
  })
}

export function useCreateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] })
    },
  })
}

export function useUpdateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.updateLog(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['logs'] })
      queryClient.invalidateQueries({ queryKey: ['log', id] })
    },
  })
}

export function useDeleteLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] })
    },
  })
}

export function useAggregate(filters?: LogFilters) {
  return useQuery({
    queryKey: ['aggregate', filters],
    queryFn: () => api.getAggregate(filtersToParams(filters)),
  })
}

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: () => api.getSources(),
  })
}

export function useIngestLogs() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.ingestLogs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] })
      queryClient.invalidateQueries({ queryKey: ['aggregate'] })
    },
  })
}
