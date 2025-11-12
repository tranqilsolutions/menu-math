# Setup Guide - menu-math

**Quick start guide for developers**

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Clerk account (free tier)
- Convex account (free tier)

---

## 1. Initial Setup

### Clone Repository

```bash
git clone https://github.com/your-username/menu-math.git
cd menu-math
```

### Install Dependencies

```bash
npm install
```

---

## 2. Convex Setup

### Create Convex Project

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex in project
npx convex dev
```

This will:
- Create a new Convex project
- Generate `convex.json` config file
- Open browser to link your Convex account
- Start local dev server

### Create Schema

Create `convex/schema.ts` with the database schema from `TECHNICAL_SPEC.md`.

### Seed Unit Conversions

```bash
# Run the seed function once
npx convex run conversions:seed
```

---

## 3. Clerk Setup

### Create Clerk Application

1. Go to [clerk.com](https://clerk.com)
2. Sign up / Log in
3. Create new application: "menu-math"
4. Choose authentication methods: Email/Password
5. Copy your publishable key

### Add Clerk to Convex

In Convex dashboard:
1. Go to Settings → Authentication
2. Add Clerk as provider
3. Paste your Clerk Issuer URL (from Clerk dashboard)

### Environment Variables

Create `.env.local`:

```env
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Get these values from:
- Convex URL: Convex dashboard → Settings
- Clerk key: Clerk dashboard → API Keys

---

## 4. Frontend Setup

### Install React Dependencies

```bash
npm install react react-dom
npm install -D @vitejs/plugin-react
npm install tailwindcss postcss autoprefixer
npm install convex
npm install @clerk/clerk-react
```

### Configure Tailwind

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 5. Development Workflow

### Start Dev Servers

**Terminal 1 - Convex:**
```bash
npx convex dev
```

**Terminal 2 - React:**
```bash
npm run dev
```

### Access App

- Frontend: http://localhost:5173
- Convex Dashboard: https://dashboard.convex.dev

---

## 6. Project Structure

```
menu-math/
├── convex/                    # Backend functions
│   ├── schema.ts             # Database schema
│   ├── auth.ts               # Auth helpers
│   ├── ingredients.ts        # Ingredient CRUD
│   ├── dishes.ts             # Dish CRUD + calculations
│   ├── dishIngredients.ts    # Dish-ingredient linking
│   ├── conversions.ts        # Unit conversions
│   └── _utils.ts             # Shared utilities
│
├── src/                      # Frontend
│   ├── components/           # React components
│   │   ├── auth/
│   │   ├── ingredients/
│   │   ├── dishes/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── App.tsx               # Main app
│
├── public/                   # Static assets
├── PRD.md                    # Product requirements
├── TECHNICAL_SPEC.md         # Technical documentation
├── V0_PROMPT.md              # Frontend design prompt
├── SETUP_GUIDE.md            # This file
└── package.json
```

---

## 7. Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up new user
- [ ] Log in existing user
- [ ] Log out
- [ ] Protected routes redirect to login

**Ingredients:**
- [ ] Add ingredient
- [ ] Edit ingredient name/unit
- [ ] Update ingredient cost (check price history created)
- [ ] Delete unused ingredient
- [ ] Try to delete ingredient in use (see warning)
- [ ] Archive ingredient (appears grayed in dishes)

**Dishes:**
- [ ] Create dish with 3+ ingredients
- [ ] Add selling price, see profit margin calculated
- [ ] Edit dish name/description
- [ ] Update ingredient quantity, see cost recalculate
- [ ] Remove ingredient from dish
- [ ] Delete dish
- [ ] Change dish status (Live/Potential/Archive)

**Unit Conversions:**
- [ ] Add ingredient in oz, use in dish as grams
- [ ] Verify cost calculated correctly with conversion
- [ ] Try incompatible units (should show error)

**Mobile:**
- [ ] Test on phone browser
- [ ] All buttons tappable (min 44px)
- [ ] Tables readable or converted to cards
- [ ] Forms usable on small screen

---

## 8. Deployment

### Deploy Convex

```bash
# Deploy backend to production
npx convex deploy --prod

# Note the production URL
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Set Environment Variables in Vercel:**
- `VITE_CONVEX_URL` → Production Convex URL
- `VITE_CLERK_PUBLISHABLE_KEY` → Production Clerk key

### Update Clerk Settings

In Clerk dashboard:
1. Add production domain to allowed origins
2. Update redirect URLs

---

## 9. Common Issues

### "Unauthorized" errors
- Check Clerk is properly configured in Convex
- Verify environment variables are set
- Clear browser cookies and re-login

### Conversions not working
- Run seed command: `npx convex run conversions:seed`
- Check unit_conversions table has data

### Dish cost not updating
- Check ingredient has valid currentCostPerUnitCents
- Verify conversion exists for units used
- Check browser console for errors

### Convex dev server won't start
- Delete `.convex` folder and restart
- Check port 3000 isn't already in use
- Update Convex CLI: `npm install -g convex@latest`

---

## 10. Development Tips

### Hot Reload
- Convex functions auto-reload on save
- React components hot-reload via Vite
- No need to restart servers during development

### Debugging
- Convex logs appear in terminal running `npx convex dev`
- React errors in browser console
- Use Convex dashboard to inspect database

### Data Reset
```bash
# Clear all data (careful!)
npx convex run --prod clearAllData
```

### Useful Commands
```bash
# View Convex logs
npx convex logs

# Run a specific function
npx convex run functionName --arg '{"key": "value"}'

# Export data
npx convex export

# Import data
npx convex import data.zip
```

---

## 11. Next Steps After Setup

1. **Test with real data:** Add 10+ ingredients from actual restaurant
2. **Create sample dishes:** Build 5 dishes with realistic recipes
3. **Verify calculations:** Compare with manual spreadsheet calculations
4. **Get feedback:** Have co-founder test the app
5. **Iterate:** Fix bugs and improve UX based on feedback

---

## 12. Support

### Documentation
- Convex: https://docs.convex.dev
- Clerk: https://clerk.com/docs
- Tailwind: https://tailwindcss.com/docs

### Troubleshooting
- Check `TECHNICAL_SPEC.md` for architecture details
- Review `PRD.md` for feature requirements
- Search Convex Discord for common issues

---

**Ready to build? Start with step 1 and work through sequentially. Each step should take 5-15 minutes.**
