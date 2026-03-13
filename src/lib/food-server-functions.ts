import { createServerFn } from "@tanstack/react-start"
import { db } from "#/db"
import { foods, insertFoodSchema, type Food } from "#/db/schema"
import { eq, desc } from "drizzle-orm"

// Create food entry server function
export const createFood = createServerFn({
	method: "POST",
})
	.validator(insertFoodSchema)
	.handler(async ({ data }) => {
		try {
			const [food] = await db
				.insert(foods)
				.values({
					...data,
					// Ensure boolean fields are properly handled as strings
					isVegetarian: data.isVegetarian || "false",
					isVegan: data.isVegan || "false",
				})
				.returning()

			return {
				success: true,
				food,
			}
		} catch (error) {
			console.error("Error creating food:", error)
			return {
				success: false,
				error: "Failed to create food entry",
			}
		}
	})

// Get all foods server function with chronological ordering
export const getFoods = createServerFn({
	method: "GET",
}).handler(async () => {
	try {
		const allFoods = await db
			.select()
			.from(foods)
			.orderBy(desc(foods.createdAt))

		return {
			success: true,
			foods: allFoods,
		}
	} catch (error) {
		console.error("Error fetching foods:", error)
		return {
			success: false,
			foods: [],
			error: "Failed to fetch food entries",
		}
	}
})

// Delete food server function with existence validation
export const deleteFood = createServerFn({
	method: "DELETE",
}).handler(async ({ data }: { data: { id: number } }) => {
	try {
		// First check if the food exists
		const [existingFood] = await db
			.select()
			.from(foods)
			.where(eq(foods.id, data.id))

		if (!existingFood) {
			return {
				success: false,
				error: "Food entry not found",
			}
		}

		// Delete the food entry
		await db.delete(foods).where(eq(foods.id, data.id))

		return {
			success: true,
		}
	} catch (error) {
		console.error("Error deleting food:", error)
		return {
			success: false,
			error: "Failed to delete food entry",
		}
	}
})