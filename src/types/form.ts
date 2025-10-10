export interface SessionType {
  id: string
  name: string
  price: number
  shooterPrice: number
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface Addon {
  id: string
  name: string
  price: number
  description?: string
  maxQuantity: number
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface FormSession {
  name: string
  participants: number
}

export interface Form {
  id: string
  title: string
  description: string
  type: string
  createdAt: Date
  updatedAt?: Date
  status: 'draft' | 'published' | 'archived' | 'active'
}

export interface CreateFormRequest {
  title: string
  description?: string
  sessionId?: string
}

export interface UpdateFormRequest {
  title?: string
  description?: string
  status?: Form['status']
}

export interface FormListResponse {
  forms: Form[]
  total: number
  page: number
  limit: number
}

// Field Builder Types
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'file' 
  | 'url' 
  | 'password'

export interface FieldOption {
  id: string
  label: string
  value: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  customMessage?: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  description?: string
  defaultValue?: string | string[] | boolean
  options?: FieldOption[]
  validation?: FieldValidation
  width?: 'full' | 'half' | 'third' | 'quarter'
  order: number
  isVisible?: boolean
  cssClass?: string
}

export interface FieldTypeDefinition {
  type: FieldType
  label: string
  icon: string
  description: string
  category: 'basic' | 'advanced' | 'layout'
  defaultConfig: Partial<FormField>
}

export interface FormBuilder {
  id: string
  title: string
  description?: string
  fields: FormField[]
  settings: {
    submitButtonText?: string
    successMessage?: string
    redirectUrl?: string
    allowMultipleSubmissions?: boolean
    autoHideSuccess?: boolean
    requireAuthentication?: boolean
  }
  createdAt: Date
  updatedAt?: Date
}

// Form Response Types
export interface FormResponseValue {
  fieldId: string
  fieldLabel: string
  fieldType: FieldType
  value: any
  displayValue?: string
}

export interface FormResponse {
  id: string
  formId: string
  submittedAt: Date
  submittedBy?: {
    id: string
    name: string
    email: string
    ip?: string
    userAgent?: string
  }
  values: FormResponseValue[]
  status: 'pending' | 'reviewed' | 'archived' | 'new' | 'contacted' | 'quoted' | 'converted' | 'declined'
  notes?: string
  reviewedBy?: string
  reviewedAt?: Date
}

export interface FormResponseSummary {
  formId: string
  formTitle: string
  totalResponses: number
  pendingResponses: number
  reviewedResponses: number
  archivedResponses: number
  lastResponseAt?: Date
  fieldsUsed: string[]
}

export interface FormResponseListResponse {
  responses: FormResponse[]
  total: number
  page: number
  limit: number
  summary: FormResponseSummary
}

export interface CreateFormResponseRequest {
  formId: string
  values: Record<string, any>
  submittedBy?: {
    name?: string
    email?: string
  }
}

export interface UpdateFormResponseRequest {
  status?: FormResponse['status']
  notes?: string
  reviewedBy?: string
} 