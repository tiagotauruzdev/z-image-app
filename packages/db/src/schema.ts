import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  varchar,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const imageGenerationTasks = pgTable("image_generation_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: varchar("task_id", { length: 255 }).notNull().unique(),
  prompt: text("prompt").notNull(),
  aspectRatio: varchar("aspect_ratio", { length: 10 }).notNull().default("1:1"),
  status: varchar("status", { length: 20 }).notNull().default("waiting"),
  resultUrls: jsonb("result_urls").$type<string[]>().$default(() => []),
  failureCode: varchar("failure_code", { length: 50 }),
  failureMessage: text("failure_message"),
  costTime: integer("cost_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Schemas Zod gerados automaticamente com validações customizadas
export const insertTaskSchema = createInsertSchema(imageGenerationTasks, {
  prompt: (schema) => schema.min(1).max(1000),
  aspectRatio: (schema) => schema.refine(
    (val) => ["1:1", "4:3", "3:4", "16:9", "9:16"].includes(val),
    { message: "Aspect ratio inválido" }
  )
}).omit({
  id: true,
  taskId: true,
  status: true,
  resultUrls: true,
  failureCode: true,
  failureMessage: true,
  costTime: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true
});

export const selectTaskSchema = createSelectSchema(imageGenerationTasks);

export type ImageGenerationTask = typeof imageGenerationTasks.$inferSelect;
export type NewImageGenerationTask = typeof imageGenerationTasks.$inferInsert;