/**
 * Infrastructure setup verification tests
 * These tests verify that the project infrastructure is correctly configured
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client'
import * as fc from 'fast-check'
import { PBT_CONFIG } from './helpers/pbt-config'

describe('Infrastructure Setup', () => {
  describe('Prisma Client', () => {
    it('should be able to instantiate Prisma Client', () => {
      const prisma = new PrismaClient()
      expect(prisma).toBeDefined()
      expect(prisma.order).toBeDefined()
      expect(prisma.message).toBeDefined()
      expect(prisma.payment).toBeDefined()
      expect(prisma.adminUser).toBeDefined()
    })
  })

  describe('Fast-check (Property-Based Testing)', () => {
    it('should be able to run property-based tests', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          return n + 0 === n
        }),
        { numRuns: PBT_CONFIG.numRuns }
      )
    })

    it('should support string generators', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          return s.length >= 0
        }),
        { numRuns: PBT_CONFIG.numRuns }
      )
    })

    it('should support array generators', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          return arr.length >= 0
        }),
        { numRuns: PBT_CONFIG.numRuns }
      )
    })
  })

  describe('TypeScript Types', () => {
    it('should have all required enums defined', () => {
      const types = require('@/types')
      
      expect(types.OrderStatus).toBeDefined()
      expect(types.PricingTier).toBeDefined()
      expect(types.MessageSender).toBeDefined()
      expect(types.PaymentStatus).toBeDefined()
      expect(types.AdminRole).toBeDefined()
    })

    it('should have correct enum values', () => {
      const { OrderStatus, PricingTier, MessageSender, PaymentStatus, AdminRole } = require('@/types')
      
      // OrderStatus
      expect(OrderStatus.NEW).toBe('new')
      expect(OrderStatus.IN_PROGRESS).toBe('in_progress')
      expect(OrderStatus.READY).toBe('ready')
      expect(OrderStatus.PAID).toBe('paid')
      expect(OrderStatus.COMPLETED).toBe('completed')
      
      // PricingTier
      expect(PricingTier.BASIC).toBe('basic')
      expect(PricingTier.STANDARD).toBe('standard')
      expect(PricingTier.PREMIUM).toBe('premium')
      
      // MessageSender
      expect(MessageSender.CLIENT).toBe('client')
      expect(MessageSender.ADMIN).toBe('admin')
      expect(MessageSender.SYSTEM).toBe('system')
      
      // PaymentStatus
      expect(PaymentStatus.PENDING).toBe('pending')
      expect(PaymentStatus.SUCCEEDED).toBe('succeeded')
      expect(PaymentStatus.FAILED).toBe('failed')
      expect(PaymentStatus.REFUNDED).toBe('refunded')
      
      // AdminRole
      expect(AdminRole.ADMIN).toBe('admin')
      expect(AdminRole.SUPER_ADMIN).toBe('super_admin')
    })
  })

  describe('Environment Configuration', () => {
    it('should have DATABASE_URL configured', () => {
      // In test environment, we just check if the env var exists
      // Actual database connection will be tested in integration tests
      expect(process.env.DATABASE_URL).toBeDefined()
    })
  })
})
