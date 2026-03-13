# Docker PostgreSQL Setup for Drizzle

Simple PostgreSQL setup for local development with Drizzle ORM.

## Quick Start

### Start PostgreSQL

```bash
docker-compose -f docker-compose.db.yml up -d
```

### Stop PostgreSQL

```bash
docker-compose -f docker-compose.db.yml down
```

### Stop and Remove Data

```bash
docker-compose -f docker-compose.db.yml down -v
```

## Database Connection

The PostgreSQL instance will be available at:

```
postgresql://postgres:postgres@localhost:5432/tanstack_dev
```

This matches the `DATABASE_URL` in your `.env.example` file.

## Drizzle Commands

Once PostgreSQL is running, use these commands:

```bash
# Generate migrations from schema
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly (dev only, skips migrations)
pnpm db:push

# Open Drizzle Studio (visual database browser)
pnpm db:studio
```

## Initial Setup

1. Start PostgreSQL:
   ```bash
   docker-compose -f docker-compose.db.yml up -d
   ```

2. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

3. Push schema to database:
   ```bash
   pnpm db:push
   ```

4. (Optional) Open Drizzle Studio:
   ```bash
   pnpm db:studio
   ```

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.db.yml logs -f

# Access PostgreSQL shell
docker exec -it drizzle-postgres psql -U postgres -d tanstack_dev

# Check if PostgreSQL is ready
docker exec drizzle-postgres pg_isready -U postgres

# Restart PostgreSQL
docker-compose -f docker-compose.db.yml restart
```

## Database Credentials

- **Host**: localhost
- **Port**: 5432
- **Database**: tanstack_dev
- **Username**: postgres
- **Password**: postgres

## Notes

- Data persists in a Docker volume named `postgres_data`
- Initial schema from `init.sql` runs automatically on first start
- Health check ensures database is ready before connections
- Use `pnpm db:push` for quick schema updates during development
- Use `pnpm db:generate` + `pnpm db:migrate` for production-ready migrations
