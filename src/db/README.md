# Database Layer

This directory contains the Drizzle ORM setup and database utilities.

## Files

- **index.ts** - Drizzle instance, database connection, and health check
- **schema.ts** - Table definitions with Drizzle and Zod validation schemas
- **seed.ts** - Seed script to populate database with sample data

## Schema Tables

### users
User accounts table with email, name, and timestamps.

### resume_views
Analytics tracking for resume page views.

### contact_submissions
Contact form submissions from visitors.

### foods
Food menu items with categories, pricing, and dietary information.

## Usage

### Connect to Database

```typescript
import { db } from '#/db'
import { foods } from '#/db/schema'

// Query foods
const allFoods = await db.select().from(foods)
```

### Seed Database

```bash
# Seed with sample food data
pnpm db:seed
```

This will:
1. Clear existing food data
2. Insert 20 sample food items across categories:
   - Burgers
   - Pizza
   - Salads
   - Sandwiches
   - Pasta
   - Tacos
   - Desserts
   - Beverages
   - Mains

### Health Check

```typescript
import { checkDbConnection } from '#/db'

const isHealthy = await checkDbConnection()
```

## Food Table Schema

```typescript
{
  id: number
  name: string
  category: string
  description?: string
  price?: string
  calories?: string
  isVegetarian: string  // "true" or "false"
  isVegan: string       // "true" or "false"
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
```

## Sample Food Categories

- **Burgers** - Classic Burger, Veggie Burger
- **Pizza** - Margherita, Pepperoni
- **Salads** - Caesar, Greek
- **Sandwiches** - Grilled Chicken, BLT
- **Pasta** - Carbonara, Arrabbiata
- **Tacos** - Fish, Chicken
- **Desserts** - Lava Cake, Tiramisu, Fruit Bowl
- **Beverages** - Iced Coffee, Lemonade, Smoothie
- **Mains** - Steak Frites, Grilled Salmon

## Validation

All insert operations use Zod schemas for validation:

```typescript
import { insertFoodSchema } from '#/db/schema'

const validated = insertFoodSchema.parse({
  name: "New Dish",
  category: "Mains",
  description: "Delicious new dish",
  price: "$19.99"
})
```
