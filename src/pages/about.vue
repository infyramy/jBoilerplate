<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Heart, Lightbulb, Globe, Code, Rocket, Star } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";

const mode = useColorMode();
const router = useRouter();

function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

// Team members
const team = [
  {
    name: "Haqeem Julap",
    role: "Partner & Tech Lead",
    bio: "Passionate about pushing technological boundaries and crafting seamless user experiences.",
    signature: "Julap",
    avatar: null // Placeholder for AI cartoon
  },
  {
    name: "Iman",
    role: "Partner & Product Lead",
    bio: "Driving innovation with a keen eye for market trends and customer-centric solutions.",
    signature: "Iman",
    avatar: null // Placeholder for AI cartoon
  },
  {
    name: "Ammar",
    role: "Partner & Operations Lead",
    bio: "Ensuring operational excellence while bringing creative vision to every project.",
    signature: "Ammar",
    avatar: null // Placeholder for AI cartoon
  }
];
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
            Our Story
          </h1>
          <p class="mt-2 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Transforming ideas into digital realities
          </p>
        </div>

        <Card class="mb-6 sm:mb-8 shadow-lg overflow-hidden">
          <div class="h-40 sm:h-48 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center">
            <div class="text-center">
              <Rocket class="h-12 w-12 mx-auto text-primary mb-2" />
              <h2 class="text-xl font-medium">Infyra Ventures</h2>
            </div>
          </div>
          <CardContent class="p-4 sm:p-8">
            <div class="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
              <div class="space-y-6 sm:space-y-8">
                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                    <Lightbulb class="h-5 w-5 text-primary" />
                    Our Vision
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    At Infyra Ventures, we're not just building software; we're crafting digital experiences that transform how people interact with technology. As young Malaysian entrepreneurs, we believe in the power of innovation to solve real-world problems and create meaningful impact.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                    <Code class="h-5 w-5 text-primary" />
                    Our Approach
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We see challenges as opportunities to innovate. In a rapidly evolving digital landscape, we stay ahead by embracing emerging technologies while maintaining a laser focus on user experience. Our solutions aren't just technically sound—they're intuitive, accessible, and designed with real people in mind.
                  </p>
                </section>

                <section class="group">
                  <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                    <Globe class="h-5 w-5 text-primary" />
                    Our Partnership
                  </h2>
                  <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    We founded Infyra Ventures as equal partners, each bringing our unique strengths to the table. Our flat structure allows us to move quickly, innovate boldly, and respond to challenges with agility. From Malaysia to the world, we're building a future where technology serves humanity, creating systems that empower, connect, and elevate the human experience.
                  </p>
                </section>

                <Separator class="my-6" />

                <section>
                  <h2 class="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">Meet Our Team</h2>
                  
                  <div class="grid gap-6 sm:grid-cols-3">
                    <div v-for="(member, index) in team" :key="index" class="group bg-muted/30 rounded-lg p-4 sm:p-6 hover:bg-muted/50 transition-colors">
                      <div class="space-y-3">
                        <div class="text-center">
                          <div class="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                            <!-- Image placeholder -->
                            <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                            <div v-else class="flex flex-col items-center justify-center">
                              <Star class="h-8 w-8 text-primary opacity-50" />
                              <span class="text-xs text-muted-foreground mt-1">Image Coming Soon</span>
                            </div>
                          </div>
                          <h3 class="mt-3 font-medium group-hover:text-primary transition-colors">{{ member.name }}</h3>
                          <p class="text-sm text-muted-foreground">{{ member.role }}</p>
                        </div>
                        <p class="text-sm text-muted-foreground mt-3">{{ member.bio }}</p>
                        <div class="mt-4 pt-4 border-t border-border">
                          <p class="font-handwriting text-lg text-primary text-center font-medium italic">
                            {{ member.signature }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator class="my-6" />

                <section class="text-center">
                  <p class="text-muted-foreground italic text-sm">
                    "As partners in this venture, we're young, ambitious, and relentlessly committed to excellence. Our journey is just beginning, but our vision is clear: to build products that matter, create experiences that delight, and leave a lasting impact on the digital world."
                  </p>
                  <p class="mt-4 flex items-center justify-center text-sm gap-1.5">
                    Made with <Heart class="h-4 w-4 text-red-500 animate-pulse" /> by Infyra Ventures — Malaysia
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
            @click="router.back()"
          >
            <ChevronLeft class="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-handwriting {
  font-family: 'Pacifico', cursive, system-ui;
}
</style> 