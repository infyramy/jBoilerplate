<template>
  <Card class="mb-4">
    <CardHeader class="pb-2">
      <div class="flex items-center gap-2">
        <Badge class="font-mono" :variant="methodColor">{{ method }}</Badge>
        <CardTitle class="font-mono text-base">{{ endpoint }}</CardTitle>
      </div>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Parameters -->
      <div v-if="parameters && parameters.length > 0" class="mb-6">
        <h3 class="text-sm font-semibold mb-2">Parameters</h3>
        <div class="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[150px]">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead class="text-center">Required</TableHead>
                <TableHead class="text-center">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="param in parameters" :key="param.name">
                <TableCell class="font-mono text-xs">{{ param.name }}</TableCell>
                <TableCell class="text-xs">{{ param.type }}</TableCell>
                <TableCell class="text-xs">{{ param.description }}</TableCell>
                <TableCell class="text-center">
                  <Check v-if="param.required" class="h-4 w-4 mx-auto text-green-500" />
                  <X v-else class="h-4 w-4 mx-auto text-muted-foreground" />
                </TableCell>
                <TableCell class="text-center text-xs">{{ param.in || 'body' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      
      <!-- Example Request -->
      <div v-if="exampleRequest" class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-semibold">Example Request</h3>
          <Button variant="ghost" size="sm" class="h-6 px-2" @click="copyToClipboard(JSON.stringify(exampleRequest, null, 2))">
            <Copy class="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>
        <pre class="text-xs bg-muted p-3 rounded font-mono overflow-auto max-h-[250px]">{{ JSON.stringify(exampleRequest, null, 2) }}</pre>
      </div>
      
      <!-- Example Response -->
      <div v-if="exampleResponse">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-semibold">Example Response</h3>
          <Button variant="ghost" size="sm" class="h-6 px-2" @click="copyToClipboard(JSON.stringify(exampleResponse, null, 2))">
            <Copy class="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>
        <pre class="text-xs bg-muted p-3 rounded font-mono overflow-auto max-h-[250px]">{{ JSON.stringify(exampleResponse, null, 2) }}</pre>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Copy } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  in?: string;
}

interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  parameters?: Parameter[];
  exampleRequest?: any;
  exampleResponse?: any;
}

const props = withDefaults(defineProps<Props>(), {
  parameters: () => [],
  exampleRequest: undefined,
  exampleResponse: undefined,
});

// Determine method color
const methodColor = computed(() => {
  switch (props.method) {
    case 'GET':
      return 'default';
    case 'POST':
      return 'secondary';
    case 'PUT':
    case 'PATCH':
      return 'outline';
    case 'DELETE':
      return 'destructive';
    default:
      return 'outline';
  }
});

// Copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 