/**
 * Require authenticated user, throw if not logged in
 */
export async function requireUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Please log in");
  }
  return identity;
}

/**
 * Get current user's restaurant ID
 * Creates user and restaurant if first login
 */
export async function getRestaurantId(ctx: any) {
  const identity = await requireUser(ctx);
  
  // Find or create user
  let user = await ctx.db
    .query("users")
    .withIndex("by_subject", (q: any) => q.eq("subject", identity.subject))
    .unique();
  
  if (!user) {
    const userId = await ctx.db.insert("users", {
      subject: identity.subject,
      email: identity.email ?? "",
      createdAt: Date.now(),
    });
    user = await ctx.db.get(userId);
  }
  
  // Find or create restaurant
  let restaurant = await ctx.db
    .query("restaurants")
    .withIndex("by_owner", (q: any) => q.eq("ownerUserId", user!._id))
    .unique();
  
  if (!restaurant) {
    const restaurantId = await ctx.db.insert("restaurants", {
      name: user!.restaurantName || "My Restaurant",
      ownerUserId: user!._id,
      createdAt: Date.now(),
    });
    restaurant = await ctx.db.get(restaurantId);
  }
  
  return restaurant!._id;
}
