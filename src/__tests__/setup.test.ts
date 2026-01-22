/**
 * Basic setup verification tests
 */

describe('Project Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true)
  })

  it('should be able to import TypeScript types', () => {
    const { OrderStatus, PricingTier, MessageSender } = require('@/types')
    
    expect(OrderStatus.NEW).toBe('new')
    expect(PricingTier.BASIC).toBe('basic')
    expect(MessageSender.CLIENT).toBe('client')
  })
})
