import { db } from "./index"
import { foods } from "./schema"

const seedFoods = [
	{
		name: "Classic Burger",
		category: "Burgers",
		description:
			"Juicy beef patty with lettuce, tomato, onion, pickles, and our special sauce",
		price: "$12.99",
		calories: "650",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/classic-burger.jpg",
	},
	{
		name: "Veggie Burger",
		category: "Burgers",
		description:
			"Plant-based patty with avocado, sprouts, tomato, and vegan mayo",
		price: "$11.99",
		calories: "480",
		isVegetarian: "true",
		isVegan: "true",
		imageUrl: "/images/veggie-burger.jpg",
	},
	{
		name: "Margherita Pizza",
		category: "Pizza",
		description:
			"Fresh mozzarella, tomato sauce, basil, and extra virgin olive oil",
		price: "$14.99",
		calories: "800",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/margherita-pizza.jpg",
	},
	{
		name: "Pepperoni Pizza",
		category: "Pizza",
		description: "Classic pepperoni with mozzarella cheese and tomato sauce",
		price: "$16.99",
		calories: "950",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/pepperoni-pizza.jpg",
	},
	{
		name: "Caesar Salad",
		category: "Salads",
		description:
			"Romaine lettuce, parmesan cheese, croutons, and Caesar dressing",
		price: "$9.99",
		calories: "320",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/caesar-salad.jpg",
	},
	{
		name: "Greek Salad",
		category: "Salads",
		description:
			"Mixed greens, feta cheese, olives, cucumber, tomatoes, and Greek dressing",
		price: "$10.99",
		calories: "280",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/greek-salad.jpg",
	},
	{
		name: "Grilled Chicken Sandwich",
		category: "Sandwiches",
		description:
			"Grilled chicken breast with lettuce, tomato, and honey mustard",
		price: "$11.99",
		calories: "520",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/chicken-sandwich.jpg",
	},
	{
		name: "BLT Sandwich",
		category: "Sandwiches",
		description: "Bacon, lettuce, tomato, and mayo on toasted bread",
		price: "$10.99",
		calories: "480",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/blt-sandwich.jpg",
	},
	{
		name: "Spaghetti Carbonara",
		category: "Pasta",
		description: "Creamy pasta with bacon, eggs, parmesan, and black pepper",
		price: "$15.99",
		calories: "720",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/carbonara.jpg",
	},
	{
		name: "Penne Arrabbiata",
		category: "Pasta",
		description: "Spicy tomato sauce with garlic and red chili peppers",
		price: "$13.99",
		calories: "580",
		isVegetarian: "true",
		isVegan: "true",
		imageUrl: "/images/arrabbiata.jpg",
	},
	{
		name: "Fish Tacos",
		category: "Tacos",
		description:
			"Grilled fish with cabbage slaw, pico de gallo, and chipotle mayo",
		price: "$13.99",
		calories: "450",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/fish-tacos.jpg",
	},
	{
		name: "Chicken Tacos",
		category: "Tacos",
		description:
			"Seasoned chicken with lettuce, cheese, salsa, and sour cream",
		price: "$12.99",
		calories: "520",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/chicken-tacos.jpg",
	},
	{
		name: "Chocolate Lava Cake",
		category: "Desserts",
		description: "Warm chocolate cake with molten center, served with ice cream",
		price: "$7.99",
		calories: "580",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/lava-cake.jpg",
	},
	{
		name: "Tiramisu",
		category: "Desserts",
		description:
			"Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
		price: "$8.99",
		calories: "450",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/tiramisu.jpg",
	},
	{
		name: "Fresh Fruit Bowl",
		category: "Desserts",
		description: "Seasonal fresh fruits with honey drizzle",
		price: "$6.99",
		calories: "180",
		isVegetarian: "true",
		isVegan: "true",
		imageUrl: "/images/fruit-bowl.jpg",
	},
	{
		name: "Iced Coffee",
		category: "Beverages",
		description: "Cold brew coffee served over ice",
		price: "$4.99",
		calories: "80",
		isVegetarian: "true",
		isVegan: "true",
		imageUrl: "/images/iced-coffee.jpg",
	},
	{
		name: "Fresh Lemonade",
		category: "Beverages",
		description: "Freshly squeezed lemon juice with a hint of mint",
		price: "$3.99",
		calories: "120",
		isVegetarian: "true",
		isVegan: "true",
		imageUrl: "/images/lemonade.jpg",
	},
	{
		name: "Mango Smoothie",
		category: "Beverages",
		description: "Blended mango with yogurt and honey",
		price: "$5.99",
		calories: "220",
		isVegetarian: "true",
		isVegan: "false",
		imageUrl: "/images/mango-smoothie.jpg",
	},
	{
		name: "Steak Frites",
		category: "Mains",
		description: "Grilled ribeye steak with french fries and herb butter",
		price: "$24.99",
		calories: "980",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/steak-frites.jpg",
	},
	{
		name: "Grilled Salmon",
		category: "Mains",
		description: "Atlantic salmon with roasted vegetables and lemon butter",
		price: "$22.99",
		calories: "620",
		isVegetarian: "false",
		isVegan: "false",
		imageUrl: "/images/grilled-salmon.jpg",
	},
]

async function seed() {
	console.log("🌱 Seeding database...")

	try {
		// Clear existing data
		await db.delete(foods)
		console.log("✅ Cleared existing food data")

		// Insert seed data
		await db.insert(foods).values(seedFoods)
		console.log(`✅ Inserted ${seedFoods.length} food items`)

		console.log("🎉 Seeding completed successfully!")
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	}

	process.exit(0)
}

seed()
