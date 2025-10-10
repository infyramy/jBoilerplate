<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'vue-sonner';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-vue-next';

const authStore = useAuthStore();

const form = ref({
  fullname: authStore.user?.fullname || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
});

const isLoading = ref(false);

async function updateProfile() {
  isLoading.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Profile</h1>
      <p class="text-muted-foreground mt-2">
        Manage your account settings and personal information
      </p>
    </div>

    <Separator />

    <div class="grid gap-6">
      <!-- Profile Overview -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-4">
            <Avatar class="h-20 w-20">
              <AvatarImage :src="authStore.user?.avatar || '/avatar.png'" />
              <AvatarFallback>{{ authStore.user?.fullname?.charAt(0) ?? 'U' }}</AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <CardTitle>{{ authStore.user?.fullname }}</CardTitle>
              <CardDescription class="flex items-center gap-2 mt-1">
                <Mail class="h-4 w-4" />
                {{ authStore.user?.email }}
              </CardDescription>
              <div class="flex items-center gap-2 mt-1">
                <Shield class="h-4 w-4" />
                <span class="text-sm capitalize">{{ authStore.user?.user_type }}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <!-- Edit Profile -->
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="space-y-2">
              <Label for="fullname">Full Name</Label>
              <div class="relative">
                <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullname"
                  v-model="form.fullname"
                  placeholder="Enter your full name"
                  class="pl-10"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                  class="pl-10"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <div class="relative">
                <Phone class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  class="pl-10"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <Button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Account Information -->
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">Member Since</span>
            </div>
            <span class="text-sm font-medium">{{ new Date().toLocaleDateString() }}</span>
          </div>
          <Separator />
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">Account Type</span>
            </div>
            <span class="text-sm font-medium capitalize">{{ authStore.user?.user_type }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
