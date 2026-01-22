# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Custom Song Platform.

## Prerequisites

- PostgreSQL 14 or higher installed and running
- Database user with CREATE DATABASE privileges

## Quick Setup

### Option 1: Using the setup script (Recommended)

```bash
./scripts/setup-db.sh
```

### Option 2: Manual setup

1. **Create the database:**

```bash
createdb custom_song_platform
```

Or using psql:

```sql
CREATE DATABASE custom_song_platform;
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and update the `DATABASE_URL`:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/custom_song_platform?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

3. **Generate Prisma Client:**

```bash
npx prisma generate
```

4. **Run migrations:**

```bash
npx prisma migrate dev --name init
```

## Database Schema

The database includes the following tables:

### orders
Stores customer orders with song parameters, contact information, and status tracking.

### messages
Stores bidirectional messages between clients and administrators.

### payments
Tracks payment transactions and their status.

### admin_users
Stores administrator accounts for the admin panel.

## Useful Commands

### View database in Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 to browse and edit your data.

### Reset database (WARNING: Deletes all data)

```bash
npx prisma migrate reset
```

### Create a new migration

```bash
npx prisma migrate dev --name migration_name
```

### Apply migrations in production

```bash
npx prisma migrate deploy
```

## Troubleshooting

### Connection refused

Make sure PostgreSQL is running:

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Authentication failed

Check your database credentials in `.env` and ensure the user has proper permissions.

### Migration conflicts

If you encounter migration conflicts, you may need to reset the database:

```bash
npx prisma migrate reset
npx prisma migrate dev
```

## Production Considerations

1. Use a managed PostgreSQL service (AWS RDS, Supabase, Railway, etc.)
2. Enable SSL connections
3. Set up regular backups
4. Use connection pooling (PgBouncer)
5. Monitor query performance
6. Set up proper indexes (already included in schema)

## Schema Validation

The database schema enforces:

- Referential integrity with CASCADE deletes
- Unique constraints on order numbers and payment intent IDs
- Indexes on frequently queried fields (status, created_at, telegram_user_id)
- Proper data types for all fields
