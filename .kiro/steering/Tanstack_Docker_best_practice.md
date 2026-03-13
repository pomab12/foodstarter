# TanStack Start Docker & PostgreSQL Best Practices

## Docker Compose Setup with PostgreSQL

Complete development environment with app and database:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: tanstack-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tanstack_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: tanstack-app
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/tanstack_dev
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    command: pnpm dev

volumes:
  postgres_data:
```

## Multi-Stage Production Dockerfile

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy content files for content-collections
COPY content ./content
COPY content-collections.ts ./
COPY public ./public

RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 tanstack

COPY --from=builder --chown=tanstack:nodejs /app/.output ./

USER tanstack

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server/index.mjs"]
```

## Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
```

## Database Integration with Drizzle ORM

### Drizzle Setup

Install Drizzle ORM and PostgreSQL driver:

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/pg
```

### Database Connection

Create `src/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5432/tanstack_dev'

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

// Connection health check
export async function checkDbConnection() {
  try {
    await client`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Export for raw queries if needed
export { client as sql }
```

### Drizzle Schema

Create `src/db/schema.ts` with Drizzle table definitions:

```typescript
import { pgTable, serial, varchar, text, timestamp, index } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}))

// Resume views table
export const resumeViews = pgTable('resume_views', {
  id: serial('id').primaryKey(),
  visitorId: varchar('visitor_id', { length: 255 }),
  pagePath: varchar('page_path', { length: 255 }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
})

// Contact submissions table
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
})

// Infer types from schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type ResumeView = typeof resumeViews.$inferSelect
export type NewResumeView = typeof resumeViews.$inferInsert

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1),
}).omit({ id: true, createdAt: true, updatedAt: true })

export const selectUserSchema = createSelectSchema(users)

export const insertContactSchema = createInsertSchema(contactSubmissions, {
  email: z.string().email(),
  name: z.string().min(1),
  message: z.string().min(10),
}).omit({ id: true, submittedAt: true })

export const selectContactSchema = createSelectSchema(contactSubmissions)

export type InsertUser = z.infer<typeof insertUserSchema>
export type InsertContact = z.infer<typeof insertContactSchema>
```

### Drizzle Config

Create `drizzle.config.ts` in project root:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 
      'postgresql://postgres:postgres@localhost:5432/tanstack_dev',
  },
})
```

### Package.json Scripts

Add Drizzle commands to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Server Functions with Drizzle

Create `src/lib/server-functions.ts`:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db'
import { users, contactSubmissions, resumeViews } from '#/db/schema'
import { insertUserSchema, insertContactSchema, type User } from '#/db/schema'
import { eq, desc } from 'drizzle-orm'

// Example: Fetch all users
export const getUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
  
  return allUsers
})

// Example: Create user with validation
export const createUser = createServerFn({
  method: 'POST',
})
  .validator(insertUserSchema)
  .handler(async ({ data }) => {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning()
    
    return user
  })

// Example: Get user by ID
export const getUserById = createServerFn({
  method: 'GET',
}).handler(async ({ params }: { params: { id: string } }) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(params.id)))
  
  if (!user) throw new Error('User not found')
  return user
})

// Example: Update user
export const updateUser = createServerFn({
  method: 'PUT',
})
  .validator(insertUserSchema.partial().extend({ id: z.number() }))
  .handler(async ({ data }) => {
    const { id, ...updates } = data
    
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    
    return user
  })

// Example: Delete user
export const deleteUser = createServerFn({
  method: 'DELETE',
}).handler(async ({ params }: { params: { id: string } }) => {
  await db
    .delete(users)
    .where(eq(users.id, parseInt(params.id)))
  
  return { success: true }
})

// Example: Submit contact form
export const submitContact = createServerFn({
  method: 'POST',
})
  .validator(insertContactSchema)
  .handler(async ({ data }) => {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(data)
      .returning()
    
    return submission
  })

// Example: Track resume view
export const trackResumeView = createServerFn({
  method: 'POST',
}).handler(async ({ data }: { data: { visitorId?: string; pagePath: string } }) => {
  const [view] = await db
    .insert(resumeViews)
    .values({
      visitorId: data.visitorId,
      pagePath: data.pagePath,
    })
    .returning()
  
  return view
})

// Example: Get resume analytics
export const getResumeAnalytics = createServerFn({
  method: 'GET',
}).handler(async () => {
  const views = await db
    .select()
    .from(resumeViews)
    .orderBy(desc(resumeViews.viewedAt))
    .limit(100)
  
  return {
    totalViews: views.length,
    recentViews: views,
  }
})
```

### Using Server Functions in Routes

```typescript
// src/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getUsers } from '#/lib/server-functions'

export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await getUsers()
    return { users }
  },
  component: UsersPage,
})

function UsersPage() {
  const { users } = Route.useLoaderData()
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}
```

## API Routes with Drizzle

Create API endpoints:

```typescript
// src/routes/api/users.ts
import { createFileRoute, json } from '@tanstack/react-router'
import { db } from '#/db'
import { users } from '#/db/schema'
import { insertUserSchema } from '#/db/schema'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async () => {
        const allUsers = await db.select().from(users)
        return json({ users: allUsers })
      },
      POST: async ({ request }) => {
        const body = await request.json()
        const validated = insertUserSchema.parse(body)
        
        const [user] = await db
          .insert(users)
          .values(validated)
          .returning()
        
        return json({ user }, { status: 201 })
      },
    },
  },
})

// src/routes/api/users/$id.ts
export const Route = createFileRoute('/api/users/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(params.id)))
        
        if (!user) {
          return json({ error: 'User not found' }, { status: 404 })
        }
        
        return json({ user })
      },
      PUT: async ({ request, params }) => {
        const body = await request.json()
        const validated = insertUserSchema.partial().parse(body)
        
        const [user] = await db
          .update(users)
          .set({ ...validated, updatedAt: new Date() })
          .where(eq(users.id, parseInt(params.id)))
          .returning()
        
        return json({ user })
      },
      DELETE: async ({ params }) => {
        await db
          .delete(users)
          .where(eq(users.id, parseInt(params.id)))
        
        return json({ success: true })
      },
    },
  },
})
```

## Database Migrations with Drizzle

### Generate Migration

After updating schema, generate migration:

```bash
pnpm db:generate
```

This creates SQL migration files in `drizzle/` directory.

### Apply Migrations

```bash
pnpm db:migrate
```

### Push Schema (Development)

For quick prototyping, push schema directly without migrations:

```bash
pnpm db:push
```

### Drizzle Studio

Visual database browser:

```bash
pnpm db:studio
```

Opens at `https://local.drizzle.studio`

### Initial Schema SQL

For Docker initialization, create `init.sql`:

```sql
-- init.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS resume_views (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255),
  page_path VARCHAR(255),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Migration in Docker

Add migration step to Dockerfile:

```dockerfile
# In builder stage
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

# Run migrations on container start
CMD ["sh", "-c", "pnpm db:migrate && node server/index.mjs"]
```

Or use a separate migration container:

```yaml
# docker-compose.yml
services:
  migrate:
    build:
      context: .
      dockerfile: Dockerfile.dev
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/tanstack_dev
    depends_on:
      postgres:
        condition: service_healthy
    command: pnpm db:migrate
```

## Environment Variables

### Local Development (.env.local)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tanstack_dev
NODE_ENV=development
```

### Production (.env.production)

```bash
DATABASE_URL=postgresql://user:password@prod-host:5432/tanstack_prod
NODE_ENV=production
```

### Docker Environment Variables

Pass to container via docker-compose:

```yaml
services:
  app:
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/tanstack_dev
```

Or use env file:

```yaml
services:
  app:
    env_file:
      - .env.local
```

## Health Check Endpoint

Create `src/routes/api/health.ts`:

```typescript
import { createFileRoute, json } from '@tanstack/react-router'
import { checkDbConnection } from '#/db'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        const dbHealthy = await checkDbConnection()
        return json({
          status: dbHealthy ? 'healthy' : 'unhealthy',
          database: dbHealthy,
          timestamp: new Date().toISOString(),
        }, {
          status: dbHealthy ? 200 : 503,
        })
      },
    },
  },
})
```

## .dockerignore

```
node_modules
.git
.vscode
.kiro
dist
.output
*.log
.env.local
.env.production
.DS_Store
coverage
.tanstack
.netlify
```

## Common Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild after dependency changes
docker-compose up --build

# Run migrations
docker-compose exec postgres psql -U postgres -d tanstack_dev -f /docker-entrypoint-initdb.d/init.sql

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d tanstack_dev

# Production build
docker build -t tanstack-app:latest .

# Run production container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  tanstack-app:latest
```

## Connection Pooling Best Practices

- Use connection pooling (postgres library handles this automatically)
- Set appropriate `max` connections (10-20 for most apps)
- Configure `idle_timeout` to release unused connections
- Use `connect_timeout` to fail fast on connection issues
- Close connections gracefully on shutdown

## Security Best Practices

1. **Never commit credentials**: Use environment variables
2. **Use non-root user**: Run container as non-privileged user
3. **SSL/TLS**: Enable SSL for production database connections
4. **Secrets management**: Use Docker secrets or vault for production
5. **Network isolation**: Use Docker networks to isolate services
6. **Read-only filesystem**: Mount volumes as read-only where possible
7. **Scan images**: Use `docker scan` to check for vulnerabilities

## Production Considerations

1. **Connection Limits**: PostgreSQL has max connections limit, configure pooling appropriately
2. **Backup Strategy**: Regular automated backups of PostgreSQL data
3. **Monitoring**: Track connection pool usage, query performance, and errors
4. **Migrations**: Use a migration tool (e.g., node-pg-migrate, Prisma) for schema changes
5. **Logging**: Centralized logging for both app and database
6. **Resource Limits**: Set memory and CPU limits in docker-compose

## Common Pitfalls

1. **Don't copy node_modules**: Let pnpm install handle dependencies
2. **Don't run as root**: Create non-root user for security
3. **Don't use npm**: This project uses pnpm, respect the lock file
4. **Don't skip .dockerignore**: Speeds up builds and reduces context size
5. **Don't forget generated files**: `routeTree.gen.ts` and `.content-collections/` are needed
6. **Don't hardcode DATABASE_URL**: Always use environment variables
7. **Don't skip health checks**: Essential for orchestration and monitoring

## Database Folder Structure

```
src/
├── db/
│   ├── index.ts       # Drizzle instance and connection utilities
│   └── schema.ts      # Drizzle table definitions and Zod schemas
├── lib/
│   └── server-functions.ts  # Server functions using Drizzle
└── routes/
    └── api/           # API routes using Drizzle
drizzle/               # Generated migration files (auto-generated)
drizzle.config.ts      # Drizzle Kit configuration
```

All database-related code imports from `#/db` or `#/db/schema` for consistency.

## Drizzle Query Examples

### Basic Queries

```typescript
import { db } from '#/db'
import { users } from '#/db/schema'
import { eq, and, or, like, gt, desc } from 'drizzle-orm'

// Select all
const allUsers = await db.select().from(users)

// Select with where
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))

// Select with multiple conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(
    and(
      eq(users.status, 'active'),
      gt(users.createdAt, new Date('2024-01-01'))
    )
  )

// Select with ordering and limit
const recentUsers = await db
  .select()
  .from(users)
  .orderBy(desc(users.createdAt))
  .limit(10)

// Search
const searchResults = await db
  .select()
  .from(users)
  .where(like(users.name, '%john%'))
```

### Insert

```typescript
// Insert single
const [newUser] = await db
  .insert(users)
  .values({ name: 'John', email: 'john@example.com' })
  .returning()

// Insert multiple
const newUsers = await db
  .insert(users)
  .values([
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' },
  ])
  .returning()
```

### Update

```typescript
const [updated] = await db
  .update(users)
  .set({ name: 'John Doe', updatedAt: new Date() })
  .where(eq(users.id, 1))
  .returning()
```

### Delete

```typescript
await db
  .delete(users)
  .where(eq(users.id, 1))
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx
    .insert(users)
    .values({ name: 'John', email: 'john@example.com' })
    .returning()
  
  await tx
    .insert(resumeViews)
    .values({ visitorId: user.id.toString(), pagePath: '/' })
})
```
