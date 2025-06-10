<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">DataTable Example</h2>
      <p class="text-muted-foreground">
        A refined data table component with advanced filtering, sorting, and pagination.
      </p>
    </div>

    <DataTable
      :data="sampleData"
      :columns="columns"
      :loading="loading"
      show-numbering
      show-filters
      search-placeholder="Search users..."
      empty-state-title="No users found"
      empty-state-description="Try adjusting your search or filter criteria."
      @row:click="handleRowClick"
      @update:sort="handleSort"
      @update:filters="handleFilters"
    >
      <!-- Custom cell for status -->
      <template #cell-status="{ value }">
        <Badge :variant="getStatusVariant(value)">
          {{ value }}
        </Badge>
      </template>

      <!-- Custom cell for actions -->
      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <Button size="sm" variant="ghost" @click.stop="editUser(item)">
            <Edit class="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" @click.stop="deleteUser(item)">
            <Trash2 class="h-3 w-3" />
          </Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-vue-next'
import type { DataTableColumn } from '@/components/ui/data-table/types'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  salary: number
}

const loading = ref(false)

const sampleData = ref<User[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T09:00:00Z',
    salary: 75000
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-07-15T14:30:00Z',
    salary: 65000
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Moderator',
    status: 'inactive',
    lastLogin: '2024-01-10T08:15:00Z',
    createdAt: '2023-05-20T11:00:00Z',
    salary: 70000
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    status: 'pending',
    lastLogin: '2024-01-12T12:00:00Z',
    createdAt: '2023-08-10T16:45:00Z',
    salary: 60000
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-16T09:30:00Z',
    createdAt: '2023-04-05T10:15:00Z',
    salary: 80000
  }
])

const columns = computed<DataTableColumn<User>[]>(() => [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    filterable: true,
    width: '200px'
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
    filterable: true,
    width: '250px'
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
    filterable: true,
    width: '120px'
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    filterable: true,
    width: '100px',
    align: 'center'
  },
  {
    key: 'lastLogin',
    title: 'Last Login',
    sortable: true,
    format: 'datetime',
    width: '180px'
  },
  {
    key: 'createdAt',
    title: 'Created',
    sortable: true,
    format: 'date',
    width: '120px'
  },
  {
    key: 'salary',
    title: 'Salary',
    sortable: true,
    format: 'currency',
    width: '120px',
    align: 'right'
  },
  {
    key: 'actions',
    title: 'Actions',
    width: '100px',
    align: 'center'
  }
])

function getStatusVariant(status: string) {
  switch (status) {
    case 'active':
      return 'default'
    case 'inactive':
      return 'secondary'
    case 'pending':
      return 'outline'
    default:
      return 'secondary'
  }
}

function handleRowClick(item: User, index: number) {
  console.log('Row clicked:', item, 'at index:', index)
}

function handleSort(column: string | null, direction: 'asc' | 'desc' | null) {
  console.log('Sort changed:', column, direction)
}

function handleFilters(filters: Record<string, string>) {
  console.log('Filters changed:', filters)
}

function editUser(user: User) {
  console.log('Edit user:', user)
}

function deleteUser(user: User) {
  console.log('Delete user:', user)
}

// Simulate loading
function toggleLoading() {
  loading.value = !loading.value
  if (loading.value) {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
}
</script> 