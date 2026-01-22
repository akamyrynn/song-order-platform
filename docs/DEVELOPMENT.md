# Development Guide

## Getting Started

### Initial Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

3. **Set up the database:**

```bash
./scripts/setup-db.sh
```

Or manually:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
custom-song-platform/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── lib/                 # Utility functions
│   │   └── prisma.ts        # Prisma client singleton
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types and enums
│   └── __tests__/           # Test files
│       └── helpers/         # Test utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── scripts/                 # Utility scripts
├── docs/                    # Documentation
└── .kiro/specs/            # Feature specifications
```

## Development Workflow

### 1. Feature Development

Follow the task list in `.kiro/specs/custom-song-platform/tasks.md`:

1. Read the requirements and design documents
2. Implement the feature according to the task description
3. Write unit tests for specific scenarios
4. Write property-based tests for universal properties
5. Verify all tests pass

### 2. Testing

**Run all tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm run test:watch
```

**Run specific test file:**

```bash
npm test -- path/to/test.test.ts
```

### 3. Database Changes

**Create a new migration:**

```bash
npx prisma migrate dev --name descriptive_name
```

**View database:**

```bash
npx prisma studio
```

**Reset database (development only):**

```bash
npx prisma migrate reset
```

## Testing Strategy

### Unit Tests

- Test specific examples and edge cases
- Use Jest and React Testing Library
- Focus on individual functions and components
- Mock external dependencies when appropriate

### Property-Based Tests

- Test universal properties across many inputs
- Use fast-check library
- Run with minimum 100 iterations
- Tag tests with: `Feature: custom-song-platform, Property {N}: {property_text}`

Example:

```typescript
import * as fc from 'fast-check'
import { PBT_CONFIG } from '@/__tests__/helpers/pbt-config'

// Feature: custom-song-platform, Property 1: Order Number Uniqueness
test('order numbers should be unique', () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (orderNumbers) => {
      // Test logic here
    }),
    { numRuns: PBT_CONFIG.numRuns }
  )
})
```

## Code Style

### TypeScript

- Use strict mode
- Define explicit types for function parameters and return values
- Use enums for fixed sets of values
- Prefer interfaces over types for object shapes

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for prop types

### API Routes

- Validate all input data using Zod
- Return consistent error responses
- Use proper HTTP status codes
- Handle errors gracefully

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `PAYMENT_PROVIDER_SECRET_KEY` - Payment provider API key
- `JWT_SECRET` - Secret for JWT token signing
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - S3 bucket name

See `.env.example` for the complete list.

## Common Tasks

### Add a new API endpoint

1. Create file in `src/app/api/[route]/route.ts`
2. Implement GET, POST, etc. handlers
3. Add input validation with Zod
4. Add error handling
5. Write tests

### Add a new database model

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name model_name`
3. Update TypeScript types in `src/types/index.ts`
4. Generate Prisma client: `npx prisma generate`

### Add a new page

1. Create file in `src/app/[route]/page.tsx`
2. Implement the component
3. Add styles (CSS Modules or inline)
4. Write tests

## Debugging

### Database Issues

Check Prisma logs:

```bash
DEBUG="prisma:*" npm run dev
```

### API Issues

Check Next.js logs in the terminal where `npm run dev` is running.

### Test Issues

Run tests with verbose output:

```bash
npm test -- --verbose
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [fast-check Documentation](https://fast-check.dev/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
