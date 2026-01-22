# Design Document: Custom Song Platform

## Overview

Платформа для создания персонализированных песен представляет собой full-stack веб-приложение с интеграцией Telegram-бота. Система состоит из клиентского веб-интерфейса, административной панели, backend API, базы данных, Telegram-бота и платежной системы.

Архитектура построена на принципах разделения ответственности, где каждый компонент выполняет четко определенную роль. Веб-интерфейс обеспечивает пользовательский опыт, backend управляет бизнес-логикой, Telegram-бот обрабатывает коммуникацию, а база данных обеспечивает персистентность.

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Client Web App │────────▶│   Backend API    │
│  (React/Next.js)│         │   (Node.js)      │
└─────────────────┘         └──────────────────┘
                                     │
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐  ┌──────────┐  ┌──────────────┐
            │   Database   │  │ Telegram │  │   Payment    │
            │  (PostgreSQL)│  │   Bot    │  │   Gateway    │
            └──────────────┘  └──────────┘  └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Admin Panel  │
                              │   (Web UI)   │
                              └──────────────┘
```



### Technology Stack

**Frontend:**
- Framework: Next.js 14+ (React with App Router)
- Styling: CSS Modules with CSS Variables for theming
- Animations: Framer Motion for complex animations, CSS animations for simple effects
- Typography: Custom font pairings (e.g., display font + refined body font)
- State Management: React Context API + Server Components

**Backend:**
- Runtime: Node.js with TypeScript
- Framework: Express.js or Fastify
- API Style: RESTful with JSON
- File Storage: Cloud storage (AWS S3 or similar)
- Authentication: JWT tokens

**Database:**
- Primary: PostgreSQL
- ORM: Prisma or TypeORM
- Caching: Redis (optional for performance)

**Telegram Integration:**
- Library: node-telegram-bot-api or Telegraf
- Webhook-based for real-time messaging

**Payment:**
- Provider: Stripe, PayPal, or local payment gateway
- Integration: Server-side SDK

**Deployment:**
- Frontend: Vercel or Netlify
- Backend: Railway, Render, or AWS
- Database: Managed PostgreSQL (Supabase, Railway, or AWS RDS)



## Components and Interfaces

### 1. Client Web Application

**Landing Page Component**
- Hero section with compelling visuals and call-to-action
- Navigation to constructor
- Social proof elements (testimonials, examples)
- Distinctive visual design with custom typography and animations

**Constructor Component**
- Multi-step form with progress indicator
- Form fields:
  - Recipient name and relationship
  - Occasion/event type
  - Musical style preferences
  - Special requests/lyrics ideas
  - Mood/tempo preferences
- Real-time validation
- Form state persistence (localStorage)
- Smooth transitions between steps

**Order Confirmation Component**
- Display generated order number
- Phone number input with validation
- Telegram redirect button with deep link
- Order summary

**Payment Component**
- Pricing tier selection cards
- Tier comparison table
- Payment form integration
- Success/failure handling



### 2. Backend API

**Endpoints:**

```typescript
// Orders
POST   /api/orders              // Create new order
GET    /api/orders/:id          // Get order details
PATCH  /api/orders/:id          // Update order status
GET    /api/orders              // List all orders (admin)

// Files
POST   /api/orders/:id/song     // Upload song file (admin)
GET    /api/orders/:id/song     // Get song file URL

// Messages
POST   /api/orders/:id/messages // Send message
GET    /api/orders/:id/messages // Get message history

// Payments
POST   /api/payments/create     // Create payment intent
POST   /api/payments/webhook    // Payment webhook handler

// Telegram
POST   /api/telegram/webhook    // Telegram bot webhook
POST   /api/telegram/link       // Link Telegram user to order
```

**Middleware:**
- Authentication (JWT verification for admin routes)
- Request validation (Zod or Joi schemas)
- Error handling
- Rate limiting
- CORS configuration



### 3. Admin Panel

**Dashboard View**
- Order statistics (total, pending, completed)
- Recent orders list
- Quick actions

**Orders List View**
- Filterable table (status, date, search)
- Sortable columns
- Pagination
- Status badges with color coding

**Order Detail View**
- Complete order information display
- Constructor parameters in structured format
- Contact information (phone, Telegram)
- Status management controls
- Song file upload interface
- Message thread display
- Reply interface for customer communication

**File Upload Component**
- Drag-and-drop interface
- File validation (format, size)
- Upload progress indicator
- Preview/playback capability



### 4. Telegram Bot

**Bot Commands:**
- `/start [orderNumber]` - Link Telegram account to order
- `/status` - Check order status
- `/help` - Display help information

**Bot Handlers:**
- Message handler - Forward client messages to admin panel
- Notification sender - Send automated notifications
- File sender - Deliver song files after payment

**Bot Flow:**
1. User clicks Telegram link from website with order number parameter
2. Bot receives `/start` command with order number
3. Bot links Telegram user ID to order in database
4. Bot sends welcome message with order confirmation
5. Bot listens for incoming messages and forwards to admin
6. Bot receives admin replies and forwards to user
7. Bot sends notification when song is ready
8. Bot delivers file after payment confirmation



## Data Models

### Order Model

```typescript
interface Order {
  id: string;                    // UUID
  orderNumber: string;           // Human-readable (e.g., "ORD-2024-0001")
  status: OrderStatus;
  
  // Constructor data
  recipientName: string;
  relationship: string;
  occasion: string;
  musicalStyle: string[];
  specialRequests: string;
  mood: string;
  tempo: string;
  
  // Contact information
  phoneNumber: string;
  telegramUserId?: string;
  telegramUsername?: string;
  
  // Pricing
  selectedTier?: PricingTier;
  
  // Files
  songFileUrl?: string;
  songFileName?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  readyAt?: Date;
  paidAt?: Date;
  completedAt?: Date;
}

enum OrderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  PAID = 'paid',
  COMPLETED = 'completed'
}

enum PricingTier {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}
```



### Message Model

```typescript
interface Message {
  id: string;                    // UUID
  orderId: string;               // Foreign key to Order
  sender: MessageSender;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

enum MessageSender {
  CLIENT = 'client',
  ADMIN = 'admin',
  SYSTEM = 'system'
}
```

### Payment Model

```typescript
interface Payment {
  id: string;                    // UUID
  orderId: string;               // Foreign key to Order
  amount: number;
  currency: string;
  tier: PricingTier;
  status: PaymentStatus;
  paymentIntentId: string;       // External payment provider ID
  createdAt: Date;
  paidAt?: Date;
}

enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
```

### Admin User Model

```typescript
interface AdminUser {
  id: string;                    // UUID
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```



### Database Schema

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  occasion VARCHAR(100),
  musical_style JSONB,
  special_requests TEXT,
  mood VARCHAR(50),
  tempo VARCHAR(50),
  phone_number VARCHAR(20) NOT NULL,
  telegram_user_id VARCHAR(50),
  telegram_username VARCHAR(100),
  selected_tier VARCHAR(20),
  song_file_url TEXT,
  song_file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ready_at TIMESTAMP,
  paid_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  payment_intent_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_telegram_user_id ON orders(telegram_user_id);
CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Order Number Uniqueness

*For any* set of order creation requests, all generated order numbers must be unique across the entire system.

**Validates: Requirements 2.3, 3.1**

### Property 2: Form Validation Consistency

*For any* input data submitted to the constructor or phone number field, the validation logic must correctly accept valid inputs and reject invalid inputs according to defined rules (e.g., required fields, phone number format).

**Validates: Requirements 2.2, 3.4**

### Property 3: Data Persistence Round-Trip

*For any* order created with complete data (constructor parameters, phone number, Telegram user ID, song file), querying the database must return all stored fields with values matching the original input.

**Validates: Requirements 2.4, 3.5, 4.3, 6.2, 10.1, 10.5**


### Property 4: Telegram Bot Account Linking

*For any* order number provided to the Telegram bot via the `/start` command, the bot must successfully associate the Telegram user ID with that order in the database.

**Validates: Requirements 4.2, 4.3**

### Property 5: Admin Panel Data Completeness

*For any* order in the database, the admin panel must display all required fields including order number, status, constructor parameters, contact information, and timestamps when viewing the order list or detail view.

**Validates: Requirements 5.1, 5.2, 11.3**

### Property 6: Order Filtering and Search

*For any* filter criteria (order number, status, date range) or search query applied in the admin panel, all returned results must match the specified criteria and no matching orders should be excluded.

**Validates: Requirements 5.4**

### Property 7: Status Transitions and Notifications

*For any* order, when its status changes to "ready", "paid", or "completed", the system must update the corresponding timestamp and trigger the appropriate notification (Telegram message for "ready", file delivery for "paid", completion marker for "completed").

**Validates: Requirements 6.3, 7.5, 8.4, 11.2, 11.5**


### Property 8: Unique Secure Listening Links

*For any* set of uploaded song files, all generated listening links must be unique, and each link must provide access only to its associated song file without exposing other files.

**Validates: Requirements 6.5**

### Property 9: Payment-Triggered File Delivery

*For any* order with status "paid", the Telegram bot must deliver the song file to the client's Telegram account.

**Validates: Requirements 8.1**

### Property 10: Tier-Specific Messaging

*For any* pricing tier selected by a client, the message sent by the Telegram bot after payment must include content specific to that tier (e.g., basic tier gets standard message, premium tier gets additional materials).

**Validates: Requirements 8.2, 8.3**

### Property 11: Bidirectional Message Persistence

*For any* message sent by either a client or administrator, the message must be stored in the database associated with the correct order, and must appear in both the admin panel conversation thread and the Telegram chat.

**Validates: Requirements 9.2, 9.3, 9.4, 9.5**


### Property 12: Referential Integrity

*For any* order deletion or update operation, the database must maintain referential integrity by cascading deletions to related messages and payments, or preventing deletion if constraints would be violated.

**Validates: Requirements 10.4**

### Property 13: Valid Status States

*For any* order status value stored in the database, it must be one of the defined valid states: "new", "in_progress", "ready", "paid", or "completed".

**Validates: Requirements 11.1**

### Property 14: Status Update Capability

*For any* order and any valid status transition requested by an administrator, the system must successfully update the order status and persist the change.

**Validates: Requirements 11.4**



## Error Handling

### Client-Side Error Handling

**Form Validation Errors:**
- Display inline error messages for invalid fields
- Prevent form submission until all validation passes
- Highlight invalid fields with visual indicators
- Provide helpful error messages in user's language

**Network Errors:**
- Show user-friendly error messages for failed API calls
- Implement retry logic for transient failures
- Provide fallback UI states for offline scenarios
- Display loading states during async operations

**Payment Errors:**
- Handle payment failures gracefully with clear messaging
- Provide options to retry payment
- Log payment errors for admin review
- Redirect to support contact if payment repeatedly fails

### Server-Side Error Handling

**Validation Errors:**
- Return 400 Bad Request with detailed error messages
- Validate all input data before processing
- Use schema validation (Zod/Joi) for type safety
- Log validation failures for monitoring

**Database Errors:**
- Wrap database operations in try-catch blocks
- Return 500 Internal Server Error for unexpected failures
- Log all database errors with context
- Implement transaction rollback for multi-step operations
- Handle unique constraint violations gracefully

**External Service Errors:**
- Implement timeout handling for Telegram API calls
- Retry failed Telegram messages with exponential backoff
- Handle payment gateway failures with appropriate status codes
- Log all external service errors for debugging



### Telegram Bot Error Handling

**Invalid Commands:**
- Respond with help message for unrecognized commands
- Guide users to correct command format

**Order Linking Errors:**
- Handle invalid order numbers gracefully
- Notify user if order number doesn't exist
- Prevent duplicate linking attempts

**Message Delivery Failures:**
- Retry failed message deliveries
- Log failures for admin review
- Notify admin if client's Telegram is unreachable

### File Upload Error Handling

**Invalid File Types:**
- Validate file format before upload
- Return clear error message for unsupported formats
- Suggest correct file formats

**File Size Limits:**
- Enforce maximum file size limits
- Display progress during large uploads
- Handle upload interruptions gracefully

**Storage Errors:**
- Retry failed uploads to cloud storage
- Provide fallback storage options
- Notify admin of storage failures



## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for universal correctness guarantees. This ensures both concrete functionality and general system behavior are validated.

### Property-Based Testing

**Framework:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: custom-song-platform, Property {N}: {property_text}`
- Tests run in CI/CD pipeline on every commit

**Property Test Coverage:**

1. **Property 1: Order Number Uniqueness**
   - Generate multiple order creation requests
   - Verify all order numbers are unique
   - Test with concurrent order creation

2. **Property 2: Form Validation Consistency**
   - Generate random valid and invalid form inputs
   - Verify validation accepts valid inputs and rejects invalid ones
   - Test edge cases (empty strings, special characters, boundary values)

3. **Property 3: Data Persistence Round-Trip**
   - Generate random order data
   - Store in database, then query back
   - Verify all fields match original values

4. **Property 4: Telegram Bot Account Linking**
   - Generate random order numbers and Telegram user IDs
   - Test linking operation
   - Verify association persists in database

5. **Property 5: Admin Panel Data Completeness**
   - Generate random orders with all fields
   - Query admin panel API
   - Verify all fields present in response

6. **Property 6: Order Filtering and Search**
   - Generate random orders with various attributes
   - Apply random filter criteria
   - Verify results match criteria and no valid orders excluded

7. **Property 7: Status Transitions and Notifications**
   - Generate orders in various states
   - Trigger status changes
   - Verify timestamps updated and notifications sent

8. **Property 8: Unique Secure Listening Links**
   - Generate multiple song files
   - Verify all links unique
   - Test link access controls

9. **Property 9: Payment-Triggered File Delivery**
   - Generate paid orders
   - Verify file delivery triggered
   - Test delivery to correct Telegram account

10. **Property 10: Tier-Specific Messaging**
    - Generate orders with different tiers
    - Verify message content matches tier

11. **Property 11: Bidirectional Message Persistence**
    - Generate random messages from clients and admins
    - Verify storage and display in both interfaces

12. **Property 12: Referential Integrity**
    - Test cascade deletions
    - Verify foreign key constraints enforced

13. **Property 13: Valid Status States**
    - Generate random status values
    - Verify only valid states accepted

14. **Property 14: Status Update Capability**
    - Generate random valid status transitions
    - Verify updates succeed and persist



### Unit Testing

**Framework:** Jest (for TypeScript/JavaScript)

**Unit Test Coverage:**

**API Endpoints:**
- Test each endpoint with valid requests
- Test error responses for invalid inputs
- Test authentication and authorization
- Test rate limiting

**Database Operations:**
- Test CRUD operations for each model
- Test transaction handling
- Test constraint violations
- Test query performance with large datasets

**Telegram Bot:**
- Test command parsing
- Test message formatting
- Test webhook handling
- Mock Telegram API for isolated testing

**Payment Integration:**
- Test payment intent creation
- Test webhook signature verification
- Test payment status updates
- Mock payment provider for testing

**File Upload:**
- Test file validation
- Test storage operations
- Test URL generation
- Test access control

**Frontend Components:**
- Test component rendering
- Test user interactions
- Test form submissions
- Test error states
- Use React Testing Library

### Integration Testing

**End-to-End Flows:**
- Complete order creation flow (web → database → Telegram)
- Payment and file delivery flow
- Admin message to client flow
- Order status lifecycle

**Tools:**
- Playwright or Cypress for E2E tests
- Test against staging environment
- Mock external services (payment, Telegram) in test environment

### Manual Testing Checklist

- Visual design review across different screen sizes
- Animation smoothness and timing
- Typography rendering across browsers
- Payment flow with real payment provider (test mode)
- Telegram bot interaction on mobile devices
- Admin panel usability
- File upload and download
- Cross-browser compatibility

### Performance Testing

- Load testing for concurrent order creation
- Database query optimization
- File upload/download speed
- API response times
- Frontend bundle size optimization

### Security Testing

- SQL injection prevention
- XSS prevention
- CSRF protection
- Authentication token security
- File upload security (malicious files)
- Payment data handling compliance
- Rate limiting effectiveness
