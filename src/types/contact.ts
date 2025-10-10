export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string | null
  status: 'lead' | 'client'
  source?: 'website' | 'referral' | 'social_media' | 'google_ads' | 'direct' | 'other'
  createdAt: Date
  updatedAt?: Date
  lastContactDate?: Date
  projectsCount?: number
  totalValue?: number
  tags?: ContactTag[]
  notes?: string
  address?: ContactAddress
  preferences?: ContactPreferences
}

export interface ContactTag {
  id: string
  name: string
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'
}

export interface ContactAddress {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface ContactPreferences {
  preferredContactMethod: 'email' | 'phone' | 'whatsapp'
  marketingOptIn: boolean
  newsletterOptIn: boolean
  preferredLanguage?: 'en' | 'ms' | 'zh'
}

export interface CreateContactRequest {
  name: string
  email: string
  phone?: string
  company?: string
  source?: Contact['source']
  notes?: string
  address?: ContactAddress
  preferences?: ContactPreferences
}

export interface UpdateContactRequest {
  name?: string
  email?: string
  phone?: string
  company?: string
  status?: Contact['status']
  source?: Contact['source']
  notes?: string
  address?: ContactAddress
  preferences?: ContactPreferences
}

export interface ContactListResponse {
  contacts: Contact[]
  total: number
  page: number
  limit: number
}

export interface ContactStats {
  totalContacts: number
  totalClients: number
  totalProspects: number
  totalValue: number
  averageValue: number
  conversionRate: number
} 