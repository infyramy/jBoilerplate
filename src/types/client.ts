export interface ClientAuthCredentials {
  code: string
}

export interface ClientOTPCredentials {
  code: string
  otp: string
}

export interface ClientAuthResponse {
  success: boolean
  message?: string
  requiresOTP?: boolean
  sessionToken?: string
}

export interface ClientUser {
  id: string
  name: string
  email: string
  phone?: string
}

export interface ClientProject {
  id: string
  name: string
  description?: string
  type: 'wedding' | 'portrait' | 'corporate' | 'family' | 'commercial' | 'other'
  status: 'planning' | 'in-progress' | 'completed' | 'delivered' | 'cancelled'
  budget?: number
  eventDate?: Date
  deliveryDate?: Date
  createdAt: Date
  location?: string
  sessions?: ClientProjectSession[]
  progress?: number
}

export interface ClientProjectSession {
  id: string
  title: string
  time: string
  venue: string
  notes?: string
}

export interface ClientDashboardData {
  user: ClientUser
  projects: {
    past: ClientProject[]
    current: ClientProject[]
    upcoming: ClientProject[]
  }
} 