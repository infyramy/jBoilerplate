<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-vue-next";

const mode = useColorMode();

function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div class="min-h-svh bg-background">
    <div class="container mx-auto px-4 py-6 sm:py-12">
      <!-- Theme Toggle Button -->
      <button
        @click="toggleMode"
        class="fixed right-4 top-4 sm:right-6 sm:top-6 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        <svg
          v-if="mode === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 sm:h-5 sm:w-5"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 sm:h-5 sm:w-5"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <div class="max-w-4xl mx-auto">
        <div class="mb-8 sm:mb-12 text-center">
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p class="mt-2 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Last updated: {{ new Date().toLocaleDateString() }}
          </p>
        </div>

        <Card class="mb-6 sm:mb-8 shadow-lg">
          <CardContent class="p-4 sm:p-8">
            <div class="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
              <div class="space-y-6 sm:space-y-8">
                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    1. Information We Collect
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    2. How We Use Your Information
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our services and users.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    3. Information Sharing
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We do not share your personal information with third parties except as described in this policy. We may share your information with service providers who assist us in operating our website and conducting our business.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    4. Data Security
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    5. Your Rights
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your information.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    6. Cookies and Tracking
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    7. Changes to This Policy
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    8. Contact Us
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    If you have any questions about this Privacy Policy, please contact us at 
                    <a href="mailto:support@example.com" class="text-primary hover:underline break-all">support@example.com</a>.
                  </p>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="text-center">
          <Button 
            variant="outline" 
            class="group w-full sm:w-auto" 
            @click="$router.back()"
          >
            <ChevronLeft class="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  </div>
</template> 