# Database Setup Guide

## Option 1: Local PostgreSQL Installation

### Windows

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. PostgreSQL will run on port 5432 by default

### Create Database

```bash
# Open Command Prompt or PowerShell
psql -U postgres

# Enter your password when prompted
# Then create the database:
CREATE DATABASE total_supply_db;

# Exit
\q
```

### Update .env.local

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/total_supply_db"
```

## Option 2: Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name postgres-total-supply \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=total_supply_db \
  -p 5432:5432 \
  -d postgres:16

# Update .env.local
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/total_supply_db"
```

## Option 3: Supabase (Cloud)

1. Go to https://supabase.com
2. Create a new project
3. Get your connection string from Settings > Database
4. Update .env.local with the connection string

## After Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio

# Restart dev server
npm run dev
```

## Verify Connection

Visit: http://localhost:3000/api/test-db

You should see:

```json
{
  "success": true,
  "data": {
    "userCount": 0,
    "database": "PostgreSQL version...",
    "timestamp": "..."
  }
}
```
