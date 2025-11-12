# Product Requirements Document (PRD)
## menu-math

**Version:** 1.0 MVP  
**Last Updated:** November 12, 2025  
**Status:** Planning Phase  
**Target Launch:** End of Week

---

## 1. Executive Summary

**menu-math** is a web application that helps restaurant managers accurately calculate dish costs in real-time. By tracking ingredient prices and automatically computing dish costs with intelligent unit conversions, managers can make informed pricing decisions, optimize menu profitability, and quickly cost new dishes on the fly.

### Problem Statement
Restaurant managers struggle to:
- Accurately price dishes when ingredient costs fluctuate
- Calculate costs across different units of measurement (oz, grams, slices, pieces)
- Quickly evaluate profitability of new menu items
- Track how ingredient price changes affect their entire menu

### Solution
A simple, fast web app that:
- Stores ingredients with their current costs and units
- Automatically calculates total dish costs from ingredient quantities
- Tracks price history to show cost trends over time
- Converts between units automatically (with AI enhancement planned)
- Shows profit margins and food cost percentages instantly

### Success Metrics (MVP)
- Number of dishes created per restaurant
- Cost analysis insights (potential savings identified)
- Time to price a new dish
- User retention after first week

---

## 2. User Personas

### Primary: Restaurant Manager (Alex)
- **Role:** Day-to-day menu management and costing
- **Pain Points:** 
  - Manually calculating dish costs in spreadsheets
  - Losing track when supplier prices change
  - Can't quickly test new dish ideas
- **Goals:**
  - Price dishes accurately in under 2 minutes
  - See which dishes are most/least profitable
  - Update costs when invoices arrive
- **Device Usage:** Primarily phone (in kitchen) and desktop (in office)

### Secondary: Restaurant Owner (Sam)
- **Role:** Strategic menu decisions and profitability analysis
- **Pain Points:**
  - Can't see real-time cost data
  - Doesn't know which dishes are losing money
- **Goals:**
  - Understand menu profitability at a glance
  - Make data-driven pricing decisions
- **Device Usage:** Desktop and tablet

---

## 3. Core Features (MVP Scope)

### 3.1 Authentication & User Management
**Status:** ✅ In Scope (MVP)

- **Auth Provider:** Clerk (email/password)
- **Data Model:** 1 user = 1 restaurant (isolated data)
- **Onboarding:** Empty state with "Add your first ingredient" prompt
- **Future:** Multi-user restaurants with role-based permissions

**User Stories:**
- As a manager, I can sign up with email/password so my data is private
- As a user, I see a clear empty state after signup so I know what to do first

---

### 3.2 Ingredient Management
**Status:** ✅ In Scope (MVP)

**Features:**
- Add ingredients with: name, unit type, cost per unit
- Edit ingredient details (name, unit, cost)
- Delete ingredients (with dependency warnings)
- View all ingredients in a simple table
- Auto-save price history when cost changes

**Unit Types Supported (MVP):**
- Weight: gram (g), kilogram (kg), ounce (oz), pound (lb)
- Volume: milliliter (ml), liter (l)
- Count: piece, slice, each

**Data Model:**
```
ingredients:
  - id (UUID)
  - restaurant_id (FK)
  - name (text)
  - unit (text)
  - current_cost_per_unit_cents (integer)
  - created_at (timestamp)

ingredient_price_history:
  - id (UUID)
  - ingredient_id (FK)
  - cost_per_unit_cents (integer)
  - recorded_at (timestamp)
  - notes (text, optional)
```

**User Stories:**
- As a manager, I can add an ingredient with its unit and cost so I can use it in dishes
- As a manager, I can edit an ingredient's price and it auto-saves the old price to history
- As a manager, I can delete a price history entry if I made a mistake
- As a manager, when I try to delete an ingredient used in dishes, I see which dishes use it
- As a manager, I can archive an ingredient so it stays in existing dishes but appears grayed out

**Business Rules:**
- Price stored as **integer cents** (e.g., $12.50 = 1250) to avoid floating-point errors
- When cost is updated, old price automatically saved to `ingredient_price_history`
- Deleting ingredient used in dishes triggers warning modal showing affected dishes
- Deleted ingredients are **soft-deleted** (archived) - appear grayed/strikethrough in dishes
- Users can manually delete individual price history records

---

### 3.3 Dish Management
**Status:** ✅ In Scope (MVP)

**Features:**
- Create dishes with: name, description (optional), selling price (optional)
- Add ingredients to dishes with quantity and unit
- View total dish cost (auto-calculated)
- View profit margin (if selling price provided)
- View food cost % (if selling price provided)
- Edit dish details and ingredient quantities
- Set dish status: Live, Potential, Archive

**Calculations:**
- **Total Dish Cost** = Σ (ingredient_quantity × cost_per_unit × unit_conversion_factor)
- **Profit Margin** = Selling Price - Total Cost
- **Food Cost %** = (Total Cost / Selling Price) × 100

**Data Model:**
```
dishes:
  - id (UUID)
  - restaurant_id (FK)
  - name (text)
  - description (text, optional)
  - price_cents (integer, optional)
  - status (text: 'live' | 'potential' | 'archive')
  - created_at (timestamp)

dish_ingredients:
  - id (UUID)
  - dish_id (FK)
  - ingredient_id (FK)
  - quantity (decimal)
  - unit (text)
  - created_at (timestamp)
```

**User Stories:**
- As a manager, I can create a dish and add pre-created ingredients with quantities
- As a manager, I see the total cost update after I save ingredient quantities
- As a manager, I can optionally add a selling price to see profit margin and food cost %
- As a manager, I can mark dishes as Live, Potential, or Archive to organize my menu
- As a manager, when an ingredient price changes, all dish costs update automatically

**Business Rules:**
- Ingredients must be created before adding to dishes (no inline ingredient creation in MVP)
- Dish cost updates after save (not live-typing)
- Real-time recalculation when viewing dishes if ingredient prices changed
- If ingredient unit ≠ dish line unit, automatic conversion applied

---

### 3.4 Unit Conversion System
**Status:** ✅ In Scope (MVP - Static) | 🔮 Future (AI-Powered)

**MVP Approach:**
- Pre-seeded conversion table (read-only for users)
- Fixed conversion ratios for common units
- Automatic conversion when ingredient unit ≠ usage unit

**Conversion Table (Seeded):**
```
oz → g: 28.35
lb → g: 453.59
kg → g: 1000
g → oz: 0.035274
g → lb: 0.002205
g → kg: 0.001
l → ml: 1000
ml → l: 0.001
```

**Data Model:**
```
unit_conversions:
  - id (UUID)
  - from_unit (text)
  - to_unit (text)
  - conversion_factor (decimal)
```

**Future Enhancement (Post-MVP):**
- AI-powered conversions using Gemini Flash
- Handle complex conversions (e.g., "1 slice of salmon = 2 oz")
- User-editable custom conversions
- AI learns from user corrections

**User Stories:**
- As a manager, if I price fish by oz but use it by gram, the app converts automatically
- As a manager, I don't need to think about unit math - it just works

**Business Rules:**
- If no conversion exists, show error and prompt user to use matching units
- Conversions are bidirectional (if A→B exists, B→A should exist)
- Future: AI-generated conversions get saved to table for reuse

---

### 3.5 User Interface (MVP)

**Layout:**
- Single-page app with tab navigation
- Tabs: **Ingredients** | **Dishes** | **Account**
- Mobile-first design (optimized for phone + desktop)
- Clean, minimal aesthetic

**Ingredients Tab:**
- Editable table view
- Columns: Name | Unit | Cost per Unit | Actions (Edit/Delete)
- "+ Add Ingredient" button (opens inline form or modal)
- Empty state: "Add your first ingredient to get started"

**Dishes Tab:**
- Table view with expandable rows
- Columns: Dish Name | Status | Total Cost | Selling Price | Profit | Food Cost % | Actions
- Expand row to see ingredient breakdown
- "+ Add Dish" button
- Empty state: "Create your first dish"

**Account Tab:**
- Restaurant name
- User email
- Logout button
- (Future: Team members, settings)

**Design System:**
- Framework: React + Tailwind CSS
- Tables: Alternating row colors, clear borders
- Buttons: Rounded, primary blue, clear hover states
- Typography: Inter or similar clean sans-serif
- Money: Always show $ with 2 decimals (e.g., $12.50)
- Responsive breakpoints: Mobile (<768px), Desktop (≥768px)

---

## 4. Technical Architecture

### 4.1 Tech Stack

**Frontend:**
- **Framework:** React (based on bolt.new prototype)
- **Styling:** Tailwind CSS
- **State Management:** Convex React hooks (useQuery, useMutation)
- **Auth:** Clerk
- **Deployment:** Vercel

**Backend:**
- **Database:** Convex (real-time, serverless)
- **Auth:** Clerk (integrated with Convex)
- **Functions:** Convex mutations/queries (TypeScript)

**Future Enhancements:**
- **AI Conversions:** Gemini Flash API
- **Analytics:** PostHog or Mixpanel

### 4.2 Data Flow

```
User Action (UI)
    ↓
Clerk Auth Check
    ↓
Convex Mutation/Query
    ↓
Data Validation & Business Logic
    ↓
Convex Database (Real-time)
    ↓
Reactive UI Update (Convex subscriptions)
```

**Example: Adding an Ingredient**
1. User fills form: "Salmon, oz, $15.00"
2. Frontend converts $15.00 → 1500 cents
3. Convex mutation: `ingredients.add()`
4. Validates user owns restaurant
5. Inserts ingredient record
6. Auto-creates price history entry
7. UI updates instantly via Convex subscription

**Example: Viewing Dish Cost**
1. User opens Dishes tab
2. Convex query: `dishes.list(restaurantId)`
3. For each dish, fetch `dish_ingredients`
4. For each ingredient line:
   - Fetch ingredient current cost
   - Apply unit conversion if needed
   - Calculate: quantity × cost × conversion_factor
5. Sum all ingredient costs → Total Dish Cost
6. Calculate profit & food cost % if selling price exists
7. Return enriched dish data to UI

### 4.3 Security & Data Isolation

**Row-Level Security (Convex Implementation):**
- Every query/mutation checks `ctx.auth.getUserIdentity()`
- All data scoped by `restaurant_id`
- Users can only access their own restaurant's data

**Auth Flow:**
1. User signs up via Clerk
2. Clerk webhook → Convex creates user record
3. Convex creates restaurant record (1:1 with user)
4. All subsequent queries filtered by `restaurant_id`

**Future Multi-User:**
- Add `restaurant_members` table
- Check user has permission for restaurant
- Role-based access control (owner/manager/viewer)

---

## 5. User Flows

### 5.1 First-Time User Onboarding

```
1. User visits menu-math.com
2. Clicks "Sign Up"
3. Clerk signup form (email/password)
4. Redirects to app
5. Sees empty state: "Add your first ingredient"
6. Clicks "+ Add Ingredient"
7. Fills form: Name, Unit, Cost
8. Saves → Ingredient appears in table
9. Clicks "Dishes" tab
10. Sees empty state: "Create your first dish"
11. Clicks "+ Add Dish"
12. Fills dish name, adds ingredient with quantity
13. Saves → Sees total cost calculated
```

### 5.2 Daily Use: Updating Ingredient Price

```
1. Manager receives invoice with new salmon price
2. Opens menu-math on phone
3. Goes to Ingredients tab
4. Finds "Salmon" row
5. Clicks Edit
6. Changes cost from $15.00 → $18.00
7. Saves
8. Old price ($15.00) auto-saved to price history
9. Goes to Dishes tab
10. Sees all salmon dishes now show updated costs
11. Identifies dishes that are now unprofitable
12. Adjusts selling prices accordingly
```

### 5.3 Creating a New Dish

```
1. Chef wants to test new "Spicy Tuna Bowl" idea
2. Opens menu-math
3. Clicks "+ Add Dish"
4. Enters name: "Spicy Tuna Bowl"
5. Adds ingredients:
   - Tuna: 4 oz
   - Rice: 200 g
   - Spicy Mayo: 2 oz
   - Avocado: 0.5 piece
6. Saves
7. Sees total cost: $8.45
8. Enters potential selling price: $16.00
9. Sees profit margin: $7.55 (47% food cost)
10. Marks status as "Potential"
11. Shares with owner for approval
```

### 5.4 Deleting an Ingredient

```
1. User clicks Delete on "Old Supplier Salmon"
2. Modal appears: "This ingredient is used in 3 dishes:"
   - Salmon Nigiri
   - Salmon Roll
   - Salmon Poke Bowl
3. Options:
   - [Cancel] - go back
   - [Archive Ingredient] - soft delete, grays out in dishes
4. User clicks Archive
5. Ingredient removed from Ingredients table
6. In Dishes tab, ingredient shows as "Old Supplier Salmon (archived)" with strikethrough
7. Dish cost still calculated correctly using last known price
```

---

## 6. Non-Goals (Out of Scope for MVP)

### Explicitly NOT Building (Yet):
- ❌ Multi-user restaurants (coming post-MVP)
- ❌ Role-based permissions (owner/manager/viewer)
- ❌ AI-powered unit conversions (using static table first)
- ❌ Dish duplication / templates
- ❌ Ingredient categories (fish, produce, etc.)
- ❌ Export to CSV/PDF
- ❌ Recipe instructions or prep notes
- ❌ Inventory management
- ❌ Supplier management
- ❌ Purchase order generation
- ❌ Menu design/printing
- ❌ Nutrition information
- ❌ Allergen tracking
- ❌ Batch cost calculations
- ❌ Historical cost trend charts (data collected, UI later)
- ❌ Mobile native apps (web-first)
- ❌ Offline mode
- ❌ Integrations (POS, accounting software)

### Why These Are Deferred:
- **Focus:** Nail the core costing workflow first
- **Speed:** Ship MVP by end of week
- **Validation:** Test if users find value in basic costing before adding complexity
- **Iteration:** Gather feedback to prioritize next features

---

## 7. Open Questions & Decisions Needed

### Resolved:
- ✅ Database: Convex (chosen over Supabase)
- ✅ Auth: Clerk
- ✅ Money storage: Integer cents
- ✅ Unit conversions: Static table (MVP), AI later
- ✅ Price history: Auto-save on update
- ✅ Ingredient deletion: Soft delete with warnings
- ✅ Multi-user: Deferred to post-MVP

### Still Open:
- ⏳ Should price history be visible in UI or backend-only for now?
- ⏳ Max number of ingredients/dishes per restaurant (for performance testing)?
- ⏳ Should "Archive" dish status hide dishes by default or show grayed out?
- ⏳ Error handling: Toast notifications vs. inline errors?

---

## 8. Success Criteria (MVP Launch)

### Must Have (Launch Blockers):
- ✅ User can sign up and log in via Clerk
- ✅ User can CRUD ingredients with price tracking
- ✅ User can CRUD dishes with ingredient quantities
- ✅ Dish cost calculates correctly with unit conversions
- ✅ Profit margin and food cost % display correctly
- ✅ Data is isolated per user (security)
- ✅ Mobile-responsive UI (phone + desktop)
- ✅ Empty states guide new users

### Nice to Have (Post-Launch):
- 🎯 Price history visible in UI
- 🎯 Bulk import ingredients from CSV
- 🎯 Search/filter dishes by cost or status
- 🎯 Sort tables by column

### Success Metrics (Week 1):
- 2 test users (co-founders) create ≥5 dishes each
- Identify at least 1 cost-saving insight per user
- Zero critical bugs reported
- Positive feedback on speed and simplicity

---

## 9. Timeline & Milestones

**Target Launch:** End of Week (Nov 15-17, 2025)

### Day 1-2: Setup & Schema
- ✅ Initialize GitHub repo: `menu-math`
- ✅ Set up Convex project
- ✅ Define schema (users, restaurants, ingredients, dishes, etc.)
- ✅ Seed unit conversions table
- ✅ Set up Clerk auth integration

### Day 3-4: Core Features
- Build Ingredients CRUD (UI + Convex functions)
- Build Dishes CRUD (UI + Convex functions)
- Implement unit conversion logic
- Implement cost calculation engine
- Price history auto-save

### Day 5: Polish & Testing
- Empty states
- Delete warnings and soft delete
- Mobile responsive fixes
- Internal testing with 2 users
- Bug fixes

### Day 6-7: Deploy & Validate
- Deploy to Vercel
- Real-world testing with actual restaurant data
- Gather feedback
- Document learnings for v2 planning

---

## 10. Future Roadmap (Post-MVP)

### Phase 2: Multi-User & Collaboration
- Restaurant team members (owner, managers, staff)
- Role-based permissions
- Activity log (who changed what)

### Phase 3: AI & Intelligence
- Gemini Flash for smart unit conversions
- Cost trend predictions
- Suggested selling prices based on target food cost %
- Ingredient price alerts (when costs spike)

### Phase 4: Advanced Features
- Ingredient categories and tags
- Dish templates and duplication
- Batch costing (catering, events)
- Menu profitability dashboard
- Export reports (PDF, CSV)

### Phase 5: Integrations
- POS system sync (Toast, Square, Clover)
- Accounting software (QuickBooks, Xero)
- Supplier price feeds (auto-update costs)

---

## 11. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Unit conversion errors | High | Medium | Extensive testing with real recipes; seed accurate ratios |
| Floating-point rounding issues | Medium | Low | Use integer cents for all money calculations |
| Clerk auth integration issues | High | Low | Follow Convex + Clerk official docs; test early |
| Users confused by empty state | Medium | Medium | Clear onboarding prompts; consider sample data option |
| Performance with many dishes | Medium | Low | Optimize Convex queries; test with 100+ dishes |
| Scope creep during build | High | High | Strict adherence to PRD; defer all "nice-to-haves" |

---

## 12. Appendix

### A. Glossary
- **Food Cost %**: (Dish Cost / Selling Price) × 100 - industry standard metric
- **Profit Margin**: Selling Price - Total Cost (in dollars)
- **Soft Delete**: Marking record as deleted without removing from database
- **Unit Conversion Factor**: Multiplier to convert quantity from one unit to another

### B. Competitive Landscape
- **MarginEdge**: Enterprise, complex, expensive
- **PlateIQ**: Invoice automation focus, not dish costing
- **Spreadsheets**: Manual, error-prone, no real-time updates
- **menu-math Advantage**: Simple, fast, mobile-first, affordable

### C. Design References
- Bolt.new prototype (co-founder's version)
- Airtable (table editing UX)
- Linear (clean, minimal aesthetic)

---

**Document Owner:** Jonathan (Founder)  
**Contributors:** Co-founder (Restaurant Manager), Claude (AI Assistant)  
**Next Review:** After MVP launch (Nov 18, 2025)
