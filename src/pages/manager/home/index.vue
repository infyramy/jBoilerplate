<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
      <Button>
        <FolderPlus class="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>

    <!-- Overview Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Projects</CardTitle>
          <FolderPlus class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.activeProjects }}</div>
          <div class="text-xs text-muted-foreground mt-1">
            {{ stats.completedProjects }} completed projects
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Team Members</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.teamMembers }}</div>
          <div class="text-xs text-muted-foreground mt-1">
            Across {{ stats.activeProjects }} active projects
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Task Completion</CardTitle>
          <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.tasksCompleted }}/{{ stats.totalTasks }}</div>
          <div class="w-full h-2 bg-secondary rounded-full mt-2">
            <div 
              class="h-full bg-primary rounded-full" 
              :style="{ width: `${(stats.tasksCompleted / stats.totalTasks) * 100}%` }"
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Documents</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.documents }}</div>
          <div class="text-xs text-muted-foreground mt-1">
            Shared across projects
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Projects and Team -->
    <div class="grid gap-4 grid-cols-1 md:grid-cols-7">
      <!-- Projects with upcoming deadlines -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>
            Projects that require your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-5">
            <div v-for="project in upcomingDeadlines" :key="project.id" class="border rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-medium">{{ project.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <CalendarIcon class="h-3 w-3 text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">{{ formatDate(project.deadline) }}</span>
                  </div>
                </div>
                <Badge :variant="project.priority === 'High' ? 'destructive' : 'secondary'">
                  {{ project.priority }}
                </Badge>
              </div>
              
              <div class="flex items-center justify-between mt-3">
                <div class="flex-1">
                  <div class="flex justify-between mb-1 text-xs">
                    <span>{{ project.completion }}% Complete</span>
                    <span>
                      <Clock class="inline h-3 w-3 mr-1" />
                      {{ getDaysRemaining(project.deadline) }} days left
                    </span>
                  </div>
                  <div class="w-full h-2 bg-secondary rounded-full">
                    <div 
                      class="h-full bg-primary rounded-full" 
                      :style="{ width: `${project.completion}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">
            View All Projects
            <ChevronRight class="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <!-- Team Members -->
      <Card class="md:col-span-3">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle>Team Members</CardTitle>
            <Button size="sm" variant="ghost">
              <PlusCircle class="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="member in teamMembers" :key="member.id" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img 
                  :src="member.avatar" 
                  :alt="member.name" 
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h4 class="text-sm font-medium">{{ member.name }}</h4>
                  <p class="text-xs text-muted-foreground">{{ member.role }}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Message</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">
            View All Team Members
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Recent Documents and Calendar -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
        <CardDescription>Recently updated project documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">Project Requirements.docx</p>
                <p class="text-xs text-muted-foreground">Updated 2 hours ago</p>
              </div>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">Design Mockups.pdf</p>
                <p class="text-xs text-muted-foreground">Updated yesterday</p>
              </div>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">Budget Estimates.xlsx</p>
                <p class="text-xs text-muted-foreground">Updated 3 days ago</p>
              </div>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" class="w-full">View All Documents</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Calendar as CalendarIcon, FolderPlus, Users, FileText, PlusCircle, ChevronRight } from "lucide-vue-next";

// Mock data for the dashboard
const stats = ref({
  activeProjects: 5,
  completedProjects: 12,
  teamMembers: 8,
  documents: 24,
  tasksCompleted: 18,
  totalTasks: 27,
});

// Mock data for upcoming deadlines
const upcomingDeadlines = ref([
  { 
    id: 1, 
    name: 'Website Redesign', 
    deadline: '2023-10-25', 
    status: 'In Progress',
    completion: 68,
    priority: 'High',
  },
  { 
    id: 2, 
    name: 'Mobile App Development', 
    deadline: '2023-11-15', 
    status: 'In Progress',
    completion: 42,
    priority: 'Medium', 
  },
  { 
    id: 3, 
    name: 'Marketing Campaign', 
    deadline: '2023-11-05', 
    status: 'Planning',
    completion: 15,
    priority: 'Medium',
  }
]);

// Mock team members
const teamMembers = ref([
  { id: 1, name: 'Jane Cooper', role: 'UI Designer', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Alex Johnson', role: 'Frontend Dev', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Michael Brown', role: 'Backend Dev', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Sarah Wilson', role: 'QA Tester', avatar: 'https://i.pravatar.cc/150?img=4' },
]);

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Calculate days remaining
function getDaysRemaining(dateString: string): number {
  const deadline = new Date(dateString);
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
</script> 