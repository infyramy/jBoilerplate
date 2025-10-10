# jBoilerplate Components

This document provides documentation for the UI components included in jBoilerplate.

## Table of Contents

- [UI Components](#ui-components)
  - [Accordion](#accordion)
  - [Alert](#alert)
  - [Alert Dialog](#alert-dialog)
  - [Avatar](#avatar)
  - [Badge](#badge)
  - [Button](#button)
  - [Calendar](#calendar)
  - [Card](#card)
  - [Checkbox](#checkbox)
  - [Data Table](#data-table)
  - [Date Picker](#date-picker)
  - [Dialog](#dialog)
  - [Dropdown Menu](#dropdown-menu)
  - [Input](#input)
  - [Select](#select)
  - [Tabs](#tabs)
  - [Tooltip](#tooltip)
- [Layout Components](#layout-components)
  - [Admin Layout](#admin-layout)
  - [Dashboard Layout](#dashboard-layout)
  - [Main Layout](#main-layout)
- [Form Components](#form-components)
  - [Form](#form)
  - [Form Field](#form-field)
  - [Form Error](#form-error)
- [Data Visualization](#data-visualization)
  - [Bar Chart](#bar-chart)
  - [Line Chart](#line-chart)
  - [Donut Chart](#donut-chart)
  - [Area Chart](#area-chart)

## UI Components

### Accordion

An expandable/collapsible section with header.

```vue
<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
</script>

<template>
  <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

### Alert

Display a message for user attention.

```vue
<script setup lang="ts">
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
</script>

<template>
  <Alert>
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      You can add components to your app using the CLI.
    </AlertDescription>
  </Alert>
</template>
```

### Alert Dialog

A modal dialog for important alerts.

```vue
<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>Open</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
```

### Button

A clickable button element.

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>

<template>
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</template>
```

### Data Table

A powerful table for displaying data with sorting, filtering, and pagination.

```vue
<script setup lang="ts">
import { 
  DataTable, 
  DataTableColumn 
} from '@/components/ui/data-table';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' }
];
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## Layout Components

### Admin Layout

Layout for admin pages with sidebar navigation.

```vue
<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
</script>

<template>
  <AdminLayout>
    <template #header>
      Page Title
    </template>
    
    <div>
      Main content goes here
    </div>
    
    <template #footer>
      Footer content
    </template>
  </AdminLayout>
</template>
```

### Dashboard Layout

Layout for dashboard pages with widgets.

```vue
<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
</script>

<template>
  <DashboardLayout>
    <template #sidebar>
      Sidebar content
    </template>
    
    <div>
      Dashboard content
    </div>
  </DashboardLayout>
</template>
```

## Form Components

### Form

Form component with validation.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toFormValidator } from '@vee-validate/zod';

// Define schema
const formSchema = toFormValidator(
  z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
  })
);

// Setup form
const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    email: '',
  },
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <Form @submit="onSubmit">
    <FormField name="username">
      <FormLabel>Username</FormLabel>
      <FormItem>
        <Input />
      </FormItem>
      <FormMessage />
    </FormField>
    
    <FormField name="email">
      <FormLabel>Email</FormLabel>
      <FormItem>
        <Input type="email" />
      </FormItem>
      <FormMessage />
    </FormField>
    
    <Button type="submit">Submit</Button>
  </Form>
</template>
```

## Data Visualization

### Bar Chart

Bar chart for data visualization.

```vue
<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar';

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [30, 40, 60, 70, 50],
    }
  ]
};
</script>

<template>
  <BarChart 
    :data="chartData" 
    :height="300" 
    :options="{ responsive: true }" 
  />
</template>
```

### Line Chart

Line chart for trend visualization.

```vue
<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line';

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Users',
      data: [10, 25, 30, 50, 70],
      borderColor: 'rgb(75, 192, 192)',
    }
  ]
};
</script>

<template>
  <LineChart 
    :data="chartData" 
    :height="300" 
    :options="{ responsive: true }" 
  />
</template>
```

## Usage with TypeScript

All components are fully typed and provide proper TypeScript support.

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { ButtonVariant } from '@/components/ui/button';

// Typed prop
const variant: ButtonVariant = 'secondary';
</script>

<template>
  <Button :variant="variant">Typed Button</Button>
</template>
```

## Customizing Components

### Using Tailwind Classes

All components accept class props for customization:

```vue
<Button class="bg-custom-blue text-xl">Custom Button</Button>
```

### Using Slots

Most components provide slots for custom content:

```vue
<Card>
  <template #header>
    <h3>Custom Header</h3>
  </template>
  
  <p>Card content</p>
  
  <template #footer>
    <Button>Action</Button>
  </template>
</Card>
```

### Using Component Props

Customize behavior using component props:

```vue
<DataTable 
  :data="users" 
  :columns="columns" 
  :pagination="true" 
  :items-per-page="10" 
  :searchable="true" 
/>
```

## Creating Custom Components

Follow these guidelines when creating new components:

1. Create component in appropriate directory
2. Use TypeScript for props and emits
3. Include necessary documentation
4. Follow existing component patterns

Example:

```vue
<script setup lang="ts">
// CustomComponent.vue
import { computed } from 'vue';

// Define props with TypeScript
const props = defineProps<{
  title: string;
  variant?: 'default' | 'large';
}>();

// Emit events
const emit = defineEmits<{
  (e: 'click', value: string): void;
}>();

// Computed properties
const classes = computed(() => {
  return {
    'text-base': props.variant === 'default',
    'text-lg': props.variant === 'large'
  };
});

// Methods
const handleClick = () => {
  emit('click', props.title);
};
</script>

<template>
  <div :class="classes" @click="handleClick">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>
```

## Best Practices

1. Use TypeScript for all components
2. Leverage slot system for flexibility
3. Include proper ARIA attributes for accessibility
4. Maintain responsive design with Tailwind
5. Document component APIs for team reference 