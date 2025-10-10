export interface Project {
  id: string
  name: string
  description?: string
  type: 'wedding' | 'portrait' | 'corporate' | 'family' | 'commercial' | 'other'
  status: 'planning' | 'in-progress' | 'completed' | 'delivered' | 'cancelled'
  client: {
    id: string
    name: string
    email: string
    phone?: string
  }
  budget?: number
  eventDate?: Date
  deliveryDate?: Date
  createdAt: Date
  updatedAt?: Date
  convertedFromFormId?: string
  convertedFromResponseId?: string
  photographer?: {
    id: string
    name: string
  }
  location?: string
  notes?: string
  sessions?: ProjectSession[]
  assignedShooters?: Shooter[]
  internalTags?: ProjectTag[]
  discount?: ProjectDiscount
  transportCost?: number
  internalNotes?: string
}

export interface ProjectSession {
  id: string
  title: string
  time: string
  venue: string
  notes?: string
  createdAt: Date
  updatedAt?: Date
}

export interface Shooter {
  id: string
  name: string
  email: string
  phone?: string
  role: 'main' | 'assistant' | 'videographer'
  specialties?: string[]
  dailyRate?: number
  isActive: boolean
}

export interface ProjectTag {
  id: string
  name: string
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'
  priority: 'low' | 'medium' | 'high'
}

export interface ProjectDiscount {
  type: 'percentage' | 'fixed'
  value: number
  reason?: string
  appliedBy?: string
  appliedAt: Date
}

export interface CreateProjectRequest {
  name: string
  description?: string
  type: Project['type']
  clientId: string
  budget?: number
  eventDate?: Date
  deliveryDate?: Date
  location?: string
  notes?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  type?: Project['type']
  status?: Project['status']
  budget?: number
  eventDate?: Date
  deliveryDate?: Date
  location?: string
  notes?: string
}

export interface ProjectListResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
} 