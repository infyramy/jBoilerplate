<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <header class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Getting Started with jBoilerplate</h1>
      <p class="text-muted-foreground">Everything you need to know to set up and run your application</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get your application up and running quickly</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">1. Configuration</h3>
              <p>Start by configuring your application in the <RouterLink to="/admin/settings" class="text-primary underline">System Settings</RouterLink> page. You should set up:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Application name and URL</li>
                <li>Email settings</li>
                <li>Security preferences</li>
                <li>UI defaults</li>
              </ul>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">2. User Management</h3>
              <p>Set up your first users and roles:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Create user accounts for your team in <RouterLink to="/admin/users" class="text-primary underline">Users</RouterLink></li>
                <li>Configure roles and permissions in <RouterLink to="/admin/users/roles" class="text-primary underline">Roles & Permissions</RouterLink></li>
              </ul>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">3. API Access</h3>
              <p>If you need programmatic access to your application:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Generate API keys in <RouterLink to="/admin/api-access" class="text-primary underline">API & Integrations</RouterLink></li>
                <li>Set up webhook endpoints for real-time notifications</li>
                <li>Configure rate limits and security controls</li>
              </ul>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">4. Email Templates</h3>
              <p>Customize your email templates for notifications:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Configure transactional emails in <RouterLink to="/admin/settings/email-templates" class="text-primary underline">Email Templates</RouterLink></li>
                <li>Set up your email provider</li>
                <li>Test email delivery</li>
              </ul>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">5. Analytics</h3>
              <p>Monitor usage and performance:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Enable analytics in <RouterLink to="/admin/analytics" class="text-primary underline">Analytics</RouterLink></li>
                <li>Set up tracking goals</li>
                <li>Monitor user engagement</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful links and documentation</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <h3 class="text-sm font-semibold">Documentation</h3>
              <div class="space-y-2">
                <Button variant="outline" class="w-full justify-start" asChild>
                  <RouterLink to="/admin/docs/api">
                    <FileCode class="w-4 h-4 mr-2" />
                    API Reference
                  </RouterLink>
                </Button>
                <Button variant="outline" class="w-full justify-start" asChild>
                  <RouterLink to="/admin/system/database">
                    <Database class="w-4 h-4 mr-2" />
                    Database Schema
                  </RouterLink>
                </Button>
                <Button variant="outline" class="w-full justify-start" asChild>
                  <RouterLink to="/admin/system/health">
                    <HeartPulse class="w-4 h-4 mr-2" />
                    System Health
                  </RouterLink>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div class="space-y-2">
              <h3 class="text-sm font-semibold">External Resources</h3>
              <div class="space-y-2">
                <Button variant="outline" class="w-full justify-start" asChild>
                  <a href="https://github.com/your-repo/jboilerplate" target="_blank" rel="noopener noreferrer">
                    <Github class="w-4 h-4 mr-2" />
                    GitHub Repository
                  </a>
                </Button>
                <Button variant="outline" class="w-full justify-start" asChild>
                  <a href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer">
                    <MessageSquareText class="w-4 h-4 mr-2" />
                    Community Discord
                  </a>
                </Button>
                <Button variant="outline" class="w-full justify-start" asChild>
                  <a href="https://docs.example.com" target="_blank" rel="noopener noreferrer">
                    <BookOpen class="w-4 h-4 mr-2" />
                    Full Documentation
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Get support for your installation</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm mb-4">Our support team is available to help you with any issues you may encounter.</p>
            <Button class="w-full">
              <Headset class="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RouterLink } from 'vue-router';
import { 
  FileCode, 
  Database, 
  HeartPulse, 
  Github, 
  MessageSquareText, 
  BookOpen,
  Headset 
} from 'lucide-vue-next';
</script> 