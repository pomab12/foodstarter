import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://postgres:postgres@localhost:5432/tanstack"

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
		console.error("Database connection failed:", error)
		return false
	}
}

// Export for raw queries if needed
export { client as sql }
