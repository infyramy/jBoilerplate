<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          System Information
        </h1>
        <p class="text-muted-foreground mt-1">
          Monitor system health and performance
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2">
          <DownloadIcon class="h-4 w-4" />
          <span>Download Logs</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2">
          <RefreshCwIcon class="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
    </div>

    <!-- System Status Overview -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">System Status</CardTitle>
          <ActivityIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-center">
            <div class="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
            <div class="text-xl font-bold">Operational</div>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            All systems running normally
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">CPU Usage</CardTitle>
          <CPUIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-2">
            <div class="text-xl font-bold">24%</div>
            <Progress value={24} />
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            4 cores @ 2.3GHz
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Memory Usage</CardTitle>
          <MemoryIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-2">
            <div class="text-xl font-bold">3.6 GB / 8 GB</div>
            <Progress value={45} />
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            45% of total RAM
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Disk Usage</CardTitle>
          <HardDriveIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-2">
            <div class="text-xl font-bold">342 GB / 512 GB</div>
            <Progress value={67} />
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            67% of total storage
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Server Information -->
    <Card>
      <CardHeader>
        <CardTitle>Server Information</CardTitle>
        <CardDescription>
          Detailed information about the server environment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium">Environment</h3>
              <div class="mt-3 space-y-2">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Operating System:</span>
                  <span class="font-medium">Ubuntu 22.04 LTS</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Web Server:</span>
                  <span class="font-medium">Nginx 1.18.0</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">PHP Version:</span>
                  <span class="font-medium">PHP 8.1.12</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Database:</span>
                  <span class="font-medium">MySQL 8.0.30</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Cache:</span>
                  <span class="font-medium">Redis 6.0.16</span>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium">Application</h3>
              <div class="mt-3 space-y-2">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">App Version:</span>
                  <span class="font-medium">v1.2.5</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Framework:</span>
                  <span class="font-medium">Vue 3.2.47</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Last Updated:</span>
                  <span class="font-medium">Aug 15, 2023</span>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Environment:</span>
                  <Badge variant="outline">Production</Badge>
                </div>
                <Separator />
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Debug Mode:</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- System Logs -->
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>
            Recent system events and errors
          </CardDescription>
        </div>
        <div class="flex gap-2">
          <Select defaultValue="error">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select log level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant="destructive">Error</Badge>
                </TableCell>
                <TableCell>2023-08-15 14:32:45</TableCell>
                <TableCell>Database connection failed: Connection timed out</TableCell>
                <TableCell>Database</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <EyeIcon class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="default">Info</Badge>
                </TableCell>
                <TableCell>2023-08-15 14:31:30</TableCell>
                <TableCell>User login successful: admin@example.com</TableCell>
                <TableCell>Auth</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <EyeIcon class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="secondary">Warning</Badge>
                </TableCell>
                <TableCell>2023-08-15 14:30:12</TableCell>
                <TableCell>High memory usage detected (85%)</TableCell>
                <TableCell>System</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <EyeIcon class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="destructive">Error</Badge>
                </TableCell>
                <TableCell>2023-08-15 14:28:55</TableCell>
                <TableCell>Failed to send email: SMTP authentication error</TableCell>
                <TableCell>Email</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <EyeIcon class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="default">Info</Badge>
                </TableCell>
                <TableCell>2023-08-15 14:25:17</TableCell>
                <TableCell>Scheduled maintenance completed successfully</TableCell>
                <TableCell>System</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <EyeIcon class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div class="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            class="h-8 w-8 p-0"
          >
            <ChevronLeftIcon class="h-4 w-4" />
            <span class="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="h-8 px-3"
            disabled
          >
            1 of 3
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="h-8 w-8 p-0"
          >
            <ChevronRightIcon class="h-4 w-4" />
            <span class="sr-only">Next page</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- System Maintenance -->
    <Card>
      <CardHeader>
        <CardTitle>System Maintenance</CardTitle>
        <CardDescription>
          Perform system maintenance tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent class="pt-6">
              <div class="flex flex-col items-center text-center space-y-3">
                <DatabaseBackupIcon class="h-8 w-8 text-primary" />
                <h3 class="text-lg font-medium">Backup Database</h3>
                <p class="text-sm text-muted-foreground">
                  Create a full backup of the database
                </p>
                <Button variant="outline" class="mt-2">Start Backup</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="pt-6">
              <div class="flex flex-col items-center text-center space-y-3">
                <BroomIcon class="h-8 w-8 text-primary" />
                <h3 class="text-lg font-medium">Clear Cache</h3>
                <p class="text-sm text-muted-foreground">
                  Clear all application caches
                </p>
                <Button variant="outline" class="mt-2">Clear Now</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="pt-6">
              <div class="flex flex-col items-center text-center space-y-3">
                <ConstructionIcon class="h-8 w-8 text-primary" />
                <h3 class="text-lg font-medium">Maintenance Mode</h3>
                <p class="text-sm text-muted-foreground">
                  Toggle site maintenance mode
                </p>
                <Button variant="outline" class="mt-2">Enable Mode</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity as ActivityIcon,
  HardDrive as HardDriveIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Eye as EyeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Cpu as CPUIcon,
  MemoryStick as MemoryIcon,
  Database as DatabaseBackupIcon,
  Trash2 as BroomIcon,
  Wrench as ConstructionIcon,
} from "lucide-vue-next";
</script>
