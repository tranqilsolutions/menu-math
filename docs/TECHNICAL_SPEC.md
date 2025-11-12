# Technical Specification - menu-math

**Version:** 1.0 MVP  
**Last Updated:** November 12, 2025

---

## 1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Tailwind | Component reusability, rapid UI dev |
| Backend | Convex | Real-time, TypeScript-native, serverless |
| Database | Convex DB | Built-in, no separate management |
| Auth | Clerk | Best UX, easy Convex integration |
| Hosting | Vercel | Zero-config, edge network |

---

## 2. Database Schema (Convex)

### Core Tables

**users**
- `subject` (string) - Clerk ID
- `email` (string)
- `restaurantName` (string, optional)
- `createdAt` (number)

**restaurants**
- `name` (string)
- `ownerUserId` (id → users)
- `createdAt` (number)

**ingredients**
- `restaurantId` (id → restaurants)
- `name` (string)
- `unit` (string) - "g", "kg", "oz", "lb", "ml", "l", "piece", "slice"
- `currentCostPerUnitCents` (number) - integer cents
- `isArchived` (boolean)
- `createdAt` (number)
- `archivedAt` (number, optional)

**ingredient_price_history**
- `ingredientId` (id → ingredients)
- `costPerUnitCents` (number)
- `recordedAt` (number)
- `notes` (string, optional)

**dishes**
- `restaurantId` (id → restaurants)
- `name` (string)
- `description` (string, optional)
- `priceCents` (number, optional) - selling price
- `status` (string) - "live" | "potential" | "archive"
- `createdAt` (number)

**dish_ingredients**
- `dishId` (id → dishes)
- `ingredientId` (id → ingredients)
- `quantity` (number)
- `unit` (string)
- `createdAt` (number)

**unit_conversions**
- `fromUnit` (string)
- `toUnit` (string)
- `factor` (number)

### Key Design Decisions

**Money as Integer Cents**
- Avoids floating-point errors
- Standard in financial apps
- Display: `(cents / 100).toFixed(2)`

**Soft Delete for Ingredients**
- `isArchived` flag instead of hard delete
- Preserves historical dish costs
- Dishes show archived ingredients grayed out

**Timestamps as Numbers**
- Unix milliseconds (Date.now())
- Convex doesn't support Date type natively
- Easy sorting and comparison

---

## 3. API Functions (Convex)

### Authentication

```typescript
// convex/_utils.ts
export async function requireUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

export async function getRestaurantId(ctx) {
  const identity = await requireUser(ctx);
  // Find or create user + restaurant
  // Returns restaurant._id
}
```

### Ingredients

**list()** - Get all active ingredients  
**add(name, unit, costPerUnitCents)** - Create ingredient + first price history  
**updateCost(ingredientId, newCostPerUnitCents, notes?)** - Update price, auto-save history  
**archive(ingredientId)** - Soft delete, return affected dishes  
**getPriceHistory(ingredientId)** - Get price changes over time  
**deletePriceHistory(historyId)** - Remove history entry

### Dishes

**list()** - Get all dishes with calculated costs  
**getWithCostBreakdown(dishId)** - Detailed cost per ingredient  
**add(name, description?, priceCents?, status)** - Create dish  
**update(dishId, ...)** - Edit dish details  
**remove(dishId)** - Delete dish + all ingredient lines

### Dish Ingredients

**addToDish(dishId, ingredientId, quantity, unit)** - Add ingredient to dish  
**updateQuantity(lineId, quantity, unit)** - Change ingredient amount  
**removeFromDish(lineId)** - Remove ingredient from dish  
**listForDish(dishId)** - Get all ingredients in dish

### Unit Conversions

**seed()** - Initialize conversion table (run once)  
**getConversionFactor(fromUnit, toUnit)** - Get multiplier  
**convertQuantity(quantity, fromUnit, toUnit)** - Helper for calculations

---

## 4. Cost Calculation Logic

### Algorithm

```typescript
async function calculateDishCost(ctx, dishId) {
  const lines = await getDishIngredients(dishId);
  let totalCostCents = 0;
  
  for (const line of lines) {
    const ingredient = await getIngredient(line.ingredientId);
    
    // Convert quantity to ingredient's base unit
    const convertedQty = await convertQuantity(
      line.quantity,
      line.unit,
      ingredient.unit
    );
    
    // Calculate cost for this line
    const lineCost = Math.round(
      convertedQty * ingredient.currentCostPerUnitCents
    );
    
    totalCostCents += lineCost;
  }
  
  // Calculate metrics if selling price exists
  const foodCostPercent = dish.priceCents 
    ? (totalCostCents / dish.priceCents) * 100 
    : null;
  
  const profitMarginCents = dish.priceCents 
    ? dish.priceCents - totalCostCents 
    : null;
  
  return { totalCostCents, foodCostPercent, profitMarginCents };
}
```

### Example

**Dish:** Salmon Bowl  
**Selling Price:** $16.00 (1600 cents)

| Ingredient | Quantity | Unit | Cost/Unit | Converted | Line Cost |
|------------|----------|------|-----------|-----------|-----------|
| Salmon | 4 oz | oz | $15/oz (1500¢) | 4 oz | 6000¢ |
| Rice | 200 g | g | $0.01/g (1¢) | 200 g | 200¢ |
| Avocado | 0.5 piece | piece | $2/piece (200¢) | 0.5 piece | 100¢ |

**Total Cost:** 6300¢ = $6.30  
**Profit Margin:** $16.00 - $6.30 = $9.70  
**Food Cost %:** (6.30 / 16.00) × 100 = 39.4%

---

## 5. Frontend Architecture

### Component Structure

```
src/
├── App.tsx                    # Main app + routing
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── ingredients/
│   │   ├── IngredientTable.tsx
│   │   ├── IngredientRow.tsx
│   │   ├── AddIngredientForm.tsx
│   │   └── PriceHistoryModal.tsx
│   ├── dishes/
│   │   ├── DishTable.tsx
│   │   ├── DishRow.tsx
│   │   ├── AddDishForm.tsx
│   │   ├── DishCostBreakdown.tsx
│   │   └── AddIngredientToDish.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Tabs.tsx
│   │   └── EmptyState.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Table.tsx
├── hooks/
│   ├── useIngredients.ts      # Convex query wrapper
│   ├── useDishes.ts           # Convex query wrapper
│   └── useAuth.ts             # Clerk auth wrapper
├── lib/
│   ├── money.ts               # formatCents(cents) => "$12.50"
│   ├── units.ts               # Unit type definitions
│   └── constants.ts           # App constants
└── convex/
    └── _generated/            # Auto-generated Convex types
```

### Key React Hooks

```typescript
// useIngredients.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useIngredients() {
  const ingredients = useQuery(api.ingredients.list);
  const addIngredient = useMutation(api.ingredients.add);
  const updateCost = useMutation(api.ingredients.updateCost);
  const archiveIngredient = useMutation(api.ingredients.archive);
  
  return { ingredients, addIngredient, updateCost, archiveIngredient };
}
```

### Money Formatting

```typescript
// lib/money.ts
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function parseDollars(dollars: string): number {
  const cleaned = dollars.replace(/[^0-9.]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
}

// Usage
formatCents(1250) // "$12.50"
parseDollars("$12.50") // 1250
```

---

## 6. Security & Data Isolation

### Row-Level Security

Every Convex function enforces:
1. User is authenticated (Clerk)
2. User owns the restaurant
3. Data scoped by `restaurantId`

```typescript
// Example: ingredients.list
export const list = query({
  handler: async (ctx) => {
    const restaurantId = await getRestaurantId(ctx); // throws if not auth'd
    return await ctx.db
      .query("ingredients")
      .withIndex("by_restaurant", q => q.eq("restaurantId", restaurantId))
      .collect();
  },
});
```

### Future Multi-User

When adding team members:
- Create `restaurant_members` table
- Check user has access to restaurant
- Add role-based permissions (owner/manager/viewer)

---

## 7. Deployment

### Convex Setup

```bash
# Install Convex CLI
npm install -g convex

# Initialize project
npx convex dev

# Deploy to production
npx convex deploy
```

### Vercel Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables

```env
# .env.local
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 8. Testing Strategy

### Unit Tests
- Money formatting functions
- Unit conversion logic
- Cost calculation algorithm

### Integration Tests
- Ingredient CRUD flow
- Dish cost calculation with conversions
- Price history auto-save

### Manual Testing Checklist
- [ ] Sign up new user
- [ ] Add 5+ ingredients with different units
- [ ] Create dish with 3+ ingredients
- [ ] Update ingredient price → dish cost updates
- [ ] Archive ingredient → warning shows affected dishes
- [ ] Delete price history entry
- [ ] Mobile responsive on phone
- [ ] Calculations accurate to 2 decimals

---

## 9. Performance Considerations

### Optimization Strategies

**Convex Indexes**
- `by_restaurant` on all user data tables
- `by_dish` on dish_ingredients
- `by_ingredient` on price_history

**Query Efficiency**
- Fetch only active ingredients by default
- Paginate price history if >100 entries
- Cache conversion factors (rarely change)

**Real-time Updates**
- Convex subscriptions auto-update UI
- No manual polling needed
- Optimistic updates for mutations

### Scalability Limits (MVP)

| Resource | Limit | Notes |
|----------|-------|-------|
| Ingredients/restaurant | 1000 | Sufficient for most restaurants |
| Dishes/restaurant | 500 | Typical menu is 50-100 items |
| Price history/ingredient | Unlimited | Auto-archived after 1 year (future) |
| Concurrent users | 100 | Convex free tier handles this |

---

## 10. Future Enhancements

### Phase 2: AI Conversions

```typescript
// convex/ai.ts
import { Gemini } from "@google/generative-ai";

export const convertWithAI = mutation({
  args: {
    quantity: v.number(),
    fromUnit: v.string(),
    toUnit: v.string(),
    context: v.optional(v.string()), // e.g., "salmon slice"
  },
  handler: async (ctx, args) => {
    // Call Gemini Flash API
    const prompt = `Convert ${args.quantity} ${args.fromUnit} to ${args.toUnit}. Context: ${args.context}`;
    const result = await gemini.generateContent(prompt);
    
    // Parse result and save to unit_conversions table
    // Return converted quantity
  },
});
```

### Phase 3: Analytics Dashboard

- Cost trend charts (Chart.js)
- Most/least profitable dishes
- Ingredient price alerts
- Food cost % targets

---

## 11. Error Handling

### User-Facing Errors

| Error | Message | Action |
|-------|---------|--------|
| No conversion | "Cannot convert oz to piece. Use matching units." | Show unit selector |
| Ingredient in use | "Used in 3 dishes: [list]. Archive instead?" | Show modal with options |
| Negative cost | "Cost must be positive" | Highlight input field |
| Unauthorized | "Please log in" | Redirect to login |

### Developer Errors

```typescript
// Log to console in dev, send to monitoring in prod
function handleError(error: Error, context: string) {
  console.error(`[${context}]`, error);
  
  if (import.meta.env.PROD) {
    // Send to Sentry/LogRocket
  }
}
```

---

## 12. Development Workflow

### Local Setup

```bash
# Clone repo
git clone https://github.com/your-username/menu-math.git
cd menu-math

# Install dependencies
npm install

# Start Convex dev server
npx convex dev

# Start React dev server
npm run dev

# Seed conversions (run once)
npx convex run conversions:seed
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/dish-duplication

# Commit with conventional commits
git commit -m "feat: add dish duplication button"

# Push and create PR
git push origin feature/dish-duplication
```

---

**Document Owner:** Jonathan (Founder)  
**Last Updated:** November 12, 2025
