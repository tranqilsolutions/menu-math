# v0 Frontend Prompt - menu-math

**Copy-paste this into v0.dev to generate the UI**

---

You are building the frontend for **menu-math**, a restaurant dish costing app. Create a clean, minimal, mobile-first single-page application.

## Design Requirements

### Layout
- Single-page app with tab navigation
- Tabs: **Ingredients** | **Dishes** | **Account**
- Mobile-first responsive design (optimize for phone + desktop)
- Clean white background, light gray borders, blue primary buttons
- Typography: Inter or similar sans-serif

### Color Palette
- Background: `#FFFFFF`
- Borders: `#E5E7EB` (gray-200)
- Primary: `#3B82F6` (blue-500)
- Text: `#111827` (gray-900)
- Secondary text: `#6B7280` (gray-500)
- Success: `#10B981` (green-500)
- Danger: `#EF4444` (red-500)
- Archived/disabled: `#9CA3AF` (gray-400) with strikethrough

---

## Tab 1: Ingredients

### Empty State
```
┌─────────────────────────────────────┐
│                                     │
│         🥘 No Ingredients Yet       │
│                                     │
│   Add your first ingredient to     │
│   start calculating dish costs     │
│                                     │
│      [+ Add Ingredient]             │
│                                     │
└─────────────────────────────────────┘
```

### Table View (with data)

**Header:**
- Title: "Ingredients" (left)
- Button: "+ Add Ingredient" (right, blue)

**Table Columns:**
| Name | Unit | Cost per Unit | Actions |
|------|------|---------------|---------|
| Salmon | oz | $15.00 | Edit · Delete |
| Rice | g | $0.01 | Edit · Delete |
| Avocado | piece | $2.00 | Edit · Delete |

**Table Features:**
- Alternating row colors (white / gray-50)
- Hover effect on rows
- Actions are icon buttons or text links
- Mobile: Stack columns vertically, show most important info

### Add/Edit Ingredient Form (Modal)

```
┌─────────────────────────────────────┐
│  Add Ingredient               [×]   │
├─────────────────────────────────────┤
│                                     │
│  Ingredient Name                    │
│  [________________]                 │
│                                     │
│  Unit Type                          │
│  [Select ▼]                         │
│    - gram (g)                       │
│    - kilogram (kg)                  │
│    - ounce (oz)                     │
│    - pound (lb)                     │
│    - milliliter (ml)                │
│    - liter (l)                      │
│    - piece                          │
│    - slice                          │
│                                     │
│  Cost per Unit                      │
│  $ [________________]               │
│                                     │
│         [Cancel]  [Save]            │
│                                     │
└─────────────────────────────────────┘
```

### Delete Warning Modal

```
┌─────────────────────────────────────┐
│  ⚠️ Ingredient In Use               │
├─────────────────────────────────────┤
│                                     │
│  "Salmon" is used in 3 dishes:      │
│                                     │
│  • Salmon Nigiri                    │
│  • Salmon Roll                      │
│  • Salmon Poke Bowl                 │
│                                     │
│  Archive this ingredient? It will   │
│  appear grayed out in dishes but    │
│  costs will remain accurate.        │
│                                     │
│      [Cancel]  [Archive]            │
│                                     │
└─────────────────────────────────────┘
```

---

## Tab 2: Dishes

### Empty State
```
┌─────────────────────────────────────┐
│                                     │
│         🍱 No Dishes Yet            │
│                                     │
│   Create your first dish to see     │
│   accurate cost calculations        │
│                                     │
│      [+ Add Dish]                   │
│                                     │
└─────────────────────────────────────┘
```

### Table View (with data)

**Header:**
- Title: "Dishes" (left)
- Button: "+ Add Dish" (right, blue)

**Table Columns:**
| Dish Name | Status | Total Cost | Selling Price | Profit | Food Cost % | Actions |
|-----------|--------|------------|---------------|--------|-------------|---------|
| Salmon Bowl | 🟢 Live | $6.30 | $16.00 | $9.70 | 39.4% | View · Edit · Delete |
| Tuna Roll | 🟡 Potential | $4.50 | — | — | — | View · Edit · Delete |
| Veggie Plate | 🔵 Archive | $3.20 | $12.00 | $8.80 | 26.7% | View · Edit · Delete |

**Status Badges:**
- Live: Green dot + "Live"
- Potential: Yellow dot + "Potential"
- Archive: Gray dot + "Archive"

**Expandable Rows:**
Click row to expand and show ingredient breakdown:

```
▼ Salmon Bowl
  ├─ Salmon (4 oz) ................. $6.00
  ├─ Rice (200 g) .................. $0.20
  └─ Avocado (0.5 piece) ........... $0.10
  ────────────────────────────────────────
  Total Cost: $6.30
```

**Mobile:**
- Show only: Dish Name, Total Cost, Actions
- Tap to expand for full details

### Add/Edit Dish Form (Modal or Slide-over)

```
┌─────────────────────────────────────┐
│  Add Dish                     [×]   │
├─────────────────────────────────────┤
│                                     │
│  Dish Name *                        │
│  [________________]                 │
│                                     │
│  Description (optional)             │
│  [________________]                 │
│  [________________]                 │
│                                     │
│  Selling Price (optional)           │
│  $ [________________]               │
│                                     │
│  Status                             │
│  ⚪ Live  ⚪ Potential  ⚪ Archive   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Ingredients                        │
│                                     │
│  [+ Add Ingredient]                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Salmon                      │   │
│  │ Quantity: [4] Unit: [oz ▼] │   │
│  │ Cost: $6.00          [×]    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Rice                        │   │
│  │ Quantity: [200] Unit: [g ▼]│   │
│  │ Cost: $0.20          [×]    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Total Cost: $6.20                  │
│  Profit Margin: $9.80 (38.8%)       │
│                                     │
│         [Cancel]  [Save Dish]       │
│                                     │
└─────────────────────────────────────┘
```

**Add Ingredient to Dish Sub-Modal:**

```
┌─────────────────────────────────────┐
│  Add Ingredient to Dish             │
├─────────────────────────────────────┤
│                                     │
│  Select Ingredient                  │
│  [Search or select... ▼]           │
│    - Salmon ($15.00/oz)             │
│    - Rice ($0.01/g)                 │
│    - Avocado ($2.00/piece)          │
│                                     │
│  Quantity                           │
│  [________________]                 │
│                                     │
│  Unit                               │
│  [oz ▼]                             │
│                                     │
│  Calculated Cost: $6.00             │
│                                     │
│         [Cancel]  [Add]             │
│                                     │
└─────────────────────────────────────┘
```

---

## Tab 3: Account

### Simple Account View

```
┌─────────────────────────────────────┐
│  Account                            │
├─────────────────────────────────────┤
│                                     │
│  Restaurant Name                    │
│  My Restaurant                      │
│  [Edit]                             │
│                                     │
│  Email                              │
│  manager@restaurant.com             │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [Logout]                           │
│                                     │
└─────────────────────────────────────┘
```

---

## Authentication Screens

### Login

```
┌─────────────────────────────────────┐
│                                     │
│         🥘 menu-math                │
│                                     │
│    Calculate dish costs instantly   │
│                                     │
│  Email                              │
│  [________________]                 │
│                                     │
│  Password                           │
│  [________________]                 │
│                                     │
│  [Log In]                           │
│                                     │
│  Don't have an account? Sign up     │
│                                     │
└─────────────────────────────────────┘
```

### Sign Up

```
┌─────────────────────────────────────┐
│                                     │
│         🥘 menu-math                │
│                                     │
│    Get started for free             │
│                                     │
│  Email                              │
│  [________________]                 │
│                                     │
│  Password                           │
│  [________________]                 │
│                                     │
│  Restaurant Name (optional)         │
│  [________________]                 │
│                                     │
│  [Sign Up]                          │
│                                     │
│  Already have an account? Log in    │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Specifications

### Buttons
- **Primary:** Blue background, white text, rounded corners
- **Secondary:** White background, gray border, gray text
- **Danger:** Red background, white text (for delete actions)
- **Size:** Medium padding (px-4 py-2), large on mobile (px-6 py-3)

### Inputs
- Border: 1px solid gray-300
- Focus: Blue border, subtle shadow
- Padding: px-3 py-2
- Rounded corners: rounded-md

### Tables
- Header: Bold, gray-700 text, gray-100 background
- Rows: Alternating white/gray-50
- Hover: gray-100 background
- Mobile: Convert to cards or stack columns

### Modals
- Centered on screen
- Max width: 500px
- Backdrop: Semi-transparent black
- Close button: Top-right corner
- Padding: p-6

### Money Display
- Always show dollar sign: `$12.50`
- Two decimal places
- Align right in tables
- Green for profit, red for loss

### Status Badges
- Small rounded pill shape
- Colored dot + text
- Live: green, Potential: yellow, Archive: gray

---

## Responsive Breakpoints

### Mobile (<768px)
- Stack form fields vertically
- Full-width buttons
- Hide less important table columns
- Larger tap targets (min 44px)
- Simplified navigation

### Desktop (≥768px)
- Side-by-side form fields where appropriate
- Full table with all columns
- Hover states on interactive elements
- Keyboard shortcuts (future)

---

## Interactions & Animations

### Hover Effects
- Buttons: Slightly darker shade
- Table rows: Light gray background
- Links: Underline appears

### Loading States
- Skeleton screens for tables
- Spinner for form submissions
- Optimistic updates (show change immediately, revert if error)

### Transitions
- Smooth: 150ms ease-in-out
- Modal fade-in: 200ms
- Tab switching: Instant (no animation)

---

## Accessibility

- Semantic HTML (button, input, table, etc.)
- ARIA labels for icon buttons
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (blue outline)
- Color contrast: WCAG AA minimum
- Screen reader friendly (alt text, labels)

---

## Data Display Examples

### Money Formatting
- Input: 1250 cents → Display: "$12.50"
- Negative: -500 cents → Display: "-$5.00" (red)
- Zero: 0 cents → Display: "$0.00"

### Percentages
- Food Cost: 39.375% → Display: "39.4%"
- Always 1 decimal place
- Green if <30%, yellow if 30-40%, red if >40%

### Archived Ingredients in Dishes
- Name: ~~Salmon~~ (strikethrough)
- Color: Gray (#9CA3AF)
- Tooltip: "This ingredient has been archived"

---

## Technical Notes

### State Management
- Use React hooks (useState, useEffect)
- Convex React hooks for data (useQuery, useMutation)
- No Redux needed for MVP

### Form Validation
- Required fields: Show error if empty
- Money: Must be positive number
- Quantity: Must be positive number
- Unit: Must select from dropdown

### Error Messages
- Inline below field (red text)
- Toast notifications for global errors
- Clear, actionable messages

---

## Example Component Structure

```tsx
// App.tsx
<div className="min-h-screen bg-white">
  <Header />
  <Tabs active="ingredients" />
  
  {activeTab === 'ingredients' && (
    <IngredientsTab />
  )}
  
  {activeTab === 'dishes' && (
    <DishesTab />
  )}
  
  {activeTab === 'account' && (
    <AccountTab />
  )}
</div>

// IngredientsTab.tsx
{ingredients.length === 0 ? (
  <EmptyState
    icon="🥘"
    title="No Ingredients Yet"
    description="Add your first ingredient to start calculating dish costs"
    action={<Button onClick={openAddModal}>+ Add Ingredient</Button>}
  />
) : (
  <IngredientTable ingredients={ingredients} />
)}
```

---

## Final Checklist

- [ ] Mobile-first responsive design
- [ ] Clean, minimal aesthetic (white bg, gray borders, blue buttons)
- [ ] Empty states for new users
- [ ] Inline editing or modal forms
- [ ] Delete warnings for ingredients in use
- [ ] Expandable dish rows for cost breakdown
- [ ] Money always formatted as $X.XX
- [ ] Status badges with colors
- [ ] Archived ingredients shown grayed/strikethrough
- [ ] Accessible (keyboard nav, ARIA labels)
- [ ] Fast, no unnecessary animations

---

**Generate this UI with Tailwind CSS and React. Keep it simple, clean, and functional. Prioritize speed and clarity over fancy features.**
