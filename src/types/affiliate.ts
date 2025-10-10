export interface Affiliate {
  id: string
  name: string
  email: string
  phone?: string
  joinDate: Date
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  commissionRate: number // Percentage or fixed amount
  commissionType: 'percentage' | 'fixed'
  totalReferrals: number
  totalCommissionsEarned: number
  unpaidCommissions: number
  paidCommissions: number
  bankDetails?: AffiliateBankDetails
  notes?: string
  referralCode: string
  lastActivity?: Date
}

export interface AffiliateBankDetails {
  bankName: string
  accountNumber: string
  accountHolder: string
  swiftCode?: string
}

export interface AffiliateCommission {
  id: string
  affiliateId: string
  affiliateName: string
  clientId: string
  clientName: string
  bookingId: string
  bookingValue: number
  commissionRate: number
  commissionType: 'percentage' | 'fixed'
  commissionAmount: number
  status: 'pending' | 'paid' | 'cancelled'
  bookingDate: Date
  commissionDate: Date
  paidDate?: Date
  paymentMethod?: 'bank_transfer' | 'ewallet' | 'manual'
  paymentReference?: string
  notes?: string
}

export interface AffiliateSettings {
  defaultCommissionRate: number
  defaultCommissionType: 'percentage' | 'fixed'
  autoPayoutEnabled: boolean
  minimumPayoutAmount: number
  paymentTerms: string
}

export interface CreateAffiliateRequest {
  name: string
  email: string
  phone?: string
  commissionRate?: number
  commissionType?: 'percentage' | 'fixed'
  bankDetails?: AffiliateBankDetails
  notes?: string
}

export interface UpdateAffiliateRequest {
  name?: string
  email?: string
  phone?: string
  status?: Affiliate['status']
  commissionRate?: number
  commissionType?: 'percentage' | 'fixed'
  bankDetails?: AffiliateBankDetails
  notes?: string
}

export interface PayCommissionRequest {
  commissionIds: string[]
  paymentMethod: 'bank_transfer' | 'ewallet' | 'manual'
  paymentReference?: string
  notes?: string
}

export interface AffiliateListResponse {
  affiliates: Affiliate[]
  total: number
  page: number
  limit: number
}

export interface CommissionListResponse {
  commissions: AffiliateCommission[]
  total: number
  page: number
  limit: number
}

export interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalCommissionsPaid: number
  pendingCommissions: number
  totalReferrals: number
  averageCommissionRate: number
} 