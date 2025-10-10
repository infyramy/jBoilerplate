import type { Component } from 'vue'

export interface DataTableColumn<T = any> {
  key: string
  title: string
  sortable?: boolean
  filterable?: boolean
  headerClass?: string
  cellClass?: string
  format?: 'date' | 'datetime' | 'currency' | 'number' | string
  render?: Component
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[]
  columns: DataTableColumn<T>[]
  showNumbering?: boolean
  showFilters?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  rowKey?: string | ((item: T, index: number) => string | number)
  loading?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  searchPlaceholder?: string
}

export interface DataTableEmits {
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  'update:sort': [column: string | null, direction: 'asc' | 'desc' | null]
  'update:filters': [filters: Record<string, string>]
  'row:click': [item: any, index: number]
  'row:select': [item: any, selected: boolean]
} 