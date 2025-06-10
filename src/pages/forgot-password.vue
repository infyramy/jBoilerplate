<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!email.value) {
    toast.error("Please enter your email address");
    return;
  }

  try {
    isSubmitting.value = true;
    // TODO: Implement forgot password logic
    toast.success("Password reset instructions have been sent to your email");
    router.push("/login");
  } catch (error: any) {
    console.log("error: ", error);
    toast.error(error.data?.message || "Something went wrong. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        Forgot Password
      </h1>
      <p class="text-sm text-muted-foreground">
        Enter your email address and we'll send you instructions to reset your password
      </p>
    </div>

    <Card>
      <CardContent class="pt-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <svg
                class="animate-spin mr-2 h-4 w-4 text-primary-foreground"
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
              Sending...
            </span>
            <span v-else>Send Reset Instructions</span>
          </Button>
        </form>
      </CardContent>
    </Card>

    <p class="text-center text-sm text-muted-foreground mt-6">
      Remember your password?
      <router-link to="/login" class="text-primary underline underline-offset-4 hover:text-primary/90">
        Sign in
      </router-link>
    </p>
  </div>
</template> 