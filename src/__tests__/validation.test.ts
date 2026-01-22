/**
 * Tests for Zod validation schemas
 * Validates: Requirements 2.2, 3.4
 */

import {
  createOrderSchema,
  updateOrderSchema,
  createMessageSchema,
  createPaymentSchema,
  createAdminUserSchema,
  phoneNumberSchema,
  emailSchema,
  orderStatusSchema,
  pricingTierSchema
} from '@/lib/validation';
import { OrderStatus, PricingTier, MessageSender, PaymentStatus, AdminRole } from '@/types';

describe('Validation Schemas', () => {
  describe('Phone Number Validation (Requirement 3.4)', () => {
    it('should accept valid international phone numbers', () => {
      const validNumbers = [
        '+12345678901',
        '+442071234567',
        '+79991234567',
        '12345678901'
      ];

      validNumbers.forEach(number => {
        expect(() => phoneNumberSchema.parse(number)).not.toThrow();
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '123',           // Too short
        '+0123456789',   // Starts with 0
        'abc123456789',  // Contains letters
        '+1-234-567-890' // Contains dashes
      ];

      invalidNumbers.forEach(number => {
        expect(() => phoneNumberSchema.parse(number)).toThrow();
      });
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin+tag@company.org'
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com'
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });

  describe('Order Creation Validation (Requirement 2.2)', () => {
    it('should accept valid order data', () => {
      const validOrder = {
        recipientName: 'John Doe',
        relationship: 'Friend',
        occasion: 'Birthday',
        musicalStyle: ['Pop', 'Rock'],
        specialRequests: 'Make it upbeat',
        mood: 'Happy',
        tempo: 'Fast',
        phoneNumber: '+12345678901'
      };

      expect(() => createOrderSchema.parse(validOrder)).not.toThrow();
    });

    it('should require recipientName and phoneNumber', () => {
      const invalidOrder = {
        relationship: 'Friend'
      };

      expect(() => createOrderSchema.parse(invalidOrder)).toThrow();
    });

    it('should accept minimal valid order data', () => {
      const minimalOrder = {
        recipientName: 'Jane Smith',
        phoneNumber: '+12345678901'
      };

      expect(() => createOrderSchema.parse(minimalOrder)).not.toThrow();
    });

    it('should reject empty recipientName', () => {
      const invalidOrder = {
        recipientName: '',
        phoneNumber: '+12345678901'
      };

      expect(() => createOrderSchema.parse(invalidOrder)).toThrow();
    });

    it('should trim whitespace from text fields', () => {
      const orderWithWhitespace = {
        recipientName: '  John Doe  ',
        phoneNumber: '+12345678901'
      };

      const result = createOrderSchema.parse(orderWithWhitespace);
      expect(result.recipientName).toBe('John Doe');
    });
  });

  describe('Order Status Validation', () => {
    it('should accept valid order statuses', () => {
      const validStatuses = [
        OrderStatus.NEW,
        OrderStatus.IN_PROGRESS,
        OrderStatus.READY,
        OrderStatus.PAID,
        OrderStatus.COMPLETED
      ];

      validStatuses.forEach(status => {
        expect(() => orderStatusSchema.parse(status)).not.toThrow();
      });
    });

    it('should reject invalid order statuses', () => {
      const invalidStatuses = ['invalid', 'pending', 'cancelled'];

      invalidStatuses.forEach(status => {
        expect(() => orderStatusSchema.parse(status)).toThrow();
      });
    });
  });

  describe('Message Creation Validation', () => {
    it('should accept valid message data', () => {
      const validMessage = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        sender: MessageSender.CLIENT,
        content: 'Hello, I have a question about my order'
      };

      expect(() => createMessageSchema.parse(validMessage)).not.toThrow();
    });

    it('should require all fields', () => {
      const invalidMessage = {
        orderId: '123e4567-e89b-12d3-a456-426614174000'
      };

      expect(() => createMessageSchema.parse(invalidMessage)).toThrow();
    });

    it('should reject empty content', () => {
      const invalidMessage = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        sender: MessageSender.CLIENT,
        content: ''
      };

      expect(() => createMessageSchema.parse(invalidMessage)).toThrow();
    });
  });

  describe('Payment Creation Validation', () => {
    it('should accept valid payment data', () => {
      const validPayment = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 99.99,
        currency: 'USD',
        tier: PricingTier.STANDARD
      };

      expect(() => createPaymentSchema.parse(validPayment)).not.toThrow();
    });

    it('should reject negative amounts', () => {
      const invalidPayment = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        amount: -10,
        currency: 'USD',
        tier: PricingTier.BASIC
      };

      expect(() => createPaymentSchema.parse(invalidPayment)).toThrow();
    });

    it('should convert currency to uppercase', () => {
      const payment = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 50,
        currency: 'usd',
        tier: PricingTier.BASIC
      };

      const result = createPaymentSchema.parse(payment);
      expect(result.currency).toBe('USD');
    });
  });

  describe('Admin User Creation Validation', () => {
    it('should accept valid admin user data', () => {
      const validAdmin = {
        email: 'admin@example.com',
        password: 'SecurePass123',
        name: 'Admin User',
        role: AdminRole.ADMIN
      };

      expect(() => createAdminUserSchema.parse(validAdmin)).not.toThrow();
    });

    it('should require strong password', () => {
      const weakPasswords = [
        'short',           // Too short
        'nouppercase1',    // No uppercase
        'NOLOWERCASE1',    // No lowercase
        'NoNumbers'        // No numbers
      ];

      weakPasswords.forEach(password => {
        const invalidAdmin = {
          email: 'admin@example.com',
          password,
          name: 'Admin User',
          role: AdminRole.ADMIN
        };

        expect(() => createAdminUserSchema.parse(invalidAdmin)).toThrow();
      });
    });
  });

  describe('Pricing Tier Validation', () => {
    it('should accept valid pricing tiers', () => {
      const validTiers = [
        PricingTier.BASIC,
        PricingTier.STANDARD,
        PricingTier.PREMIUM
      ];

      validTiers.forEach(tier => {
        expect(() => pricingTierSchema.parse(tier)).not.toThrow();
      });
    });

    it('should reject invalid pricing tiers', () => {
      const invalidTiers = ['free', 'enterprise', 'custom'];

      invalidTiers.forEach(tier => {
        expect(() => pricingTierSchema.parse(tier)).toThrow();
      });
    });
  });
});
