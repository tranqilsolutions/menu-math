import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================================
  // USERS & RESTAURANTS
  // ============================================================
  
  users: defineTable({
    subject: v.string(),              // Clerk user ID
    email: v.string(),
    restaurantName: v.optional(v.string()),
    createdAt: v.number(),            // Unix timestamp
  })
    .index("by_subject", ["subject"])
    .index("by_email", ["email"]),

  restaurants: defineTable({
    name: v.string(),
    ownerUserId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerUserId"]),

  // ============================================================
  // INGREDIENTS
  // ============================================================
  
  ingredients: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    unit: v.string(),                 // "g", "kg", "oz", "lb", "ml", "l", "piece", "slice"
    currentCostPerUnitCents: v.number(), // Integer cents (e.g., 1250 = $12.50)
    isArchived: v.boolean(),
    createdAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_active", ["restaurantId", "isArchived"]),

  ingredient_price_history: defineTable({
    ingredientId: v.id("ingredients"),
    costPerUnitCents: v.number(),
    recordedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_ingredient", ["ingredientId"])
    .index("by_ingredient_date", ["ingredientId", "recordedAt"]),

  // ============================================================
  // DISHES
  // ============================================================
  
  dishes: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    description: v.optional(v.string()),
    priceCents: v.optional(v.number()), // Selling price
    status: v.string(),                 // "live" | "potential" | "archive"
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_status", ["restaurantId", "status"]),

  dish_ingredients: defineTable({
    dishId: v.id("dishes"),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
    unit: v.string(),
    createdAt: v.number(),
  })
    .index("by_dish", ["dishId"])
    .index("by_ingredient", ["ingredientId"]),

  // ============================================================
  // UNIT CONVERSIONS
  // ============================================================
  
  unit_conversions: defineTable({
    fromUnit: v.string(),
    toUnit: v.string(),
    factor: v.number(),
  })
    .index("by_pair", ["fromUnit", "toUnit"]),
});
