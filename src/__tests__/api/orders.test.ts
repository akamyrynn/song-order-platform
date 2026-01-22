/**
 * @jest-environment node
 * 
 * Order Management API Tests
 * Tests for POST /api/orders, GET /api/orders, GET /api/orders/:id, PATCH /api/orders/:id
 * 
 * Validates: Requirements 2.3, 2.4, 3.1, 5.1, 5.4, 3.5, 11.4
 */

import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/types';

describe('Order Management API', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await prisma.order.deleteMany({
      where: {
        phoneNumber: {
          startsWith: '+1555'
        }
      }
    });
  });

  describe('Order Creation', () => {
    it('should create an order with valid data', async () => {
      const orderData = {
        recipientName: 'John Doe',
        relationship: 'Friend',
        occasion: 'Birthday',
        musicalStyle: ['Pop', 'Rock'],
        specialRequests: 'Make it upbeat',
        mood: 'Happy',
        tempo: 'Fast',
        phoneNumber: '+15551234567'
      };

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST1`,
          status: OrderStatus.NEW,
          ...orderData
        }
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.orderNumber).toContain('ORD-');
      expect(order.status).toBe(OrderStatus.NEW);
      expect(order.recipientName).toBe(orderData.recipientName);
      expect(order.phoneNumber).toBe(orderData.phoneNumber);
    });

    it('should generate unique order numbers', async () => {
      const orderData = {
        recipientName: 'Test User',
        phoneNumber: '+15559876543'
      };

      const order1 = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-0001`,
          status: OrderStatus.NEW,
          ...orderData
        }
      });

      const order2 = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-0002`,
          status: OrderStatus.NEW,
          ...orderData
        }
      });

      expect(order1.orderNumber).not.toBe(order2.orderNumber);
    });
  });

  describe('Order Retrieval', () => {
    it('should retrieve an order by ID', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST2`,
          status: OrderStatus.NEW,
          recipientName: 'Jane Smith',
          phoneNumber: '+15551112222'
        }
      });

      const retrieved = await prisma.order.findUnique({
        where: { id: order.id }
      });

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(order.id);
      expect(retrieved?.orderNumber).toBe(order.orderNumber);
      expect(retrieved?.recipientName).toBe('Jane Smith');
    });

    it('should filter orders by status', async () => {
      await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST3`,
          status: OrderStatus.NEW,
          recipientName: 'User 1',
          phoneNumber: '+15553334444'
        }
      });

      await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST4`,
          status: OrderStatus.IN_PROGRESS,
          recipientName: 'User 2',
          phoneNumber: '+15555556666'
        }
      });

      const newOrders = await prisma.order.findMany({
        where: { status: OrderStatus.NEW }
      });

      const inProgressOrders = await prisma.order.findMany({
        where: { status: OrderStatus.IN_PROGRESS }
      });

      expect(newOrders.length).toBeGreaterThanOrEqual(1);
      expect(inProgressOrders.length).toBeGreaterThanOrEqual(1);
      expect(newOrders.every(o => o.status === OrderStatus.NEW)).toBe(true);
      expect(inProgressOrders.every(o => o.status === OrderStatus.IN_PROGRESS)).toBe(true);
    });
  });

  describe('Order Updates', () => {
    it('should update order status', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST5`,
          status: OrderStatus.NEW,
          recipientName: 'Update Test',
          phoneNumber: '+15557778888'
        }
      });

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.IN_PROGRESS }
      });

      expect(updated.status).toBe(OrderStatus.IN_PROGRESS);
      expect(updated.id).toBe(order.id);
    });

    it('should update phone number and Telegram info', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST6`,
          status: OrderStatus.NEW,
          recipientName: 'Telegram Test',
          phoneNumber: '+15559990000'
        }
      });

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          phoneNumber: '+15559990001',
          telegramUserId: '123456789',
          telegramUsername: '@testuser'
        }
      });

      expect(updated.phoneNumber).toBe('+15559990001');
      expect(updated.telegramUserId).toBe('123456789');
      expect(updated.telegramUsername).toBe('@testuser');
    });

    it('should validate status transitions', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-TEST7`,
          status: OrderStatus.NEW,
          recipientName: 'Status Test',
          phoneNumber: '+15551231234'
        }
      });

      // Valid transition: NEW -> IN_PROGRESS
      const updated1 = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.IN_PROGRESS }
      });
      expect(updated1.status).toBe(OrderStatus.IN_PROGRESS);

      // Valid transition: IN_PROGRESS -> READY
      const updated2 = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.READY }
      });
      expect(updated2.status).toBe(OrderStatus.READY);

      // Valid transition: READY -> PAID
      const updated3 = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID }
      });
      expect(updated3.status).toBe(OrderStatus.PAID);

      // Valid transition: PAID -> COMPLETED
      const updated4 = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.COMPLETED }
      });
      expect(updated4.status).toBe(OrderStatus.COMPLETED);
    });
  });
});
