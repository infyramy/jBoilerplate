<template>
  <div class="space-y-4">

    <!-- Table Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="page-size" class="text-sm font-medium">Rows per page:</label>
          <Select v-model="currentPageSize">
            <SelectTrigger class="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="size in pageSizeOptions"
                :key="size"
                :value="size.toString()"
              >
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="text-sm text-muted-foreground">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
      </div>
    </div>

    <!-- Table Container -->
    <div class="relative">
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center"
      >
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 class="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>

      <!-- Table -->
      <div class="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead v-if="showNumbering" class="w-12 text-center">#</TableHead>
              <TableHead
                v-for="column in columns"
                :key="column.key"
                :class="cn(
                  'select-none',
                  column.headerClass,
                  column.width && `w-[${column.width}]`,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )"
              >
                <div
                  :class="cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )"
                >
                  <span>{{ column.title }}</span>
                  <Button
                    v-if="column.sortable"
                    @click="toggleSort(column.key)"
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0 hover:bg-muted"
                  >
                    <ArrowUpDown
                      v-if="sortColumn !== column.key"
                      class="h-3 w-3 text-muted-foreground"
                    />
                    <ArrowUp
                      v-else-if="sortDirection === 'asc'"
                      class="h-3 w-3 text-primary"
                    />
                    <ArrowDown
                      v-else
                      class="h-3 w-3 text-primary"
                    />
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(item, index) in paginatedData"
              :key="getRowKey(item, index)"
              class="cursor-pointer hover:bg-muted/50 transition-colors"
              @click="$emit('row:click', item, startIndex + index)"
            >
              <TableCell
                v-if="showNumbering"
                class="text-center text-sm text-muted-foreground font-mono"
              >
                {{ startIndex + index + 1 }}
              </TableCell>
              <TableCell
                v-for="column in columns"
                :key="column.key"
                :class="cn(
                  column.cellClass,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :value="getNestedValue(item, column.key)"
                  :index="startIndex + index"
                >
                  <component
                    v-if="column.render"
                    :is="column.render"
                    :item="item"
                    :value="getNestedValue(item, column.key)"
                    :index="startIndex + index"
                  />
                  <span v-else class="text-sm">
                    {{ formatValue(getNestedValue(item, column.key), column.format) }}
                  </span>
                </slot>
              </TableCell>
            </TableRow>

            <!-- Empty State -->
            <TableRow v-if="paginatedData.length === 0 && !loading">
              <TableCell :colspan="totalColumns" class="h-32">
                <div class="flex flex-col items-center justify-center text-center">
                  <slot name="empty-state">
                    <div class="flex flex-col items-center gap-2">
                      <FileX class="h-8 w-8 text-muted-foreground" />
                      <div class="space-y-1">
                        <h3 class="text-sm font-medium">
                          {{ emptyStateTitle || 'No data available' }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                          {{ emptyStateDescription || 'There are no records to display at the moment.' }}
                        </p>
                      </div>
                    </div>
                  </slot>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="border-t bg-background px-4 py-3 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Page Info -->
        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Page <span class="font-medium text-foreground">{{ currentPage }}</span> of 
            <span class="font-medium text-foreground">{{ totalPages }}</span>
          </div>
          <div class="hidden sm:block text-sm text-muted-foreground">
            {{ filteredData.length }} total {{ filteredData.length === 1 ? 'item' : 'items' }}
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-center gap-2">
          <!-- First Page -->
          <Button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            variant="outline"
            size="sm"
            class="h-9 w-9 p-0"
            title="First page"
          >
            <ChevronsLeft class="h-4 w-4" />
          </Button>

          <!-- Previous Page -->
          <Button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            variant="outline"
            size="sm"
            class="h-9 w-9 p-0"
            title="Previous page"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <!-- Show ellipsis if there are pages before visible range -->
            <span v-if="visiblePages[0] > 1" class="px-2 text-sm text-muted-foreground">...</span>
            
            <Button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :variant="page === currentPage ? 'default' : 'outline'"
              size="sm"
              class="h-9 w-9 p-0 font-medium"
              :class="{
                'bg-primary text-primary-foreground shadow hover:bg-primary/90': page === currentPage,
                'hover:bg-accent hover:text-accent-foreground': page !== currentPage
              }"
            >
              {{ page }}
            </Button>
            
            <!-- Show ellipsis if there are pages after visible range -->
            <span v-if="visiblePages[visiblePages.length - 1] < totalPages" class="px-2 text-sm text-muted-foreground">...</span>
          </div>

          <!-- Next Page -->
          <Button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            variant="outline"
            size="sm"
            class="h-9 w-9 p-0"
            title="Next page"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>

          <!-- Last Page -->
          <Button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            variant="outline"
            size="sm"
            class="h-9 w-9 p-0"
            title="Last page"
          >
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>

        <!-- Quick Jump (for larger datasets) -->
        <div v-if="totalPages > 10" class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Go to:</span>
          <Select v-model="jumpToPage" @update:model-value="handlePageJump">
            <SelectTrigger class="w-20 h-9">
              <SelectValue :placeholder="currentPage.toString()" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1)"
                :key="page"
                :value="page.toString()"
              >
                {{ page }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileX,
  Loader2,
} from "lucide-vue-next";
import type { DataTableColumn, DataTableProps, DataTableEmits } from "@/components/ui/data-table/types";

const props = withDefaults(defineProps<{
  data: T[]
  columns: DataTableColumn<T>[]
  showNumbering?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  rowKey?: string | ((item: T, index: number) => string | number)
  loading?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
}>(), {
  showNumbering: true,
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 25, 50, 100],
  rowKey: "id",
  loading: false,
});

const emit = defineEmits<DataTableEmits>();

// Reactive state
const currentPage = ref(1);
const currentPageSize = ref(props.pageSize.toString());
const sortColumn = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc" | null>(null);
const jumpToPage = ref("");

// Computed properties
const filteredData = computed(() => {
  let result = [...props.data];

  // Apply sorting
  if (sortColumn.value && sortDirection.value) {
    result.sort((a, b) => {
      const aValue = getNestedValue(a, sortColumn.value!);
      const bValue = getNestedValue(b, sortColumn.value!);

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection.value === "desc" ? -comparison : comparison;
    });
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / parseInt(currentPageSize.value))
);

const startIndex = computed(
  () => (currentPage.value - 1) * parseInt(currentPageSize.value)
);

const endIndex = computed(() =>
  Math.min(
    startIndex.value + parseInt(currentPageSize.value),
    filteredData.value.length
  )
);

const paginatedData = computed(() =>
  filteredData.value.slice(startIndex.value, endIndex.value)
);

const totalColumns = computed(
  () => props.columns.length + (props.showNumbering ? 1 : 0)
);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

const getRowKey = (item: T, index: number): string | number => {
  if (typeof props.rowKey === "function") {
    return props.rowKey(item, index);
  }
  return getNestedValue(item, props.rowKey) || index;
};

const formatValue = (value: any, format?: string): string => {
  if (value == null) return "";

  switch (format) {
    case "date":
      return new Date(value).toLocaleDateString();
    case "datetime":
      return new Date(value).toLocaleString();
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case "number":
      return new Intl.NumberFormat().format(value);
    default:
      return String(value);
  }
};

const toggleSort = (column: string) => {
  if (sortColumn.value === column) {
    if (sortDirection.value === "asc") {
      sortDirection.value = "desc";
    } else if (sortDirection.value === "desc") {
      sortColumn.value = null;
      sortDirection.value = null;
    }
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }

  emit("update:sort", sortColumn.value, sortDirection.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emit("update:page", page);
  }
};

const handlePageJump = (value: any) => {
  if (!value) return;
  const page = typeof value === 'string' ? parseInt(value) : value;
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page);
    jumpToPage.value = "";
  }
};

// Watchers
watch(currentPageSize, (newSize) => {
  currentPage.value = 1;
  emit("update:pageSize", parseInt(newSize));
});
</script>
