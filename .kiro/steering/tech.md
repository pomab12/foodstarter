# Tech Stack

## Core Framework

- **TanStack Start**: Full-stack React framework with SSR
- **TanStack Router**: File-based routing with type-safe navigation
- **React 19**: Latest React with modern features
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Vite**: Build tool and dev server

## Styling & UI

- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Radix UI-based component library
- **Lucide React**: Icon library
- **tailwindcss-animate**: Animation utilities

## Content Management

- **@content-collections**: Type-safe markdown content with frontmatter
- **Zod**: Schema validation for content collections

## Database

- **Drizzle ORM**: Type-safe SQL query builder
- **postgres**: PostgreSQL client for Node.js
- **Drizzle Kit**: Schema management and migrations

## Development Tools
## Common Commands

```bash
# Development
pnpm dev              # Start dev server on port 3000

# Building
pnpm build            # Production build
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm check            # Run both lint and format

# Testing
pnpm test             # Run Vitest tests

# Database (Drizzle)
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Open Drizzle Studio (visual DB browser)
```m lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm check            # Run both lint and format

# Testing
pnpm test             # Run Vitest tests
```

## Deployment

Configured for Netlify deployment with `@netlify/vite-plugin-tanstack-start`.

## Path Aliases

- `#/*` maps to `./src/*` (package.json imports)
- `@/*` maps to `./src/*` (tsconfig paths)

Both aliases are equivalent and can be used interchangeably.

