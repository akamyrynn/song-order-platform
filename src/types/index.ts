// Order types
export enum OrderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  PAID = 'paid',
  COMPLETED = 'completed'
}

export enum PricingTier {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  
  // Constructor data
  recipientName: string
  relationship?: string
  occasion?: string
  musicalStyle?: string[]
  specialRequests?: string
  mood?: string
  tempo?: string
  
  // Contact information
  phoneNumber: string
  telegramUserId?: string
  telegramUsername?: string
  
  // Pricing
  selectedTier?: PricingTier
  
  // Files
  songFileUrl?: string
  songFileName?: string
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  readyAt?: Date
  paidAt?: Date
  completedAt?: Date
}

// Message types
export enum MessageSender {
  CLIENT = 'client',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

export interface Message {
  id: string
  orderId: string
  sender: MessageSender
  content: string
  createdAt: Date
  readAt?: Date
}

// Payment types
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  tier: PricingTier
  status: PaymentStatus
  paymentIntentId?: string
  createdAt: Date
  paidAt?: Date
}

// Admin types
export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface AdminUser {
  id: string
  email: string
  passwordHash: string
  name: string
  role: AdminRole
  createdAt: Date
  lastLoginAt?: Date
}

// Input types for creating new records (without auto-generated fields)
export interface CreateOrderInput {
  recipientName: string
  relationship?: string
  occasion?: string
  musicalStyle?: string[]
  specialRequests?: string
  mood?: string
  tempo?: string
  phoneNumber: string
}

export interface CreateMessageInput {
  orderId: string
  sender: MessageSender
  content: string
}

export interface CreatePaymentInput {
  orderId: string
  amount: number
  currency: string
  tier: PricingTier
}

export interface CreateAdminUserInput {
  email: string
  password: string
  name: string
  role: AdminRole
}

// Update types for partial updates
export interface UpdateOrderInput {
  status?: OrderStatus
  phoneNumber?: string
  telegramUserId?: string
  telegramUsername?: string
  selectedTier?: PricingTier
  songFileUrl?: string
  songFileName?: string
  readyAt?: Date
  paidAt?: Date
  completedAt?: Date
}
