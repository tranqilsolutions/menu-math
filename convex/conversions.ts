import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed unit conversions (run once)
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const conversions = [
      // Weight conversions
      ["oz", "g", 28.35],
      ["lb", "g", 453.59],
      ["kg", "g", 1000],
      ["g", "oz", 0.035274],
      ["g", "lb", 0.002205],
      ["g", "kg", 0.001],
      ["lb", "oz", 16],
      ["oz", "lb", 0.0625],
      ["kg", "lb", 2.20462],
      ["lb", "kg", 0.453592],
      
      // Volume conversions
      ["l", "ml", 1000],
      ["ml", "l", 0.001],
      
      // Identity conversions
      ["g", "g", 1],
      ["kg", "kg", 1],
      ["oz", "oz", 1],
      ["lb", "lb", 1],
      ["ml", "ml", 1],
      ["l", "l", 1],
      ["piece", "piece", 1],
      ["slice", "slice", 1],
    ];
    
    for (const [fromUnit, toUnit, factor] of conversions) {
      const existing = await ctx.db
        .query("unit_conversions")
        .withIndex("by_pair", (q: any) => 
          q.eq("fromUnit", fromUnit as string).eq("toUnit", toUnit as string)
        )
        .unique();
      
      if (!existing) {
        await ctx.db.insert("unit_conversions", {
          fromUnit: fromUnit as string,
          toUnit: toUnit as string,
          factor: factor as number,
        });
      }
    }
    
    return { success: true, message: "Unit conversions seeded" };
  },
});

/**
 * Get conversion factor between units
 */
export const getConversionFactor = query({
  args: {
    fromUnit: v.string(),
    toUnit: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.fromUnit === args.toUnit) return 1;
    
    const conversion = await ctx.db
      .query("unit_conversions")
      .withIndex("by_pair", (q: any) => 
        q.eq("fromUnit", args.fromUnit).eq("toUnit", args.toUnit)
      )
      .unique();
    
    if (!conversion) {
      throw new Error(
        `No conversion from ${args.fromUnit} to ${args.toUnit}`
      );
    }
    
    return conversion.factor;
  },
});
