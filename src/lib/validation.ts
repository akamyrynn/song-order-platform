/**
 * Zod validation schemas for the Custom Song Platform
 * These schemas validate input data according to requirements 2.2, 3.4, 10.1
 */

import { z } from 'zod';
import { OrderStatus, PricingTier, MessageSender, PaymentStatus, AdminRole } from '@/types';

// Enum schemas
export const orderStatusSchema = z.enum([
  OrderStatus.NEW,
  OrderStatus.IN_PROGRESS,
  OrderStatus.READY,
  OrderStatus.PAID,
  OrderStatus.COMPLETED
]);

export const pricingTierSchema = z.enum([
  PricingTier.BASIC,
  PricingTier.STANDARD,
  PricingTier.PREMIUM
]);

export const messageSenderSchema = z.enum([
  MessageSender.CLIENT,
  MessageSender.ADMIN,
  MessageSender.SYSTEM
]);

export const paymentStatusSchema = z.enum([
  PaymentStatus.PENDING,
  PaymentStatus.SUCCEEDED,
  PaymentStatus.FAILED,
  PaymentStatus.REFUNDED
]);

export const adminRoleSchema = z.enum([
  AdminRole.ADMIN,
  AdminRole.SUPER_ADMIN
]);

// Phone number validation (international format)
// Validates: Requirements 3.4
export const phoneNumberSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must not exceed 20 characters')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Use international format (e.g., +1234567890)');

// Email validation
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

// Order validation schemas
// Validates: Requirements 2.2
export const createOrderSchema = z.object({
  recipientName: z.string()
    .min(1, 'Recipient name is required')
    .max(255, 'Recipient name must not exceed 255 characters')
    .trim(),
  
  relationship: z.string()
    .max(100, 'Relationship must not exceed 100 characters')
    .trim()
    .optional(),
  
  occasion: z.string()
    .max(100, 'Occasion must not exceed 100 characters')
    .trim()
    .optional(),
  
  musicalStyle: z.array(z.string())
    .min(1, 'At least one musical style must be selected')
    .max(10, 'Maximum 10 musical styles allowed')
    .optional(),
  
  specialRequests: z.string()
    .max(5000, 'Special requests must not exceed 5000 characters')
    .trim()
    .optional(),
  
  mood: z.string()
    .max(50, 'Mood must not exceed 50 characters')
    .trim()
    .optional(),
  
  tempo: z.string()
    .max(50, 'Tempo must not exceed 50 characters')
    .trim()
    .optional(),
  
  phoneNumber: phoneNumberSchema
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  telegramUserId: z.string().max(50).optional(),
  telegramUsername: z.string().max(100).optional(),
  selectedTier: pricingTierSchema.optional(),
  songFileUrl: z.string().url('Invalid song file URL').optional(),
  songFileName: z.string().max(255).optional(),
  readyAt: z.coerce.date().optional(),
  paidAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional()
}).strict();

// Message validation schemas
export const createMessageSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  sender: messageSenderSchema,
  content: z.string()
    .min(1, 'Message content is required')
    .max(10000, 'Message content must not exceed 10000 characters')
    .trim()
});

// Payment validation schemas
export const createPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  amount: z.number()
    .positive('Amount must be positive')
    .max(999999.99, 'Amount exceeds maximum allowed'),
  currency: z.string()
    .length(3, 'Currency code must be 3 characters')
    .toUpperCase(),
  tier: pricingTierSchema
});

export const updatePaymentSchema = z.object({
  status: paymentStatusSchema.optional(),
  paymentIntentId: z.string().max(255).optional(),
  paidAt: z.coerce.date().optional()
}).strict();

// Admin User validation schemas
export const createAdminUserSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters')
    .trim(),
  role: adminRoleSchema
});

export const updateAdminUserSchema = z.object({
  email: emailSchema.optional(),
  name: z.string().min(1).max(255).trim().optional(),
  role: adminRoleSchema.optional(),
  lastLoginAt: z.coerce.date().optional()
}).strict();

// Query parameter validation schemas
export const orderFilterSchema = z.object({
  status: orderStatusSchema.optional(),
  orderNumber: z.string().optional(),
  telegramUserId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

// UUID validation helper
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Type exports for use in API handlers
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
