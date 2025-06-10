<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <header class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight mb-2">API Reference</h1>
      <p class="text-muted-foreground">Complete documentation for the jBoilerplate REST API</p>
    </header>

    <!-- API Overview -->
    <Card>
      <CardHeader>
        <CardTitle>API Overview</CardTitle>
        <CardDescription>Basic information about the API</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <h3 class="font-semibold">Base URL</h3>
          <p class="text-sm bg-muted p-2 rounded font-mono">{{ baseUrl }}</p>
          <p class="text-sm text-muted-foreground">All API requests should be made to this base URL.</p>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold">Authentication</h3>
          <p>The API uses token-based authentication. Include your API key in the header of each request:</p>
          <p class="text-sm bg-muted p-2 rounded font-mono">Authorization: Bearer YOUR_API_KEY</p>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold">Response Format</h3>
          <p>All responses are returned in JSON format with the following structure:</p>
          <pre class="text-sm bg-muted p-2 rounded font-mono">
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}</pre>
          <p class="text-sm text-muted-foreground">Error responses will include an error message and appropriate HTTP status code.</p>
        </div>
      </CardContent>
    </Card>

    <!-- Endpoints -->
    <Tabs defaultValue="users">
      <TabsList class="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="auth">Authentication</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
      </TabsList>

      <TabsContent value="users" class="space-y-6">
        <ApiEndpoint 
          method="GET" 
          endpoint="/api/users" 
          description="Retrieve a list of users"
          :parameters="[
            { name: 'page', type: 'number', description: 'Page number for pagination', required: false },
            { name: 'limit', type: 'number', description: 'Number of items per page', required: false },
            { name: 'sort', type: 'string', description: 'Field to sort by', required: false },
            { name: 'order', type: 'string', description: 'Sort order (asc or desc)', required: false },
          ]"
          :exampleResponse="{
            'success': true,
            'data': {
              'users': [
                { 'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'role': 'admin' },
                { 'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'role': 'user' }
              ],
              'pagination': {
                'page': 1,
                'pageSize': 10,
                'totalPages': 5,
                'totalItems': 42
              }
            },
            'message': 'Users retrieved successfully'
          }"
        />

        <ApiEndpoint 
          method="GET" 
          endpoint="/api/users/:id" 
          description="Retrieve a specific user by ID"
          :parameters="[
            { name: 'id', type: 'number', description: 'User ID', required: true, in: 'path' },
          ]"
          :exampleResponse="{
            'success': true,
            'data': {
              'id': 1,
              'name': 'John Doe',
              'email': 'john@example.com',
              'role': 'admin',
              'createdAt': '2023-01-15T08:30:00Z',
              'updatedAt': '2023-06-22T14:45:30Z'
            },
            'message': 'User retrieved successfully'
          }"
        />

        <ApiEndpoint 
          method="POST" 
          endpoint="/api/users" 
          description="Create a new user"
          :parameters="[
            { name: 'name', type: 'string', description: 'User full name', required: true },
            { name: 'email', type: 'string', description: 'User email address', required: true },
            { name: 'password', type: 'string', description: 'User password', required: true },
            { name: 'role', type: 'string', description: 'User role (admin, manager, user)', required: false },
          ]"
          :exampleRequest="{
            'name': 'New User',
            'email': 'newuser@example.com',
            'password': 'securepassword123',
            'role': 'user'
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'id': 3,
              'name': 'New User',
              'email': 'newuser@example.com',
              'role': 'user',
              'createdAt': '2023-07-01T10:15:30Z'
            },
            'message': 'User created successfully'
          }"
        />

        <ApiEndpoint 
          method="PUT" 
          endpoint="/api/users/:id" 
          description="Update an existing user"
          :parameters="[
            { name: 'id', type: 'number', description: 'User ID', required: true, in: 'path' },
            { name: 'name', type: 'string', description: 'User full name', required: false },
            { name: 'email', type: 'string', description: 'User email address', required: false },
            { name: 'role', type: 'string', description: 'User role (admin, manager, user)', required: false },
          ]"
          :exampleRequest="{
            'name': 'Updated Name',
            'email': 'updated@example.com'
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'id': 2,
              'name': 'Updated Name',
              'email': 'updated@example.com',
              'role': 'user',
              'updatedAt': '2023-07-02T15:30:45Z'
            },
            'message': 'User updated successfully'
          }"
        />

        <ApiEndpoint 
          method="DELETE" 
          endpoint="/api/users/:id" 
          description="Delete a user"
          :parameters="[
            { name: 'id', type: 'number', description: 'User ID', required: true, in: 'path' },
          ]"
          :exampleResponse="{
            'success': true,
            'data': null,
            'message': 'User deleted successfully'
          }"
        />
      </TabsContent>

      <TabsContent value="auth" class="space-y-6">
        <ApiEndpoint 
          method="POST" 
          endpoint="/api/auth/login" 
          description="Authenticate a user and get access token"
          :parameters="[
            { name: 'email', type: 'string', description: 'User email address', required: true },
            { name: 'password', type: 'string', description: 'User password', required: true },
          ]"
          :exampleRequest="{
            'email': 'user@example.com',
            'password': 'password123'
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              'expiresAt': '2023-07-02T15:30:45Z',
              'user': {
                'id': 1,
                'name': 'John Doe',
                'email': 'john@example.com',
                'role': 'admin'
              }
            },
            'message': 'Login successful'
          }"
        />

        <ApiEndpoint 
          method="POST" 
          endpoint="/api/auth/refresh" 
          description="Refresh an expired access token"
          :parameters="[
            { name: 'refreshToken', type: 'string', description: 'Refresh token', required: true },
          ]"
          :exampleRequest="{
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              'expiresAt': '2023-07-02T17:30:45Z'
            },
            'message': 'Token refreshed successfully'
          }"
        />

        <ApiEndpoint 
          method="POST" 
          endpoint="/api/auth/logout" 
          description="Invalidate the current access token"
          :exampleResponse="{
            'success': true,
            'data': null,
            'message': 'Logged out successfully'
          }"
        />
      </TabsContent>

      <TabsContent value="config" class="space-y-6">
        <ApiEndpoint 
          method="GET" 
          endpoint="/api/config" 
          description="Retrieve system configuration"
          :exampleResponse="{
            'success': true,
            'data': {
              'app': {
                'name': 'jBoilerplate',
                'url': 'https://example.com',
                'environment': 'production'
              },
              'ui': {
                'theme': 'light',
                'animations': true
              },
              'features': {
                'multilingualSupport': true,
                'analytics': true
              }
            },
            'message': 'Configuration retrieved successfully'
          }"
        />

        <ApiEndpoint 
          method="PUT" 
          endpoint="/api/config" 
          description="Update system configuration"
          :parameters="[
            { name: 'config', type: 'object', description: 'Configuration object', required: true },
          ]"
          :exampleRequest="{
            'app': {
              'name': 'Custom App Name'
            },
            'ui': {
              'theme': 'dark'
            }
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'updated': ['app.name', 'ui.theme']
            },
            'message': 'Configuration updated successfully'
          }"
        />
      </TabsContent>

      <TabsContent value="webhooks" class="space-y-6">
        <ApiEndpoint 
          method="GET" 
          endpoint="/api/webhooks" 
          description="List all registered webhooks"
          :exampleResponse="{
            'success': true,
            'data': {
              'webhooks': [
                {
                  'id': 1,
                  'url': 'https://example.com/webhook',
                  'events': ['user.created', 'user.updated'],
                  'active': true,
                  'createdAt': '2023-05-10T08:15:30Z'
                },
                {
                  'id': 2,
                  'url': 'https://another-site.com/callback',
                  'events': ['auth.login'],
                  'active': false,
                  'createdAt': '2023-06-15T14:30:00Z'
                }
              ]
            },
            'message': 'Webhooks retrieved successfully'
          }"
        />

        <ApiEndpoint 
          method="POST" 
          endpoint="/api/webhooks" 
          description="Register a new webhook"
          :parameters="[
            { name: 'url', type: 'string', description: 'Webhook URL', required: true },
            { name: 'events', type: 'array', description: 'Array of events to subscribe to', required: true },
            { name: 'description', type: 'string', description: 'Description of the webhook', required: false },
            { name: 'active', type: 'boolean', description: 'Whether the webhook is active', required: false },
          ]"
          :exampleRequest="{
            'url': 'https://example.com/webhook',
            'events': ['user.created', 'user.updated'],
            'description': 'User events webhook',
            'active': true
          }"
          :exampleResponse="{
            'success': true,
            'data': {
              'id': 3,
              'url': 'https://example.com/webhook',
              'events': ['user.created', 'user.updated'],
              'description': 'User events webhook',
              'active': true,
              'createdAt': '2023-07-05T09:45:30Z'
            },
            'message': 'Webhook registered successfully'
          }"
        />
      </TabsContent>
    </Tabs>

    <Card>
      <CardHeader>
        <CardTitle>Rate Limits</CardTitle>
        <CardDescription>API usage limits and throttling information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The API enforces rate limits to ensure fair usage and system stability:</p>
        <div class="mt-4 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader class="p-4 pb-2">
                <CardTitle class="text-base">Standard Plan</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-3xl font-bold">100</p>
                <p class="text-sm text-muted-foreground">requests per minute</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader class="p-4 pb-2">
                <CardTitle class="text-base">Professional Plan</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-3xl font-bold">500</p>
                <p class="text-sm text-muted-foreground">requests per minute</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader class="p-4 pb-2">
                <CardTitle class="text-base">Enterprise Plan</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-3xl font-bold">2000</p>
                <p class="text-sm text-muted-foreground">requests per minute</p>
              </CardContent>
            </Card>
          </div>
          
          <p class="text-sm text-muted-foreground">
            Rate limit headers are included in all API responses:
          </p>
          <pre class="text-sm bg-muted p-2 rounded font-mono">
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1626972242</pre>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiEndpoint from '@/components/ApiEndpoint.vue';
import { configService } from '@/services/config';

// Get API base URL from config or use a default
const baseUrl = computed(() => {
  return configService.api.url || 'https://api.example.com/v1';
});
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 