export interface PhotographerReview {
  id: string
  clientName: string
  rating: number
  comment: string
  date: Date
}

export interface PhotographerPortfolioItem {
  id: string
  title: string
  thumbnail: string
}

export interface Photographer {
  id: string
  name: string
  email: string
  phone?: string
  profileImage?: string
  roles: string[]
  status: 'active' | 'inactive'
  availability: 'free' | 'busy' | 'on-leave'
  totalJobs?: number
  completedJobs?: number
  upcomingJobs?: number
  cancelledJobs?: number
  rating?: number
  reviewCount?: number
  dateJoined: Date
  emergencyContact?: string
  identificationNumber?: string
  skills?: string[]
  portfolio?: PhotographerPortfolioItem[]
  recentReviews?: PhotographerReview[]
  notes?: string
}

export type PhotographerStatus = 'active' | 'inactive'
export type PhotographerAvailability = 'free' | 'busy' | 'on-leave'
export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' 