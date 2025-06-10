<template>
  <div class="space-y-6">
    <PageHeader :breadcrumb="breadcrumbs" />

    <!-- Page Header -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
      <p class="text-muted-foreground mt-1">
        Manage your personal information and account settings
      </p>
    </div>

    <Alert
      v-if="showAlert"
      class="mb-6 border-green-500 bg-green-50 text-green-700"
    >
      <AlertTitle>Success</AlertTitle>
      <AlertDescription
        >Your profile has been updated successfully.</AlertDescription
      >
    </Alert>

    <!-- Profile Content -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Main Profile Card -->
      <div class="col-span-12 lg:col-span-8">
        <Card class="p-6">
          <div v-if="!isEditing" class="space-y-6">
            <div class="flex items-center space-x-4">
              <Avatar class="h-20 w-20">
                <AvatarImage v-if="user?.avatar" :src="String(user.avatar)" />
                <AvatarFallback>{{
                  getInitials(user?.fullname)
                }}</AvatarFallback>
              </Avatar>

              <div>
                <h2 class="text-xl font-semibold">{{ user?.fullname }}</h2>
                <p class="text-sm text-muted-foreground">
                  {{ formatUserType(user?.user_type) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">Email</p>
                <p>{{ user?.email }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">User ID</p>
                <p>{{ user?.id }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{{ user?.phone || "Not provided" }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p>{{ user?.location || "Not provided" }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p>{{ formatDate(user?.created_at) || "Unknown" }}</p>
              </div>
            </div>

            <div class="pt-4">
              <Button @click="startEditing">Edit Profile</Button>
            </div>
          </div>

          <form v-else class="space-y-6" @submit.prevent="validateAndSave">
            <div class="flex items-center space-x-4">
              <Avatar class="h-20 w-20">
                <AvatarImage
                  v-if="editedUser.avatar"
                  :src="editedUser.avatar"
                />
                <AvatarFallback>{{
                  getInitials(editedUser.fullname)
                }}</AvatarFallback>
              </Avatar>

              <div>
                <p class="text-sm font-medium mb-1">Profile Picture</p>
                <input
                  type="file"
                  id="avatar-upload"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleFileUpload"
                />
                <Button variant="outline" size="sm" @click="triggerFileInput"
                  >Change Photo</Button
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="space-y-1">
                <Label for="fullname">Full Name</Label>
                <Input id="fullname" v-model="editedUser.fullname" />
                <p v-if="errors.fullname" class="text-sm text-red-500 mt-1">
                  {{ errors.fullname }}
                </p>
              </div>

              <div class="space-y-1">
                <Label for="email">Email</Label>
                <Input id="email" v-model="editedUser.email" type="email" />
                <p v-if="errors.email" class="text-sm text-red-500 mt-1">
                  {{ errors.email }}
                </p>
              </div>

              <div class="space-y-1">
                <Label for="phone">Phone</Label>
                <Input id="phone" v-model="editedUser.phone" type="tel" />
                <p v-if="errors.phone" class="text-sm text-red-500 mt-1">
                  {{ errors.phone }}
                </p>
              </div>

              <div class="space-y-1">
                <Label for="location">Location</Label>
                <Input id="location" v-model="editedUser.location" />
                <p v-if="errors.location" class="text-sm text-red-500 mt-1">
                  {{ errors.location }}
                </p>
              </div>
            </div>

            <div class="flex space-x-2 pt-4">
              <Button type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="mr-2">
                  <svg
                    class="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                {{ isLoading ? "Saving..." : "Save Changes" }}
              </Button>
              <Button
                type="button"
                variant="outline"
                @click="cancelEditing"
                :disabled="isLoading"
                >Cancel</Button
              >
            </div>
          </form>
        </Card>
      </div>

      <!-- Account Security Card -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription
              >Manage your account security settings</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-sm font-medium">Password</h3>
                  <p class="text-xs text-muted-foreground">
                    Last changed: Never
                  </p>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
            </div>

            <Separator />

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-sm font-medium">Two-Factor Authentication</h3>
                  <p class="text-xs text-muted-foreground">
                    Enhance your account security
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <Separator />

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-sm font-medium">Login Sessions</h3>
                  <p class="text-xs text-muted-foreground">
                    Manage your active sessions
                  </p>
                </div>
                <Button variant="outline" size="sm">View Sessions</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium">Email Notifications</h3>
                <p class="text-xs text-muted-foreground">
                  Receive email notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium">Dark Mode</h3>
                <p class="text-xs text-muted-foreground">
                  Toggle dark mode theme
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import PageHeader from "@/layouts/components/PageHeader.vue";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface User {
  id: string;
  email: string;
  fullname: string;
  user_type: "superadmin" | "studio" | "photographer" | "affiliate";
  avatar: string;
  phone?: string;
  location?: string;
  created_at?: string;
}

const authStore = useAuthStore();
const user = computed(() => authStore.user as User);

const isEditing = ref(false);
const showAlert = ref(false);
const isLoading = ref(false);
const editedUser = ref({
  fullname: "",
  email: "",
  avatar: "",
  phone: "",
  location: "",
});

const errors = ref({
  fullname: "",
  email: "",
  phone: "",
  location: "",
});

const fileInput = ref<HTMLInputElement | null>(null);

// Set up breadcrumb navigation
const breadcrumbs = [
  {
    count: 1,
    label: "My Profile",
    href: "/profile",
    action: false,
  },
];

function startEditing() {
  editedUser.value = {
    fullname: user.value?.fullname || "",
    email: user.value?.email || "",
    avatar: user.value?.avatar?.toString() || "",
    phone: user.value?.phone || "",
    location: user.value?.location || "",
  };
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
}

function validateAndSave() {
  // Reset errors
  errors.value = {
    fullname: "",
    email: "",
    phone: "",
    location: "",
  };

  let isValid = true;

  // Validate fullname
  if (!editedUser.value.fullname.trim()) {
    errors.value.fullname = "Full name is required";
    isValid = false;
  }

  // Validate email
  if (!editedUser.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail(editedUser.value.email)) {
    errors.value.email = "Please enter a valid email address";
    isValid = false;
  }

  // Validate phone (optional but if provided, validate format)
  if (editedUser.value.phone && !isValidPhone(editedUser.value.phone)) {
    errors.value.phone = "Please enter a valid phone number";
    isValid = false;
  }

  if (isValid) {
    saveProfile();
  }
}

async function saveProfile() {
  // In a real application, we would update the user profile via API
  // For now, we'll just update the local store and simulate a server call
  if (user.value) {
    isLoading.value = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user.value,
        fullname: editedUser.value.fullname,
        email: editedUser.value.email,
        avatar: editedUser.value.avatar,
        phone: editedUser.value.phone,
        location: editedUser.value.location,
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update store
      authStore.user = updatedUser;

      // Show success alert
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);

      isEditing.value = false;
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      isLoading.value = false;
    }
  }
}

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatUserType(userType?: string): string {
  if (!userType) return "";

  const types: Record<string, string> = {
    superadmin: "Super Admin",
    studio: "Studio",
    photographer: "Photographer",
    affiliate: "Affiliate",
  };

  return types[userType] || userType;
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        editedUser.value.avatar = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Basic phone validation - can be adjusted based on requirements
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
</script>

<style scoped>
/* Additional styling can be added here if needed */
</style>
