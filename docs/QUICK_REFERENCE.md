# Quick Reference - menu-math

**One-page cheat sheet for development**

---

## 🎯 Project Overview

**What:** Restaurant dish costing calculator  
**Goal:** Help managers accurately price menu items  
**MVP Timeline:** End of week  
**Tech:** React + Tailwind + Convex + Clerk

---

## 📁 Key Documents

| Document | Purpose |
|----------|---------|
| `PRD.md` | Full product requirements, user stories, features |
| `TECHNICAL_SPEC.md` | Database schema, API design, architecture |
| `V0_PROMPT.md` | Frontend UI design prompt (copy to v0.dev) |
| `SETUP_GUIDE.md` | Step-by-step developer setup |
| `MVP_SCOPE.md` | What's in/out of scope, decision framework |
| `QUICK_REFERENCE.md` | This file - quick lookup |

---

## 🗄️ Database Tables

```
users → restaurants → ingredients → ingredient_price_history
                   → dishes → dish_ingredients
                   
unit_conversions (global, pre-seeded)
```

**Key Fields:**
- Money: Integer cents (e.g., 1250 = $12.50)
- Timestamps: Unix milliseconds (Date.now())
- Soft delete: `isArchived` boolean

---

## 🔧 Common Commands

```bash
# Start development
npx convex dev          # Terminal 1 - Backend
npm run dev             # Terminal 2 - Frontend

# Seed conversions (run once)
npx convex run conversions:seed

# Deploy to production
npx convex deploy --prod
vercel --prod

# View logs
npx convex logs

# Clear data (careful!)
npx convex run clearAllData
```

---

## 🎨 Design System

**Colors:**
- Primary: Blue (#3B82F6)
- Background: White (#FFFFFF)
- Borders: Gray-200 (#E5E7EB)
- Text: Gray-900 (#111827)
- Archived: Gray-400 (#9CA3AF) + strikethrough

**Typography:** Inter, 16px base

**Spacing:** Tailwind defaults (4px increments)

---

## 💰 Money Formatting

```typescript
// Storage
currentCostPerUnitCents: 1250  // $12.50

// Display
const formatCents = (cents) => `$${(cents / 100).toFixed(2)}`;

// Input parsing
const parseDollars = (str) => Math.round(parseFloat(str) * 100);
```

---

## 🔄 Unit Conversions

**Supported Units:**
- Weight: g, kg, oz, lb
- Volume: ml, l
- Count: piece, slice

**Pre-seeded Conversions:**
- 1 oz = 28.35 g
- 1 lb = 453.59 g
- 1 kg = 1000 g
- 1 l = 1000 ml

---

## 🧮 Cost Calculation

```typescript
dishCost = Σ (quantity × costPerUnit × conversionFactor)

foodCostPercent = (dishCost / sellingPrice) × 100

profitMargin = sellingPrice - dishCost
```

---

## 📱 Responsive Breakpoints

- Mobile: <768px (stack, full-width, large tap targets)
- Desktop: ≥768px (tables, side-by-side, hover states)

---

## ✅ MVP Feature Checklist

**Auth:**
- [x] Sign up / Log in (Clerk)
- [x] 1 user = 1 restaurant

**Ingredients:**
- [x] Add, edit, delete
- [x] Auto-save price history
- [x] Soft delete with warnings

**Dishes:**
- [x] Add, edit, delete
- [x] Add ingredients with quantities
- [x] Auto-calculate costs
- [x] Show profit & food cost %
- [x] Status: Live/Potential/Archive

**UI:**
- [x] Tabs: Ingredients, Dishes, Account
- [x] Empty states
- [x] Mobile responsive
- [x] Clean, minimal design

---

## 🚫 NOT in MVP

- ❌ Multi-user restaurants
- ❌ AI conversions
- ❌ Price history UI
- ❌ Ingredient categories
- ❌ Dish duplication
- ❌ Export/import
- ❌ Analytics dashboard

---

## 🐛 Troubleshooting

**"Unauthorized" errors:**
- Check Clerk config in Convex dashboard
- Verify env vars set correctly
- Clear cookies, re-login

**Conversions not working:**
- Run: `npx convex run conversions:seed`
- Check unit_conversions table has data

**Costs not updating:**
- Check ingredient has valid cost
- Verify conversion exists for units
- Check browser console for errors

---

## 📞 Support Resources

- **Convex Docs:** https://docs.convex.dev
- **Clerk Docs:** https://clerk.com/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 🎯 Success Metrics

**Week 1:**
- 2 active users
- 20+ ingredients created
- 10+ dishes created
- 1+ cost insight per user
- Zero critical bugs

---

## 🚀 Launch Workflow

1. **Build** → Follow SETUP_GUIDE.md
2. **Test** → Manual testing checklist in TECHNICAL_SPEC.md
3. **Deploy** → Convex + Vercel
4. **Invite** → 2 test users (co-founders)
5. **Monitor** → Watch logs, gather feedback
6. **Iterate** → Fix bugs, plan Phase 2

---

**Need more details? Check the full docs above. Need to build UI? Use V0_PROMPT.md.**
