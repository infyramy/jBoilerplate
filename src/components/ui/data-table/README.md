# DataTable Component

A refined, feature-rich data table component built with Vue 3, TypeScript, and Tailwind CSS. This component provides advanced functionality including global search, column filtering, sorting, pagination, and customizable cell rendering.

## Features

- ✨ **Modern Design**: Clean, responsive design following the project's design system
- 🔍 **Global Search**: Search across all columns with a single input
- 🎯 **Column Filtering**: Individual filters for each filterable column
- 📊 **Sorting**: Click column headers to sort data (asc/desc/none)
- 📄 **Pagination**: Configurable page sizes with elegant pagination controls
- 🔢 **Row Numbering**: Optional row numbering with toggle
- 🎨 **Custom Rendering**: Slot-based custom cell rendering
- 📱 **Responsive**: Mobile-friendly design with proper breakpoints
- ⚡ **Loading States**: Built-in loading overlay
- 🎭 **Empty States**: Customizable empty state messages
- 🎪 **Row Interactions**: Click handlers and hover effects
- 🔧 **TypeScript**: Full TypeScript support with proper type definitions

## Basic Usage

```vue
<template>
  <DataTable
    :data="users"
    :columns="columns"
    show-numbering
    show-filters
    search-placeholder="Search users..."
  />
</template>

<script setup lang="ts">
import { DataTable } from '@/components/ui/data-table'
import type { DataTableColumn } from '@/components/ui/data-table/types'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  // ... more users
])

const columns: DataTableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    filterable: true
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
    filterable: true
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    filterable: true,
    align: 'center'
  }
]
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **Required** | Array of data objects to display |
| `columns` | `DataTableColumn<T>[]` | **Required** | Column definitions |
| `showNumbering` | `boolean` | `true` | Show row numbering column |
| `showFilters` | `boolean` | `true` | Show search and filter controls |
| `pageSize` | `number` | `10` | Number of rows per page |
| `pageSizeOptions` | `number[]` | `[5, 10, 25, 50, 100]` | Available page size options |
| `rowKey` | `string \| function` | `"id"` | Unique key for each row |
| `loading` | `boolean` | `false` | Show loading overlay |
| `emptyStateTitle` | `string` | `"No data available"` | Empty state title |
| `emptyStateDescription` | `string` | `"There are no records to display at the moment."` | Empty state description |
| `searchPlaceholder` | `string` | `"Search across all columns..."` | Global search placeholder |

## Column Definition

```typescript
interface DataTableColumn<T = any> {
  key: string                    // Property key from data object
  title: string                  // Column header text
  sortable?: boolean            // Enable sorting for this column
  filterable?: boolean          // Enable filtering for this column
  headerClass?: string          // CSS classes for header cell
  cellClass?: string            // CSS classes for data cells
  format?: 'date' | 'datetime' | 'currency' | 'number' | string
  render?: Component            // Custom render component
  width?: string               // Column width (e.g., '200px')
  align?: 'left' | 'center' | 'right'  // Text alignment
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | Current page changed |
| `update:pageSize` | `number` | Page size changed |
| `update:sort` | `string \| null, 'asc' \| 'desc' \| null` | Sort column/direction changed |
| `update:filters` | `Record<string, string>` | Column filters changed |
| `row:click` | `item: T, index: number` | Row clicked |
| `row:select` | `item: T, selected: boolean` | Row selection changed |

## Custom Cell Rendering

Use named slots to customize cell rendering:

```vue
<template>
  <DataTable :data="users" :columns="columns">
    <!-- Custom status cell -->
    <template #cell-status="{ value, item, index }">
      <Badge :variant="getStatusVariant(value)">
        {{ value }}
      </Badge>
    </template>

    <!-- Custom actions cell -->
    <template #cell-actions="{ item }">
      <div class="flex gap-2">
        <Button size="sm" @click="editUser(item)">Edit</Button>
        <Button size="sm" variant="destructive" @click="deleteUser(item)">Delete</Button>
      </div>
    </template>
  </DataTable>
</template>
```

## Advanced Example

```vue
<template>
  <DataTable
    :data="users"
    :columns="columns"
    :loading="loading"
    show-numbering
    show-filters
    search-placeholder="Search users..."
    empty-state-title="No users found"
    empty-state-description="Try adjusting your search criteria."
    @row:click="handleRowClick"
    @update:sort="handleSort"
    @update:filters="handleFilters"
  >
    <template #cell-avatar="{ item }">
      <Avatar class="h-8 w-8">
        <AvatarImage :src="item.avatar" :alt="item.name" />
        <AvatarFallback>{{ getInitials(item.name) }}</AvatarFallback>
      </Avatar>
    </template>

    <template #cell-status="{ value }">
      <Badge :variant="getStatusVariant(value)">
        <Circle class="w-2 h-2 mr-1" :class="getStatusColor(value)" />
        {{ value }}
      </Badge>
    </template>

    <template #empty-state>
      <div class="text-center py-12">
        <Users class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">No users found</h3>
        <p class="text-muted-foreground mb-4">
          Get started by adding your first user.
        </p>
        <Button @click="addUser">Add User</Button>
      </div>
    </template>
  </DataTable>
</template>
```

## Formatting

The component supports built-in formatting for common data types:

- `date`: Formats as locale date string
- `datetime`: Formats as locale date and time string
- `currency`: Formats as USD currency
- `number`: Formats with locale number formatting

```typescript
const columns: DataTableColumn<User>[] = [
  {
    key: 'createdAt',
    title: 'Created',
    format: 'date',
    sortable: true
  },
  {
    key: 'lastLogin',
    title: 'Last Login',
    format: 'datetime',
    sortable: true
  },
  {
    key: 'salary',
    title: 'Salary',
    format: 'currency',
    sortable: true,
    align: 'right'
  }
]
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system. Key design features:

- **Modern Card Design**: Rounded borders with subtle shadows
- **Hover Effects**: Smooth transitions on row hover
- **Responsive Layout**: Adapts to different screen sizes
- **Consistent Spacing**: Proper padding and margins throughout
- **Accessible Colors**: High contrast text and proper color usage
- **Loading States**: Elegant loading overlay with backdrop blur
- **Empty States**: Thoughtful empty state design with icons

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Focus management

## Performance

- Efficient virtual scrolling for large datasets
- Optimized re-renders with computed properties
- Lazy loading support
- Memory efficient pagination 