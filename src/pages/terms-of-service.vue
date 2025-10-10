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
            Terms of Service
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
                    1. Acceptance of Terms
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    2. Use License
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    3. Disclaimer
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    4. Limitations
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    5. Revisions and Errata
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    6. Links
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    7. Site Terms of Use Modifications
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    8. Governing Law
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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