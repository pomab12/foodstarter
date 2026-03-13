import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	index,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// Users table
export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: index("idx_users_email").on(table.email),
	}),
)

// Resume views table
export const resumeViews = pgTable("resume_views", {
	id: serial("id").primaryKey(),
	visitorId: varchar("visitor_id", { length: 255 }),
	pagePath: varchar("page_path", { length: 255 }),
	viewedAt: timestamp("viewed_at").defaultNow().notNull(),
})

// Contact submissions table
export const contactSubmissions = pgTable("contact_submissions", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	message: text("message").notNull(),
	submittedAt: timestamp("submitted_at").defaultNow().notNull(),
})

// Food table
export const foods = pgTable("foods", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	category: varchar("category", { length: 100 }).notNull(),
	description: text("description"),
	price: varchar("price", { length: 50 }),
	calories: varchar("calories", { length: 50 }),
	isVegetarian: varchar("is_vegetarian", { length: 10 }).default("false"),
	isVegan: varchar("is_vegan", { length: 10 }).default("false"),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Infer types from schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type ResumeView = typeof resumeViews.$inferSelect
export type NewResumeView = typeof resumeViews.$inferInsert

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert

export type Food = typeof foods.$inferSelect
export type NewFood = typeof foods.$inferInsert

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

export const insertFoodSchema = createInsertSchema(foods, {
	name: z.string().min(1),
	category: z.string().min(1),
	description: z.string().optional(),
	price: z.string().optional(),
	calories: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true })

export const selectFoodSchema = createSelectSchema(foods)

export type InsertUser = z.infer<typeof insertUserSchema>
export type InsertContact = z.infer<typeof insertContactSchema>
export type InsertFood = z.infer<typeof insertFoodSchema>
