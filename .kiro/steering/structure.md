# Project Structure

## Directory Organization

```
├── content/                    # Markdown content files
│   ├── jobs/                  # Work experience entries
│   └── education/             # Education entries
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components (Badge, Card, etc.)
│   │   ├── Header.tsx        # Site header with navigation
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ThemeToggle.tsx   # Dark/light mode switcher
│   │   └── ResumeAssistant*.tsx  # AI assistant components
│   ├── db/                    # Database layer (Drizzle ORM)
│   │   ├── index.ts          # Drizzle instance and connection
│   │   └── schema.ts         # Table definitions and Zod schemas
│   ├── lib/                   # Utility functions and hooks
│   │   ├── utils.ts          # General utilities (cn helper, etc.)
│   │   ├── resume-tools.ts   # AI tools for resume assistant
│   │   ├── resume-ai-hook.ts # AI integration hook
│   │   └── server-functions.ts # Server functions with database
│   ├── routes/                # File-based routes
│   │   ├── __root.tsx        # Root layout with Header/Footer
│   │   └── api/              # API routes
│   ├── router.tsx             # Router configuration
│   ├── routeTree.gen.ts      # Auto-generated route tree (don't edit)
│   └── styles.css             # Global styles and Tailwind imports
├── public/                    # Static assets
├── drizzle/                   # Generated migration files (don't edit)
├── .content-collections/      # Generated content types (don't edit)
└── drizzle.config.ts          # Drizzle Kit configuration
```

## Routing Conventions

- File-based routing via TanStack Router
- Routes live in `src/routes/`
- `__root.tsx` defines the shell layout
- `routeTree.gen.ts` is auto-generated, never edit manually
- Use `Link` component from `@tanstack/react-router` for navigation

## Content Collections

- Content files use markdown with YAML frontmatter
- Schemas defined in `content-collections.ts`
- Generated types available from `.content-collections/generated`
- Jobs require: jobTitle, company, location, startDate, tags
- Education requires: school, summary, startDate, tags
- endDate is optional (omit for current positions)

## Component Patterns

- UI components in `src/components/ui/` follow shadcn/ui conventions
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Components use TypeScript with explicit prop types
- Prefer composition over prop drilling

## Code Style

- Biome enforces double quotes for strings
- Tab indentation (configured in biome.json)
- Organize imports automatically via Biome
- Strict TypeScript with no unused variables/parameters

## Database Conventions

- Use Drizzle ORM for type-safe database operations
- Import from `#/db` for database instance
- Import from `#/db/schema` for table definitions and types
- Use Zod schemas from schema.ts for validation
- Prefer Drizzle queries over raw SQL for type safety
- Use transactions for multi-step operations
