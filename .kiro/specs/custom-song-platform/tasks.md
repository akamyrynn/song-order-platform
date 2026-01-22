# Implementation Plan: Custom Song Platform

## Overview

Реализация будет выполнена поэтапно, начиная с настройки инфраструктуры, затем backend API, база данных, Telegram-бот, frontend интерфейс, и наконец интеграция платежной системы. Каждый этап включает реализацию функциональности и соответствующие тесты.

## Tasks

- [x] 1. Setup project infrastructure and database
  - Initialize Next.js project with TypeScript
  - Setup PostgreSQL database with Prisma ORM
  - Create database schema and migrations
  - Configure environment variables
  - Setup testing frameworks (Jest, fast-check)
  - _Requirements: 10.1, 10.4_

- [ ]* 1.1 Write property test for database schema
  - **Property 12: Referential Integrity**
  - **Validates: Requirements 10.4**

- [x] 2. Implement core data models and validation
  - Create TypeScript interfaces for Order, Message, Payment, AdminUser
  - Implement validation schemas using Zod
  - Create Prisma models matching database schema
  - _Requirements: 2.2, 3.4, 10.1_

- [ ]* 2.1 Write property test for form validation
  - **Property 2: Form Validation Consistency**
  - **Validates: Requirements 2.2, 3.4**


- [x] 3. Implement order management backend
  - [x] 3.1 Create order creation endpoint (POST /api/orders)
    - Generate unique order numbers
    - Validate and store constructor parameters
    - Return order details with order number
    - _Requirements: 2.3, 2.4, 3.1_

  - [ ]* 3.2 Write property test for order number uniqueness
    - **Property 1: Order Number Uniqueness**
    - **Validates: Requirements 2.3, 3.1**

  - [ ]* 3.3 Write property test for data persistence
    - **Property 3: Data Persistence Round-Trip**
    - **Validates: Requirements 2.4, 3.5, 4.3, 6.2, 10.1, 10.5**

  - [x] 3.4 Create order retrieval endpoints
    - GET /api/orders/:id for single order
    - GET /api/orders for list with filtering
    - Implement filtering by status, date, order number
    - _Requirements: 5.1, 5.4_

  - [ ]* 3.5 Write property test for order filtering
    - **Property 6: Order Filtering and Search**
    - **Validates: Requirements 5.4**

  - [x] 3.6 Create order update endpoint (PATCH /api/orders/:id)
    - Update order status
    - Update phone number and Telegram info
    - Validate status transitions
    - _Requirements: 3.5, 11.4_

  - [ ]* 3.7 Write property test for valid status states
    - **Property 13: Valid Status States**
    - **Validates: Requirements 11.1**

  - [ ]* 3.8 Write property test for status updates
    - **Property 14: Status Update Capability**
    - **Validates: Requirements 11.4**


- [ ] 4. Implement file upload and storage
  - [ ] 4.1 Setup cloud storage (AWS S3 or similar)
    - Configure storage bucket
    - Implement file upload utility
    - Generate secure signed URLs
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ] 4.2 Create song file upload endpoint (POST /api/orders/:id/song)
    - Validate file format and size
    - Upload to cloud storage
    - Store file URL in database
    - Update order status to "ready"
    - _Requirements: 6.2, 6.3_

  - [ ]* 4.3 Write property test for unique secure links
    - **Property 8: Unique Secure Listening Links**
    - **Validates: Requirements 6.5**

  - [ ] 4.4 Create song file retrieval endpoint (GET /api/orders/:id/song)
    - Generate temporary signed URL
    - Verify order ownership/access
    - _Requirements: 6.5_

  - [ ]* 4.5 Write unit tests for file upload
    - Test file validation
    - Test error handling for invalid files
    - Test storage operations

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 6. Implement Telegram bot
  - [ ] 6.1 Setup Telegram bot with node-telegram-bot-api or Telegraf
    - Configure bot token
    - Setup webhook endpoint
    - Implement command handlers
    - _Requirements: 4.1, 4.2, 4.4_

  - [ ] 6.2 Implement /start command with order linking
    - Parse order number from command parameter
    - Link Telegram user ID to order
    - Send confirmation message
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ]* 6.3 Write property test for Telegram account linking
    - **Property 4: Telegram Bot Account Linking**
    - **Validates: Requirements 4.2, 4.3**

  - [ ] 6.4 Implement notification system
    - Send notification when song is ready
    - Include listening link in notification
    - _Requirements: 6.4_

  - [ ]* 6.5 Write property test for status transitions and notifications
    - **Property 7: Status Transitions and Notifications**
    - **Validates: Requirements 6.3, 7.5, 8.4, 11.2, 11.5**

  - [ ] 6.6 Implement file delivery after payment
    - Send song file to client
    - Send tier-specific message
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 6.7 Write property test for payment-triggered file delivery
    - **Property 9: Payment-Triggered File Delivery**
    - **Validates: Requirements 8.1**

  - [ ]* 6.8 Write property test for tier-specific messaging
    - **Property 10: Tier-Specific Messaging**
    - **Validates: Requirements 8.2, 8.3**


- [ ] 7. Implement messaging system
  - [ ] 7.1 Create message endpoints
    - POST /api/orders/:id/messages for sending messages
    - GET /api/orders/:id/messages for retrieving history
    - Store sender type (client/admin/system)
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ] 7.2 Implement bidirectional message routing
    - Forward client messages from Telegram to admin panel
    - Forward admin messages to Telegram
    - Store all messages in database
    - _Requirements: 9.2, 9.3, 9.4, 9.5_

  - [ ]* 7.3 Write property test for bidirectional messaging
    - **Property 11: Bidirectional Message Persistence**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**

  - [ ]* 7.4 Write unit tests for message routing
    - Test message delivery to Telegram
    - Test message storage
    - Test error handling

- [ ] 8. Checkpoint - Ensure backend and bot integration works
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 9. Implement payment integration
  - [ ] 9.1 Setup payment provider (Stripe or similar)
    - Configure API keys
    - Setup webhook endpoint
    - _Requirements: 7.3, 7.4_

  - [ ] 9.2 Create payment endpoints
    - POST /api/payments/create for payment intent
    - POST /api/payments/webhook for payment confirmation
    - Update order status on successful payment
    - _Requirements: 7.5_

  - [ ]* 9.3 Write unit tests for payment flow
    - Test payment intent creation
    - Test webhook handling
    - Test status updates after payment

- [x] 10. Implement frontend landing page
  - [x] 10.1 Create landing page with distinctive design
    - Implement hero section with custom typography
    - Add navigation to constructor
    - Implement animations and visual effects
    - Use CSS variables for theming
    - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3, 12.5, 12.7_

  - [ ]* 10.2 Write unit tests for landing page
    - Test navigation functionality
    - Test component rendering


- [x] 11. Implement constructor interface
  - [x] 11.1 Create multi-step form component
    - Implement form fields for all song parameters
    - Add progress indicator
    - Implement form validation with Zod
    - Add smooth transitions between steps
    - _Requirements: 2.1, 2.2_

  - [x] 11.2 Implement form submission
    - Call order creation API
    - Handle success and error states
    - Display generated order number
    - _Requirements: 2.3, 3.2_

  - [x] 11.3 Create phone number input component
    - Implement phone number validation
    - Add international format support
    - _Requirements: 3.3, 3.4_

  - [x] 11.4 Implement Telegram redirect
    - Generate Telegram bot deep link with order number
    - Add redirect button
    - _Requirements: 4.1_

  - [ ]* 11.5 Write unit tests for constructor
    - Test form validation
    - Test form submission
    - Test error handling
    - Test Telegram redirect generation


- [ ] 12. Implement payment UI
  - [ ] 12.1 Create pricing tier selection component
    - Display tier options with descriptions
    - Implement tier comparison
    - Add distinctive visual design
    - _Requirements: 7.1, 7.2_

  - [ ] 12.2 Integrate payment form
    - Implement Stripe Elements or similar
    - Handle payment submission
    - Display success/error states
    - _Requirements: 7.3_

  - [ ]* 12.3 Write unit tests for payment UI
    - Test tier selection
    - Test payment form rendering
    - Test error handling

- [ ] 13. Checkpoint - Ensure frontend works end-to-end
  - Ensure all tests pass, ask the user if questions arise.


- [-] 14. Implement admin panel
  - [ ] 14.1 Create admin authentication
    - Implement login page
    - Setup JWT authentication
    - Add protected routes
    - _Requirements: 5.1_

  - [x] 14.2 Create orders dashboard
    - Display order statistics
    - Show recent orders list
    - Implement status badges
    - _Requirements: 5.1, 11.3_

  - [ ]* 14.3 Write property test for admin panel data completeness
    - **Property 5: Admin Panel Data Completeness**
    - **Validates: Requirements 5.1, 5.2, 11.3**

  - [x] 14.4 Create orders list view
    - Implement filterable table
    - Add search functionality
    - Implement sorting and pagination
    - _Requirements: 5.1, 5.4_

  - [x] 14.5 Create order detail view
    - Display all order information
    - Show constructor parameters in structured format
    - Display contact information
    - Show message thread
    - _Requirements: 5.2_

  - [ ] 14.6 Implement file upload interface
    - Create drag-and-drop upload component
    - Add file validation
    - Show upload progress
    - Add audio preview/playback
    - _Requirements: 6.1_

  - [x] 14.7 Implement status management controls
    - Add status update dropdown
    - Trigger notifications on status change
    - _Requirements: 11.4, 11.5_

  - [ ] 14.8 Implement messaging interface
    - Display conversation thread
    - Add reply input
    - Send messages to Telegram
    - _Requirements: 9.3, 9.5_

  - [ ]* 14.9 Write unit tests for admin panel
    - Test authentication
    - Test order list filtering
    - Test file upload
    - Test messaging


- [x] 15. Implement visual design system
  - [x] 15.1 Create design tokens and CSS variables
    - Define color palette
    - Define typography scale
    - Define spacing system
    - Define animation timings
    - _Requirements: 12.2_

  - [x] 15.2 Implement custom typography
    - Select and integrate distinctive fonts
    - Create typography components
    - Ensure cross-browser compatibility
    - _Requirements: 12.1_

  - [x] 15.3 Implement animations and micro-interactions
    - Add page load animations with staggered reveals
    - Implement hover states
    - Add transition effects
    - Use Framer Motion for complex animations
    - _Requirements: 12.3, 12.7_

  - [x] 15.4 Create atmospheric backgrounds and visual details
    - Implement gradient meshes or textures
    - Add layered transparencies
    - Create decorative elements
    - _Requirements: 12.5_

  - [ ]* 15.5 Write unit tests for design system
    - Test CSS variable definitions
    - Test component styling

- [ ] 16. Final integration and testing
  - [ ] 16.1 Implement error handling across all components
    - Add error boundaries in React
    - Implement API error handling
    - Add user-friendly error messages
    - _Requirements: All_

  - [ ]* 16.2 Run all property-based tests
    - Execute full test suite with 100+ iterations
    - Verify all properties pass
    - _Requirements: All_

  - [ ]* 16.3 Run integration tests
    - Test complete order flow
    - Test payment and delivery flow
    - Test admin-client communication
    - _Requirements: All_

- [ ] 17. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.



## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: infrastructure → backend → bot → frontend → admin panel
- All code will be written in TypeScript for type safety
- Testing framework: Jest for unit tests, fast-check for property-based tests
- Each property-based test must be tagged with: `Feature: custom-song-platform, Property {N}: {property_text}`
