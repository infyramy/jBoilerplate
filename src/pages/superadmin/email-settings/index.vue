<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-vue-next';

const configStore = useConfigStore();
const toast = useToast();

const activeTab = ref('config');
const isLoading = ref(false);
const providerType = ref<'smtp' | 'plunk'>('smtp');

// Email configuration
const emailConfig = ref({
  from: 'noreply@jboilerplate.com',
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    secure: true,
    auth: {
      user: 'username',
      pass: '********'
    }
  },
  plunk: {
    apiKey: '********'
  }
});

// Templates
const templates = [
  { id: 'registration', name: 'Registration Email' },
  { id: 'reset', name: 'Password Reset' },
  { id: 'verification', name: 'Email Verification' },
  { id: 'invitation', name: 'User Invitation' },
  { id: 'notification', name: 'Notification' }
];

const selectedTemplate = ref(templates[0].id);
const templateSubject = ref('Welcome to jBoilerplate');
const templateContent = ref(`<h1>Welcome to jBoilerplate!</h1>
<p>Hello {{user.name}},</p>
<p>Thank you for registering with jBoilerplate. Your account has been created successfully.</p>
<p>Your login details:</p>
<ul>
  <li>Email: {{user.email}}</li>
  <li>Password: The one you set during registration</li>
</ul>
<p>Please click the button below to verify your email address:</p>
<p><a href="{{verificationLink}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
<p>If you have any questions, feel free to contact our support team.</p>
<p>Best regards,<br>The {{site.name}} Team</p>`);

// Available variables for templates
const templateVariables = [
  { name: '{{user.name}}', description: 'User\'s full name' },
  { name: '{{user.email}}', description: 'User\'s email address' },
  { name: '{{user.firstName}}', description: 'User\'s first name' },
  { name: '{{user.lastName}}', description: 'User\'s last name' },
  { name: '{{site.name}}', description: 'Website name' },
  { name: '{{site.url}}', description: 'Website URL' },
  { name: '{{verificationLink}}', description: 'Email verification link' },
  { name: '{{resetLink}}', description: 'Password reset link' },
  { name: '{{invitationLink}}', description: 'Invitation link' }
];

// Load template based on selection
function loadTemplate(templateId: string) {
  isLoading.value = true;
  
  // In a real implementation, this would load from the config store or API
  setTimeout(() => {
    switch(templateId) {
      case 'registration':
        templateSubject.value = 'Welcome to jBoilerplate';
        templateContent.value = `<h1>Welcome to jBoilerplate!</h1>
<p>Hello {{user.name}},</p>
<p>Thank you for registering with jBoilerplate. Your account has been created successfully.</p>
<p>Your login details:</p>
<ul>
  <li>Email: {{user.email}}</li>
  <li>Password: The one you set during registration</li>
</ul>
<p>Please click the button below to verify your email address:</p>
<p><a href="{{verificationLink}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
<p>If you have any questions, feel free to contact our support team.</p>
<p>Best regards,<br>The {{site.name}} Team</p>`;
        break;
      case 'reset':
        templateSubject.value = 'Reset Your Password';
        templateContent.value = `<h1>Reset Your Password</h1>
<p>Hello {{user.name}},</p>
<p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
<p>To reset your password, click the button below:</p>
<p><a href="{{resetLink}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>Best regards,<br>The {{site.name}} Team</p>`;
        break;
      case 'verification':
        templateSubject.value = 'Verify Your Email Address';
        templateContent.value = `<h1>Verify Your Email Address</h1>
<p>Hello {{user.name}},</p>
<p>Please verify your email address by clicking the button below:</p>
<p><a href="{{verificationLink}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
<p>Best regards,<br>The {{site.name}} Team</p>`;
        break;
      case 'invitation':
        templateSubject.value = 'You\'ve Been Invited to Join jBoilerplate';
        templateContent.value = `<h1>You've Been Invited!</h1>
<p>Hello,</p>
<p>You've been invited to join jBoilerplate. Click the button below to accept the invitation and create your account:</p>
<p><a href="{{invitationLink}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Accept Invitation</a></p>
<p>Best regards,<br>The {{site.name}} Team</p>`;
        break;
      case 'notification':
        templateSubject.value = 'Notification from jBoilerplate';
        templateContent.value = `<h1>Notification</h1>
<p>Hello {{user.name}},</p>
<p>This is a notification from jBoilerplate.</p>
<p>Best regards,<br>The {{site.name}} Team</p>`;
        break;
    }
    isLoading.value = false;
  }, 500);
}

// Save email configuration
async function saveEmailConfig() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would update the config store
    await configStore.updateConfig('email', {
      provider: providerType.value,
      from: emailConfig.value.from,
      smtp: emailConfig.value.smtp,
      plunk: emailConfig.value.plunk
    });
    
    toast.success('Email configuration saved successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to save email configuration');
  } finally {
    isLoading.value = false;
  }
}

// Save email template
async function saveEmailTemplate() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would save the template to the config store or API
    setTimeout(() => {
      toast.success('Email template saved successfully');
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.error(error);
    toast.error('Failed to save email template');
    isLoading.value = false;
  }
}

// Test email configuration
async function testEmailConnection() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would test the email connection
    setTimeout(() => {
      toast.success('Email connection test successful');
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error('Email connection test failed');
    isLoading.value = false;
  }
}

// Send test email
async function sendTestEmail() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would send a test email
    setTimeout(() => {
      toast.success('Test email sent successfully');
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error('Failed to send test email');
    isLoading.value = false;
  }
}

// Insert variable into template
function insertVariable(variable: string) {
  // In a real implementation, this would insert the variable at the cursor position
  templateContent.value += ' ' + variable;
}

onMounted(() => {
  // In a real implementation, this would load from the config store
  providerType.value = 'smtp';
});

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminEmailSettings',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Email Settings</h1>
    
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="config">Configuration</TabsTrigger>
        <TabsTrigger value="templates">Email Templates</TabsTrigger>
      </TabsList>
      
      <!-- Email Configuration Tab -->
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>Email Provider Configuration</CardTitle>
            <CardDescription>Configure your email provider settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <Label>Email Provider</Label>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="smtp" 
                      name="provider" 
                      value="smtp" 
                      v-model="providerType" 
                      class="h-4 w-4"
                    />
                    <Label for="smtp">SMTP</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="plunk" 
                      name="provider" 
                      value="plunk" 
                      v-model="providerType"
                      class="h-4 w-4"
                    />
                    <Label for="plunk">Plunk</Label>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <Label for="from-email">From Email Address</Label>
                <Input 
                  id="from-email" 
                  v-model="emailConfig.from" 
                  placeholder="noreply@example.com"
                />
                <p class="text-sm text-muted-foreground">
                  The email address that will be used as the sender for all emails
                </p>
              </div>
              
              <div v-if="providerType === 'smtp'" class="space-y-4">
                <h3 class="text-lg font-medium">SMTP Settings</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="smtp-host">SMTP Host</Label>
                    <Input 
                      id="smtp-host" 
                      v-model="emailConfig.smtp.host" 
                      placeholder="smtp.example.com"
                    />
                  </div>
                  
                  <div class="space-y-2">
                    <Label for="smtp-port">SMTP Port</Label>
                    <Input 
                      id="smtp-port" 
                      v-model="emailConfig.smtp.port" 
                      placeholder="587"
                      type="number"
                    />
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <Switch 
                    id="secure" 
                    v-model="emailConfig.smtp.secure"
                  />
                  <Label for="secure">Use Secure Connection (SSL/TLS)</Label>
                </div>
                
                <div class="space-y-4">
                  <h4 class="text-md font-medium">Authentication</h4>
                  
                  <div class="space-y-2">
                    <Label for="smtp-user">Username</Label>
                    <Input 
                      id="smtp-user" 
                      v-model="emailConfig.smtp.auth.user" 
                      placeholder="username"
                    />
                  </div>
                  
                  <div class="space-y-2">
                    <Label for="smtp-pass">Password</Label>
                    <Input 
                      id="smtp-pass" 
                      v-model="emailConfig.smtp.auth.pass" 
                      placeholder="********"
                      type="password"
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="providerType === 'plunk'" class="space-y-4">
                <h3 class="text-lg font-medium">Plunk Settings</h3>
                
                <div class="space-y-2">
                  <Label for="plunk-api-key">API Key</Label>
                  <Input 
                    id="plunk-api-key" 
                    v-model="emailConfig.plunk.apiKey" 
                    placeholder="pk_..."
                    type="password"
                  />
                  <p class="text-sm text-muted-foreground">
                    Your Plunk API key can be found in your Plunk dashboard
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button 
              variant="outline" 
              @click="testEmailConnection"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Test Connection
            </Button>
            <Button 
              @click="saveEmailConfig"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <!-- Email Templates Tab -->
      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Customize your email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <Label for="template-select">Select Template</Label>
                <Select 
                  v-model="selectedTemplate"
                  @update:modelValue="(val) => val && loadTemplate(val.toString())"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="template in templates" 
                      :key="template.id" 
                      :value="template.id"
                    >
                      {{ template.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <Label for="template-subject">Email Subject</Label>
                <Input 
                  id="template-subject" 
                  v-model="templateSubject" 
                  placeholder="Email Subject"
                />
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <Label>Email Content</Label>
                  <div class="border rounded-md p-2 min-h-[400px] bg-background">
                    <textarea 
                      v-model="templateContent"
                      class="w-full h-full min-h-[400px] resize-none border-0 focus:ring-0 focus:outline-none bg-transparent"
                    ></textarea>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    HTML is supported. Use the variables listed below to personalize your emails.
                  </p>
                </div>
                
                <div class="space-y-4">
                  <div class="space-y-2">
                    <Label>Preview</Label>
                    <div 
                      class="border rounded-md p-4 min-h-[400px] bg-white overflow-auto"
                      v-html="templateContent"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <Label>Available Variables</Label>
                <div class="flex flex-wrap gap-2">
                  <Button 
                    v-for="variable in templateVariables" 
                    :key="variable.name"
                    variant="outline" 
                    size="sm"
                    @click="insertVariable(variable.name)"
                    class="flex items-center gap-1"
                  >
                    {{ variable.name }}
                    <span class="text-xs text-muted-foreground">{{ variable.description }}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button 
              variant="outline" 
              @click="sendTestEmail"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Send Test Email
            </Button>
            <Button 
              @click="saveEmailTemplate"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Template
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 