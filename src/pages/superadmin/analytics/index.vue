<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p class="text-muted-foreground mt-1">
          Comprehensive platform analytics and insights
        </p>
      </div>
      <div class="flex gap-2">
        <Select v-model="timeRange" class="w-40">
          <SelectTrigger>
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 hours</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 90 days</SelectItem>
            <SelectItem value="year">Last 365 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" class="flex items-center gap-2">
          <Download class="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Page Views</CardTitle>
          <BarChart4 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">145,256</div>
          <div class="flex items-center pt-1">
            <ArrowUpRight class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs text-green-500 font-medium">+12.5%</span>
            <span class="text-xs text-muted-foreground ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Unique Visitors</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">28,732</div>
          <div class="flex items-center pt-1">
            <ArrowUpRight class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs text-green-500 font-medium">+8.3%</span>
            <span class="text-xs text-muted-foreground ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Avg. Session</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">4m 23s</div>
          <div class="flex items-center pt-1">
            <ArrowDownRight class="h-4 w-4 text-red-500 mr-1" />
            <span class="text-xs text-red-500 font-medium">-1.2%</span>
            <span class="text-xs text-muted-foreground ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Bounce Rate</CardTitle>
          <ArrowDownUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">32.1%</div>
          <div class="flex items-center pt-1">
            <ArrowUpRight class="h-4 w-4 text-red-500 mr-1" />
            <span class="text-xs text-red-500 font-medium">+2.5%</span>
            <span class="text-xs text-muted-foreground ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Traffic Overview -->
    <Card>
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>
          User activity and page views over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-[350px] flex items-center justify-center border rounded-md bg-muted/20">
          <span class="text-muted-foreground">Chart: Traffic over time by page views and users</span>
        </div>
      </CardContent>
    </Card>

    <!-- Traffic Sources & User Behavior -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            Where your users are coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <span class="text-muted-foreground">Chart: Traffic sources breakdown</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Behavior</CardTitle>
          <CardDescription>
            How users interact with your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <span class="text-muted-foreground">Chart: User journey and interactions</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Top Pages & Devices -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>
            Most visited pages on your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Unique</TableHead>
                <TableHead className="text-right">Bounce Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">/dashboard</TableCell>
                <TableCell className="text-right">45,232</TableCell>
                <TableCell className="text-right">12,345</TableCell>
                <TableCell className="text-right">21%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">/login</TableCell>
                <TableCell className="text-right">32,895</TableCell>
                <TableCell className="text-right">24,987</TableCell>
                <TableCell className="text-right">34%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">/settings</TableCell>
                <TableCell className="text-right">28,764</TableCell>
                <TableCell className="text-right">9,127</TableCell>
                <TableCell className="text-right">12%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">/profile</TableCell>
                <TableCell className="text-right">25,631</TableCell>
                <TableCell className="text-right">8,492</TableCell>
                <TableCell className="text-right">18%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">/docs</TableCell>
                <TableCell className="text-right">19,542</TableCell>
                <TableCell className="text-right">7,839</TableCell>
                <TableCell className="text-right">24%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Device Overview</CardTitle>
          <CardDescription>
            What devices your users are using
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <span class="text-muted-foreground">Chart: Device usage breakdown</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart4,
  Users,
  Clock,
  ArrowDownUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-vue-next";

const timeRange = ref("month");
</script> 