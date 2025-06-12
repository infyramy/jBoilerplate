<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-vue-next';

// Meta tag type definition
interface MetaTagBase {
  id: number;
  content: string;
}

interface NameMetaTag extends MetaTagBase {
  name: string;
  property?: undefined;
}

interface PropertyMetaTag extends MetaTagBase {
  property: string;
  name?: undefined;
}

type MetaTag = NameMetaTag | PropertyMetaTag;

const configStore = useConfigStore();
const toast = useToast();

const activeTab = ref('meta');
const isLoading = ref(false);

// SEO configuration
const seoConfig = ref({
  metaTitle: 'jBoilerplate - Modern Vue Framework',
  metaDescription: 'A modern, powerful Vue framework for building web applications',
  ogImage: '/images/og-image.jpg',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /superadmin/\nSitemap: https://example.com/sitemap.xml',
  enableSitemap: true,
  verificationCodes: {
    google: '',
    bing: '',
    yandex: ''
  }
});

// Custom meta tags
const customMetaTags = ref<MetaTag[]>([
  { id: 1, name: 'twitter:card', content: 'summary_large_image' },
  { id: 2, name: 'twitter:site', content: '@jboilerplate' },
  { id: 3, property: 'og:type', content: 'website' },
  { id: 4, property: 'og:url', content: 'https://example.com' }
]);

// New custom meta tag
const newMetaTag = ref<{name: string; property: string; content: string}>({ name: '', property: '', content: '' });

// Upload image
function uploadImage(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    
    // In a real implementation, this would upload the file to a server
    // and return a URL. For now, we'll create a fake URL.
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        seoConfig.value.ogImage = e.target.result as string;
        
        toast.success('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  }
}

// Add custom meta tag
function addCustomMetaTag() {
  if ((!newMetaTag.value.name && !newMetaTag.value.property) || !newMetaTag.value.content) {
    toast.error('Please provide a name/property and content for the meta tag');
    return;
  }
  
  if (newMetaTag.value.name) {
    customMetaTags.value.push({
      id: customMetaTags.value.length + 1,
      name: newMetaTag.value.name,
      content: newMetaTag.value.content
    });
  } else if (newMetaTag.value.property) {
    customMetaTags.value.push({
      id: customMetaTags.value.length + 1,
      property: newMetaTag.value.property,
      content: newMetaTag.value.content
    });
  }
  
  newMetaTag.value = { name: '', property: '', content: '' };
  
  toast.success('Meta tag added successfully');
}

// Remove custom meta tag
function removeCustomMetaTag(id: number) {
  customMetaTags.value = customMetaTags.value.filter(tag => tag.id !== id);
  toast.success('Meta tag removed successfully');
}

// Save SEO configuration
async function saveSeoConfig() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would update the config store
    await configStore.updateConfig('seo', seoConfig.value);
    
    toast.success('SEO configuration saved successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to save SEO configuration');
  } finally {
    isLoading.value = false;
  }
}

// Generate sitemap
async function generateSitemap() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would generate a sitemap
    setTimeout(() => {
      toast.success('Sitemap generated successfully');
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error('Failed to generate sitemap');
    isLoading.value = false;
  }
}

onMounted(() => {
  // In a real implementation, this would load from the config store
});

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminSEO',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">SEO & Meta</h1>
    <p class="text-muted-foreground mb-6">
      Configure SEO settings and meta tags for your application
    </p>
    
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="meta">Meta Tags</TabsTrigger>
        <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
      </TabsList>
      
      <!-- Meta Tags Tab -->
      <TabsContent value="meta">
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags Configuration</CardTitle>
            <CardDescription>Configure basic meta tags for SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <Label for="meta-title">Page Title</Label>
                <Input 
                  id="meta-title" 
                  v-model="seoConfig.metaTitle" 
                  placeholder="Your website title"
                />
                <p class="text-sm text-muted-foreground">
                  Used for browser tabs and search engine results
                </p>
              </div>
              
              <div class="space-y-2">
                <Label for="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
                  v-model="seoConfig.metaDescription" 
                  placeholder="A brief description of your website"
                  rows="3"
                />
                <p class="text-sm text-muted-foreground">
                  Appears in search engine results (recommended: 150-160 characters)
                </p>
              </div>
              
              <div class="space-y-2">
                <Label>Open Graph Image</Label>
                <div class="flex items-center gap-4">
                  <div class="border rounded-md overflow-hidden w-40 h-24">
                    <img 
                      :src="seoConfig.ogImage" 
                      alt="OG Image" 
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Button variant="outline" type="button">
                      <label class="cursor-pointer">
                        Upload Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          class="hidden" 
                          @change="uploadImage"
                        />
                      </label>
                    </Button>
                    <p class="text-sm text-muted-foreground mt-2">
                      Recommended size: 1200x630 pixels
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <Label>Custom Meta Tags</Label>
                <div class="border rounded-md p-4 space-y-4">
                  <div class="space-y-2" v-for="tag in customMetaTags" :key="tag.id">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-semibold">{{ tag.name || tag.property }}</span>: 
                        <span class="text-muted-foreground">{{ tag.content }}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        @click="removeCustomMetaTag(tag.id)"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t">
                    <h4 class="text-sm font-medium mb-2">Add New Meta Tag</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <Label for="meta-name">Name / Property</Label>
                        <Input 
                          id="meta-name" 
                          v-model="newMetaTag.name" 
                          placeholder="name or property"
                        />
                      </div>
                      <div>
                        <Label for="meta-content">Content</Label>
                        <Input 
                          id="meta-content" 
                          v-model="newMetaTag.content" 
                          placeholder="content value"
                        />
                      </div>
                      <div class="flex items-end">
                        <Button @click="addCustomMetaTag">Add Tag</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              @click="saveSeoConfig" 
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Meta Tags
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <!-- Sitemap Tab -->
      <TabsContent value="sitemap">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap Configuration</CardTitle>
            <CardDescription>Configure sitemap generation for search engines</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center space-x-2">
                <Switch 
                  id="enable-sitemap" 
                  v-model="seoConfig.enableSitemap"
                />
                <Label for="enable-sitemap">Enable Sitemap Generation</Label>
              </div>
              
              <div class="space-y-2">
                <Label for="robots-txt">Robots.txt Content</Label>
                <Textarea 
                  id="robots-txt" 
                  v-model="seoConfig.robotsTxt" 
                  rows="8"
                  class="font-mono text-sm"
                />
                <p class="text-sm text-muted-foreground">
                  Define which pages search engines should crawl and index
                </p>
              </div>
              
              <div class="pt-4 border-t">
                <h3 class="text-lg font-medium mb-2">Manual Sitemap Generation</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Generate a sitemap.xml file for your website manually
                </p>
                <Button 
                  variant="outline" 
                  @click="generateSitemap"
                  :disabled="isLoading"
                >
                  <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                  Generate Sitemap Now
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              @click="saveSeoConfig" 
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Sitemap Configuration
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <!-- Verification Tab -->
      <TabsContent value="verification">
        <Card>
          <CardHeader>
            <CardTitle>Search Engine Verification</CardTitle>
            <CardDescription>Add verification codes for search engines and webmaster tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <Label for="google-verification">Google Search Console</Label>
                <Input 
                  id="google-verification" 
                  v-model="seoConfig.verificationCodes.google" 
                  placeholder="Enter your Google verification code"
                />
                <p class="text-sm text-muted-foreground">
                  Enter the HTML tag verification code from Google Search Console
                </p>
              </div>
              
              <div class="space-y-2">
                <Label for="bing-verification">Bing Webmaster Tools</Label>
                <Input 
                  id="bing-verification" 
                  v-model="seoConfig.verificationCodes.bing" 
                  placeholder="Enter your Bing verification code"
                />
                <p class="text-sm text-muted-foreground">
                  Enter the meta tag verification code from Bing Webmaster Tools
                </p>
              </div>
              
              <div class="space-y-2">
                <Label for="yandex-verification">Yandex Webmaster</Label>
                <Input 
                  id="yandex-verification" 
                  v-model="seoConfig.verificationCodes.yandex" 
                  placeholder="Enter your Yandex verification code"
                />
                <p class="text-sm text-muted-foreground">
                  Enter the verification code from Yandex Webmaster
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              @click="saveSeoConfig" 
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Verification Codes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 