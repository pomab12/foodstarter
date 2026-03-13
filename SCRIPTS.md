# Package Scripts Reference

Complete guide to all available npm/pnpm scripts in this project.

## Development

```bash
# Start development server on port 3000
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Start production server (after build)
pnpm start
```

## Testing

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

## Code Quality (Biome)

```bash
# Format code (auto-fix)
pnpm format

# Check formatting without fixing
pnpm format:check

# Lint code (auto-fix)
pnpm lint

# Check linting without fixing
pnpm lint:check

# Run both format and lint (auto-fix)
pnpm check

# Check both without fixing (for CI)
pnpm check:ci

# TypeScript type checking
pnpm typecheck
```

## Database (Drizzle)

```bash
# Generate migrations from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly to database (dev only, skips migrations)
pnpm db:push

# Pull schema from database to code
pnpm db:pull

# Open Drizzle Studio (visual database browser)
pnpm db:studio

# Drop migration
pnpm db:drop

# Check migration consistency
pnpm db:check

# Seed database with sample data
pnpm db:seed
```

## Docker - Database Only

```bash
# Start PostgreSQL container
pnpm docker:db:up

# Stop PostgreSQL container
pnpm docker:db:down

# View PostgreSQL logs
pnpm docker:db:logs

# Reset database (removes all data and restarts)
pnpm docker:db:reset
```

## Docker - Full Stack

```bash
# Start all services (app + database)
pnpm docker:up

# Stop all services
pnpm docker:down

# Rebuild and start services
pnpm docker:build

# View logs from all services
pnpm docker:logs
```

## Common Workflows

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
pnpm docker:db:up

# Push schema to database
pnpm db:push

# Seed database with sample food data
pnpm db:seed

# Start development server
pnpm dev
```

### Database Schema Changes

```bash
# 1. Update src/db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. Apply migration
pnpm db:migrate

# Or for quick dev iteration (skips migrations)
pnpm db:push
```

### Before Committing

```bash
# Format, lint, and type check
pnpm check
pnpm typecheck

# Run tests
pnpm test
```

### Production Build

```bash
# Build application
pnpm build

# Preview locally
pnpm preview

# Or start production server
pnpm start
```

### Database Management

```bash
# Open visual database browser
pnpm db:studio

# View database logs
pnpm docker:db:logs

# Reset database (careful: deletes all data!)
pnpm docker:db:reset
```

## CI/CD Scripts

For continuous integration, use these non-interactive scripts:

```bash
pnpm check:ci      # Check code quality without auto-fix
pnpm typecheck     # Verify TypeScript types
pnpm test          # Run tests once
pnpm build         # Build for production
```

## Tips

- Use `pnpm` instead of `npm` (this project uses pnpm)
- Run `pnpm db:studio` to visually browse and edit database
- Use `pnpm db:push` for quick schema updates during development
- Use `pnpm db:generate` + `pnpm db:migrate` for production migrations
- Run `pnpm check` before committing to catch issues early
- Use `pnpm docker:db:reset` to start fresh with database
