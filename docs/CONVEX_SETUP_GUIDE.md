# Convex Setup Guide for menu-math

**Step-by-step guide to connect your Convex database and create the schema**

---

## 📋 Prerequisites

You mentioned you already created a `menu-math` database project in Convex. Great! Now we need to:

1. Install Convex in your local project
2. Connect to your Convex project
3. Set up Clerk authentication
4. Create the database schema
5. Seed unit conversions

---

## 1. Install Convex

In your project root, install Convex:

```bash
npm install convex
```

---

## 2. Initialize Convex in Your Project

Run the Convex initialization command:

```bash
npx convex dev
```

**What this does:**
- Creates a `convex/` folder in your project
- Generates `convex.json` config file
- Opens your browser to link to your existing Convex project
- Starts a local development server

**When prompted:**
- Select your existing `menu-math` project from the list
- It will connect your local code to your cloud database

---

## 3. Project Structure After Init

After running `npx convex dev`, you should have:

```
menu-math/
├── convex/
│   ├── _generated/          # Auto-generated types (don't edit)
│   ├── tsconfig.json        # TypeScript config for Convex
│   └── README.md            # Convex folder info
├── convex.json              # Convex project config
└── ...
```

---

## 4. Create Database Schema

Create the schema file that defines your database structure:

**File:** `convex/schema.ts`

```typescript
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
```

**Save this file.** Convex will automatically detect it and push the schema to your database.

---

## 5. Set Up Clerk Authentication

### A. Install Clerk React SDK

```bash
npm install @clerk/clerk-react
```

### B. Get Your Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign in
2. Create a new application called "menu-math"
3. Choose **Email/Password** authentication
4. Copy your **Publishable Key**
5. Go to **JWT Templates** → Create new template → Name it "convex"
6. Copy the **Issuer URL** (looks like: `https://your-app.clerk.accounts.dev`)

### C. Configure Environment Variables

Create `.env.local` in your project root:

```env
# Convex
VITE_CONVEX_URL=https://your-project.convex.cloud

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
```

**Get your Convex URL:**
- Run `npx convex dev`
- Look for the URL in the terminal output
- Or find it in your Convex dashboard → Settings

### D. Configure Convex to Use Clerk

Create **`convex/auth.config.ts`**:

```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
```

### E. Set Clerk Issuer in Convex Dashboard

1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your `menu-math` project
3. Go to **Settings** → **Environment Variables**
4. Add: `CLERK_JWT_ISSUER_DOMAIN` = `https://your-app.clerk.accounts.dev`
5. Save

---

## 6. Create Helper Functions

Create **`convex/_utils.ts`** for authentication helpers:

```typescript
import { QueryCtx, MutationCtx } from "convex/server";

/**
 * Require authenticated user, throw if not logged in
 */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
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
export async function getRestaurantId(ctx: QueryCtx | MutationCtx) {
  const identity = await requireUser(ctx);
  
  // Find or create user
  let user = await ctx.db
    .query("users")
    .withIndex("by_subject", q => q.eq("subject", identity.subject))
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
    .withIndex("by_owner", q => q.eq("ownerUserId", user!._id))
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
```

---

## 7. Seed Unit Conversions

Create **`convex/conversions.ts`**:

```typescript
import { mutation, query } from "convex/server";
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
        .withIndex("by_pair", q => 
          q.eq("fromUnit", fromUnit).eq("toUnit", toUnit)
        )
        .unique();
      
      if (!existing) {
        await ctx.db.insert("unit_conversions", {
          fromUnit,
          toUnit,
          factor,
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
      .withIndex("by_pair", q => 
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
```

**Run the seed function:**

```bash
npx convex run conversions:seed
```

You should see: `{ success: true, message: "Unit conversions seeded" }`

---

## 8. Set Up React Frontend with Clerk + Convex

### A. Install React Dependencies

```bash
npm install react react-dom
npm install convex @clerk/clerk-react
```

### B. Create Main App Entry Point

**File:** `src/main.tsx` (or `src/index.tsx`)

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
```

### C. Create Basic App Component

**File:** `src/App.tsx`

```typescript
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

function App() {
  return (
    <main className="min-h-screen p-8">
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">menu-math</h1>
          <p className="mb-4">Calculate dish costs instantly</p>
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-6 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </Unauthenticated>
      
      <Authenticated>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">menu-math</h1>
            <UserButton />
          </div>
          <Content />
        </div>
      </Authenticated>
    </main>
  );
}

function Content() {
  const { user } = useUser();
  
  return (
    <div>
      <h2 className="text-xl mb-4">Welcome, {user?.firstName}!</h2>
      <p>Your restaurant dashboard will go here.</p>
    </div>
  );
}

export default App;
```

---

## 9. Verify Everything Works

### A. Start Development Servers

**Terminal 1 - Convex:**
```bash
npx convex dev
```

**Terminal 2 - React:**
```bash
npm run dev
```

### B. Test the Setup

1. Open http://localhost:5173 (or your Vite port)
2. Click "Sign In"
3. Create an account with email/password
4. You should see "Welcome, [Your Name]!"
5. Check Convex dashboard → Data → You should see a `users` table with your user

### C. Verify Schema in Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Select your `menu-math` project
3. Click **Data** tab
4. You should see all tables:
   - users
   - restaurants
   - ingredients
   - ingredient_price_history
   - dishes
   - dish_ingredients
   - unit_conversions (should have ~20 rows from seed)

---

## 10. Next Steps

Now that Convex is connected and your schema is live, you can:

1. **Create ingredient CRUD functions** in `convex/ingredients.ts`
2. **Create dish CRUD functions** in `convex/dishes.ts`
3. **Build the UI components** (use V0_PROMPT.md)
4. **Reference TECHNICAL_SPEC.md** for API function signatures

---

## 🔍 Troubleshooting

### "Unauthorized" errors
- Check `CLERK_JWT_ISSUER_DOMAIN` is set in Convex dashboard
- Verify Clerk JWT template is named "convex"
- Clear browser cookies and re-login

### Schema not updating
- Make sure `npx convex dev` is running
- Check terminal for errors
- Try restarting the Convex dev server

### Can't connect to Convex project
- Run `npx convex dev` and select your project from the list
- Check `convex.json` has correct project ID
- Verify you're logged into the correct Convex account

### Seed function fails
- Make sure schema is pushed (check Convex dashboard)
- Verify `unit_conversions` table exists
- Check for typos in function name: `conversions:seed`

---

## 📚 Key Concepts

### Convex Queries vs Mutations

**Queries** (read data):
- Use `query()` from `convex/server`
- Automatically reactive (UI updates when data changes)
- Can be called with `useQuery()` in React

**Mutations** (write data):
- Use `mutation()` from `convex/server`
- Transactional (all-or-nothing)
- Can be called with `useMutation()` in React

### Example Query

```typescript
// convex/ingredients.ts
import { query } from "convex/server";
import { getRestaurantId } from "./_utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const restaurantId = await getRestaurantId(ctx);
    return await ctx.db
      .query("ingredients")
      .withIndex("by_restaurant", q => q.eq("restaurantId", restaurantId))
      .collect();
  },
});
```

### Example Mutation

```typescript
// convex/ingredients.ts
import { mutation } from "convex/server";
import { v } from "convex/values";
import { getRestaurantId } from "./_utils";

export const add = mutation({
  args: {
    name: v.string(),
    unit: v.string(),
    costPerUnitCents: v.number(),
  },
  handler: async (ctx, args) => {
    const restaurantId = await getRestaurantId(ctx);
    
    return await ctx.db.insert("ingredients", {
      restaurantId,
      name: args.name,
      unit: args.unit,
      currentCostPerUnitCents: args.costPerUnitCents,
      isArchived: false,
      createdAt: Date.now(),
    });
  },
});
```

### Using in React

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function IngredientsPage() {
  const ingredients = useQuery(api.ingredients.list);
  const addIngredient = useMutation(api.ingredients.add);
  
  const handleAdd = async () => {
    await addIngredient({
      name: "Salmon",
      unit: "oz",
      costPerUnitCents: 1500, // $15.00
    });
  };
  
  return (
    <div>
      <button onClick={handleAdd}>Add Ingredient</button>
      {ingredients?.map(ing => (
        <div key={ing._id}>{ing.name}</div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] Convex installed: `npm install convex`
- [ ] Convex initialized: `npx convex dev`
- [ ] Schema created: `convex/schema.ts`
- [ ] Auth config created: `convex/auth.config.ts`
- [ ] Helper functions created: `convex/_utils.ts`
- [ ] Conversions seeded: `npx convex run conversions:seed`
- [ ] Clerk installed: `npm install @clerk/clerk-react`
- [ ] Environment variables set in `.env.local`
- [ ] Clerk issuer set in Convex dashboard
- [ ] React app wrapped with providers
- [ ] Can sign in and see user data
- [ ] Tables visible in Convex dashboard

---

**You're now ready to build the actual features! 🚀**

Reference `TECHNICAL_SPEC.md` for the full API functions to implement next.
