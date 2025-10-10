<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, Search, Table as TableIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface TableInfo {
  name: string;
  rows: number;
}

interface ColumnInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

const tables = ref<TableInfo[]>([]);
const selectedTable = ref<string>('');
const columns = ref<ColumnInfo[]>([]);
const rows = ref<any[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalRows = ref(0);

// Pagination
const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value));
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return rows.value.slice(start, end);
});

// Filter rows by search query
const filteredRows = computed(() => {
  if (!searchQuery.value) return paginatedRows.value;

  return paginatedRows.value.filter(row => {
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

// Load tables list
const loadTables = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/database/tables');
    const data = await response.json();

    if (data.success) {
      tables.value = data.tables;
    } else {
      toast({
        title: 'Error',
        description: data.error || 'Failed to load tables',
        variant: 'destructive'
      });
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to load tables',
      variant: 'destructive'
    });
  } finally {
    isLoading.value = false;
  }
};

// Load table data
const loadTableData = async (tableName: string) => {
  if (!tableName) return;

  isLoading.value = true;
  selectedTable.value = tableName;
  currentPage.value = 1;

  try {
    const response = await fetch(`/api/database/table/${tableName}`);
    const data = await response.json();

    if (data.success) {
      columns.value = data.columns;
      rows.value = data.rows;
      totalRows.value = data.rows.length;
    } else {
      toast({
        title: 'Error',
        description: data.error || 'Failed to load table data',
        variant: 'destructive'
      });
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to load table data',
      variant: 'destructive'
    });
  } finally {
    isLoading.value = false;
  }
};

// Refresh current table
const refreshTable = () => {
  if (selectedTable.value) {
    loadTableData(selectedTable.value);
  } else {
    loadTables();
  }
};

// Navigate pages
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  loadTables();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-7xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database class="h-8 w-8 text-primary" />
          Database Viewer
        </h1>
        <p class="text-muted-foreground mt-1">
          Browse and inspect database tables and records
        </p>
      </div>
      <Button @click="refreshTable" :disabled="isLoading" variant="outline">
        <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isLoading }" />
        Refresh
      </Button>
    </div>

    <!-- Table Selection -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <TableIcon class="h-5 w-5" />
          Select Table
        </CardTitle>
        <CardDescription>Choose a table to view its structure and data</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">Table</label>
            <Select v-model="selectedTable" @update:model-value="loadTableData">
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="table in tables" :key="table.name" :value="table.name">
                  {{ table.name }}
                  <Badge variant="secondary" class="ml-2">{{ table.rows }} rows</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Search</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="Search in table..."
                class="pl-9"
                :disabled="!selectedTable"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Table Structure -->
    <Card v-if="selectedTable && columns.length > 0">
      <CardHeader>
        <CardTitle>Table Structure: {{ selectedTable }}</CardTitle>
        <CardDescription>Column definitions and constraints</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Null</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Extra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="column in columns" :key="column.Field">
                <TableCell class="font-medium">{{ column.Field }}</TableCell>
                <TableCell>
                  <Badge variant="outline">{{ column.Type }}</Badge>
                </TableCell>
                <TableCell>{{ column.Null }}</TableCell>
                <TableCell>
                  <Badge v-if="column.Key" variant="secondary">{{ column.Key }}</Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  {{ column.Default || '-' }}
                </TableCell>
                <TableCell class="text-muted-foreground">{{ column.Extra || '-' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Table Data -->
    <Card v-if="selectedTable && rows.length > 0">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Table Data</CardTitle>
            <CardDescription>{{ totalRows }} total records</CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <span class="text-sm text-muted-foreground">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <Button
              variant="outline"
              size="sm"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead v-for="column in columns" :key="column.Field">
                  {{ column.Field }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="filteredRows.length === 0">
                <TableCell :colspan="columns.length" class="text-center text-muted-foreground py-8">
                  No records found
                </TableCell>
              </TableRow>
              <TableRow v-for="(row, index) in filteredRows" :key="index">
                <TableCell v-for="column in columns" :key="column.Field" class="max-w-xs truncate">
                  <span v-if="row[column.Field] === null" class="text-muted-foreground italic">
                    NULL
                  </span>
                  <span v-else>{{ row[column.Field] }}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <Card v-if="!selectedTable">
      <CardContent class="py-12">
        <div class="text-center">
          <Database class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 class="text-lg font-medium mb-2">No Table Selected</h3>
          <p class="text-muted-foreground">
            Select a table from the dropdown above to view its data
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
