#!/bin/bash

# Database setup script for Custom Song Platform
# This script helps set up the PostgreSQL database

echo "🎵 Custom Song Platform - Database Setup"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and configure your database connection"
    exit 1
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Database setup complete!"
echo ""
echo "To verify your database connection, run:"
echo "  npx prisma studio"
