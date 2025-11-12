# MVP Scope - menu-math

**What we're building (and NOT building) for launch**

---

## ✅ IN SCOPE - Must Have for MVP

### Core Features

**1. Authentication**
- Sign up with email/password (Clerk)
- Log in / Log out
- Protected routes
- 1 user = 1 restaurant (isolated data)

**2. Ingredient Management**
- Add ingredient (name, unit, cost per unit)
- Edit ingredient details
- Update ingredient cost → auto-save price history
- Delete/archive ingredient with warnings
- View list of all ingredients
- Empty state for new users

**3. Dish Management**
- Create dish (name, description, selling price, status)
- Add ingredients to dish with quantities
- View total dish cost (auto-calculated)
- View profit margin (if selling price provided)
- View food cost % (if selling price provided)
- Edit dish details
- Delete dish
- Set status: Live, Potential, Archive
- Empty state for new users

**4. Unit Conversions**
- Pre-seeded conversion table (read-only)
- Automatic conversion when ingredient unit ≠ dish unit
- Support: g, kg, oz, lb, ml, l, piece, slice
- Error message if conversion doesn't exist

**5. Price History**
- Auto-save old price when ingredient cost updated
- Store with timestamp and optional notes
- User can delete individual history entries
- Backend-only for MVP (no UI to view history yet)

**6. Cost Calculations**
- Real-time dish cost calculation
- Ingredient quantity × cost × conversion factor
- Sum all ingredients for total dish cost
- Calculate profit margin: selling price - cost
- Calculate food cost %: (cost / selling price) × 100
- Update all dish costs when ingredient price changes

**7. User Interface**
- Single-page app with tabs (Ingredients, Dishes, Account)
- Mobile-first responsive design
- Clean, minimal aesthetic (white, gray, blue)
- Table views for ingredients and dishes
- Modal forms for add/edit
- Empty states with clear CTAs
- Delete confirmation modals
- Archived ingredients show grayed/strikethrough in dishes

**8. Data Isolation**
- Each user has separate restaurant
- Row-level security (Convex auth guards)
- Users can only see their own data

---

## ❌ OUT OF SCOPE - Deferred to Post-MVP

### Explicitly NOT Building Yet

**Multi-User & Collaboration**
- ❌ Multiple users per restaurant
- ❌ Team member invites
- ❌ Role-based permissions (owner/manager/viewer)
- ❌ Activity log (who changed what)
- ❌ Real-time collaboration

**AI Features**
- ❌ AI-powered unit conversions (Gemini Flash)
- ❌ Smart ingredient suggestions
- ❌ Cost prediction / forecasting
- ❌ Suggested selling prices

**Advanced Ingredient Features**
- ❌ Ingredient categories (fish, produce, etc.)
- ❌ Ingredient tags
- ❌ Supplier tracking
- ❌ Bulk import from CSV
- ❌ Ingredient photos
- ❌ Nutrition information
- ❌ Allergen tracking

**Advanced Dish Features**
- ❌ Dish duplication / templates
- ❌ Recipe instructions
- ❌ Prep time tracking
- ❌ Portion size variations
- ❌ Dish photos
- ❌ Menu categories
- ❌ Seasonal dishes
- ❌ Batch costing (catering)

**Analytics & Reporting**
- ❌ Cost trend charts
- ❌ Profitability dashboard
- ❌ Most/least profitable dishes
- ❌ Ingredient price alerts
- ❌ Food cost % targets
- ❌ Export to CSV/PDF
- ❌ Print menu with costs

**Inventory Management**
- ❌ Stock levels
- ❌ Low stock alerts
- ❌ Purchase orders
- ❌ Waste tracking
- ❌ Inventory counts

**Integrations**
- ❌ POS system sync (Toast, Square, Clover)
- ❌ Accounting software (QuickBooks, Xero)
- ❌ Supplier price feeds
- ❌ Invoice scanning/OCR

**UI Enhancements**
- ❌ Drag-and-drop reordering
- ❌ Keyboard shortcuts
- ❌ Dark mode
- ❌ Custom themes
- ❌ Bulk actions (select multiple, delete all)
- ❌ Advanced search/filtering
- ❌ Column sorting
- ❌ Saved views/filters

**Price History UI**
- ❌ View price history in modal
- ❌ Price trend charts
- ❌ Compare historical costs
- ❌ Restore old price

**User Preferences**
- ❌ Default unit preferences
- ❌ Currency selection (USD only for MVP)
- ❌ Decimal precision settings
- ❌ Notification preferences

**Mobile Apps**
- ❌ Native iOS app
- ❌ Native Android app
- ❌ Offline mode
- ❌ Push notifications

**Other**
- ❌ Public menu sharing
- ❌ Customer-facing menus
- ❌ QR code generation
- ❌ Menu design/printing tools
- ❌ Multi-location support
- ❌ Franchise management

---

## 🎯 MVP Success Criteria

### Launch Requirements
- [ ] 2 test users can sign up and log in
- [ ] Each user can add 10+ ingredients
- [ ] Each user can create 5+ dishes
- [ ] Dish costs calculate correctly (verified against manual calculations)
- [ ] Unit conversions work for common cases (oz ↔ g, lb ↔ kg)
- [ ] Price history auto-saves when cost updated
- [ ] Archived ingredients show grayed in dishes
- [ ] Mobile responsive on phone and desktop
- [ ] No critical bugs
- [ ] Deployed to production (Vercel + Convex)

### Week 1 Goals
- 2 active users (co-founders)
- 20+ ingredients created total
- 10+ dishes created total
- At least 1 cost-saving insight identified per user
- Positive feedback on speed and simplicity
- Zero data loss or security issues

---

## 📋 Feature Priority for Post-MVP

### Phase 2 (Week 2-3)
1. **Price history UI** - View past prices in modal
2. **Multi-user restaurants** - Invite team members
3. **Search/filter** - Find ingredients and dishes quickly
4. **Bulk actions** - Delete multiple items at once

### Phase 3 (Month 2)
1. **AI unit conversions** - Gemini Flash for smart conversions
2. **Ingredient categories** - Organize by type
3. **Dish duplication** - Copy existing dishes
4. **Export to CSV** - Download data

### Phase 4 (Month 3)
1. **Analytics dashboard** - Cost trends and insights
2. **Profit optimization** - Suggest price adjustments
3. **Supplier tracking** - Link ingredients to suppliers
4. **Invoice import** - Auto-update prices from invoices

---

## 🚫 Scope Creep Prevention

### Decision Framework

When someone suggests a new feature, ask:

1. **Is it required for MVP launch?** (No → defer)
2. **Does it solve the core problem?** (Accurate dish costing)
3. **Can we launch without it?** (Yes → defer)
4. **Will it delay launch?** (Yes → defer)
5. **Is there a simpler version?** (Build that instead)

### How to Say No

**Good responses:**
- "Great idea! Let's add it to the Phase 2 backlog."
- "That's valuable, but not critical for MVP. Let's validate the core concept first."
- "We can do a simpler version now and enhance it later."
- "Let's see if users actually need this after launch."

**Red flags (scope creep):**
- "While we're at it, let's also..."
- "It would be cool if..."
- "This should be easy to add..."
- "Just one more small feature..."

---

## 🎨 Design Constraints

### Keep It Simple
- **One feature per screen** - Don't overcrowd
- **Minimal clicks** - 3 clicks max to complete any task
- **No fancy animations** - Fast > flashy
- **Standard patterns** - Tables, modals, forms (nothing custom)

### Mobile-First
- **Thumb-friendly** - Buttons min 44px
- **Readable text** - 16px minimum
- **Simple navigation** - Bottom tabs or top tabs only
- **No hover-only actions** - Everything tappable

### Performance
- **Fast load** - <2 seconds initial load
- **Instant updates** - Convex real-time sync
- **No pagination** - Handle 100+ items without lag
- **Optimistic UI** - Show changes immediately

---

## 📊 What We're Learning

### MVP Validation Questions

1. **Do restaurant managers actually use this?**
   - Daily active usage
   - Time spent in app
   - Features used most

2. **Does it save time vs. spreadsheets?**
   - Time to price a new dish
   - Ease of updating costs
   - Accuracy of calculations

3. **Do they find cost-saving insights?**
   - Dishes identified as unprofitable
   - Price adjustments made
   - Money saved

4. **What's missing that blocks adoption?**
   - Feature requests
   - Workarounds users create
   - Reasons for not using

5. **Is the UX intuitive?**
   - Support questions asked
   - User confusion points
   - Onboarding completion rate

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All MVP features implemented
- [ ] Manual testing completed
- [ ] 2 test users onboarded
- [ ] Real restaurant data tested
- [ ] Calculations verified accurate
- [ ] Mobile responsive confirmed
- [ ] Deployed to production
- [ ] Clerk auth working in prod
- [ ] Convex database seeded (conversions)
- [ ] Error handling tested

### Launch Day
- [ ] Send invite links to test users
- [ ] Monitor for errors (Convex logs)
- [ ] Be available for support
- [ ] Document any issues
- [ ] Gather initial feedback

### Week 1 Post-Launch
- [ ] Daily check-ins with users
- [ ] Fix critical bugs immediately
- [ ] Log feature requests (don't build yet)
- [ ] Measure success metrics
- [ ] Plan Phase 2 based on feedback

---

## 💡 Remember

**MVP = Minimum VIABLE Product**

- **Minimum:** Smallest feature set that solves the problem
- **Viable:** Actually usable and valuable to users
- **Product:** Complete enough to ship and learn from

**Goal:** Ship fast, learn fast, iterate fast.

**Not the goal:** Build the perfect app with every feature.

---

**When in doubt, cut it out. You can always add it later.**
