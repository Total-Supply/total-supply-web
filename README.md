# Total Supply - Complete Supply Chain Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Total Supply - Complete Supply Chain Management System

### Quick Start

#### 1. Database Setup

```bash
# Using Docker (recommended)
docker-compose up -d

# Or use Neon.tech (your current setup)
# DATABASE_URL is already configured in .env
```

#### 2. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

#### 3. Create Admin Account

The **first user** to register will automatically become an admin with ACTIVE status.

1. Start the dev server: `npm run dev`
2. Go to: http://localhost:3000/signup
3. Register with your admin credentials
4. You can now log in immediately!

#### 4. Approve New Users

Once you're logged in as admin, you can approve pending users:

**Option 1: Using Prisma Studio**

```bash
npx prisma studio
# Open User table
# Change status from PENDING_APPROVAL to ACTIVE
```

**Option 2: Using API** (Coming soon)

```bash
# Approve user by ID
POST /api/admin/users/approve/{userId}
```

**Option 3: Using Admin Dashboard** (Coming soon)

```
/admin/users
```

## Current User Flow

1. **New User Registers** → Status: PENDING_APPROVAL
2. **Admin Approves** → Status: ACTIVE
3. **User Can Login** ✅

### Test the System

1. **Register as first user (becomes admin)**:

   ```
   Email: admin@example.com
   Password: Admin123!
   Name: Admin User
   ```

2. **Login with admin credentials** ✅

3. **Register a second user**:

   ```
   Email: user@example.com
   Password: User123!
   Name: Test User
   ```

4. **Try to login as second user** → Should show "Account Pending Approval"

5. **Approve second user** via Prisma Studio

6. **Login as second user** ✅

## Environment Variables

```bash
DATABASE_URL="your-neon-db-url"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

## API Endpoints

### Public

- `POST /api/auth/register` - Register new user
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/session` - Get session

### Admin Only

- `GET /api/admin/users` - List all users
- `GET /api/admin/users?status=PENDING_APPROVAL` - List pending users
- `POST /api/admin/users/approve/{id}` - Approve user

## Next Steps

- [ ] Build admin dashboard
- [ ] Add email notifications for approval
- [ ] Add bulk user approval
- [ ] Add user rejection endpoint

```
total-supply
├─ .eslintrc.json
├─ .prettierrc.cjs
├─ components
│  └─ ui
│     └─ sidebar.tsx
├─ components.json
├─ docs
│  ├─ 0.Complete-Package-Summary.md
│  ├─ 1.Architecture-Decision-Analysis.md
│  ├─ 1.TSD-PostgreSQL-GCS-Final.md
│  ├─ 2.Feature-List-User-Stories.md
│  ├─ 3.Implementation-Guide-LKR.md
│  ├─ 4.Stack-Decision-Summary.md
│  ├─ 5.Implementation-Checklist.md
│  ├─ 6.Executive-Summary.md
│  ├─ architecture_comparison.png
│  ├─ cost_comparison.png
│  └─ gantt_timeline.png
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ posts
│  └─ post-01.mdx
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ static
│  │  ├─ favicons
│  │  │  ├─ android-icon-144x144.png
│  │  │  ├─ android-icon-192x192.png
│  │  │  ├─ android-icon-36x36.png
│  │  │  ├─ android-icon-48x48.png
│  │  │  ├─ android-icon-72x72.png
│  │  │  ├─ android-icon-96x96.png
│  │  │  ├─ apple-icon-114x114.png
│  │  │  ├─ apple-icon-120x120.png
│  │  │  ├─ apple-icon-144x144.png
│  │  │  ├─ apple-icon-152x152.png
│  │  │  ├─ apple-icon-180x180.png
│  │  │  ├─ apple-icon-57x57.png
│  │  │  ├─ apple-icon-60x60.png
│  │  │  ├─ apple-icon-72x72.png
│  │  │  ├─ apple-icon-76x76.png
│  │  │  ├─ apple-icon-precomposed.png
│  │  │  ├─ apple-icon.png
│  │  │  ├─ browserconfig.xml
│  │  │  ├─ favicon-16x16.png
│  │  │  ├─ favicon-32x32.png
│  │  │  ├─ favicon-96x96.png
│  │  │  ├─ favicon.ico
│  │  │  ├─ manifest.json
│  │  │  ├─ ms-icon-144x144.png
│  │  │  ├─ ms-icon-150x150.png
│  │  │  ├─ ms-icon-310x310.png
│  │  │  └─ ms-icon-70x70.png
│  │  ├─ images
│  │  │  ├─ avatar.jpg
│  │  │  ├─ avatar2.jpg
│  │  │  ├─ avatar3.jpg
│  │  │  └─ eelco.jpg
│  │  └─ screenshots
│  │     ├─ billing.png
│  │     ├─ dashboard.png
│  │     ├─ landingspage.png
│  │     └─ list.png
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ signup
│  │  │     └─ page.tsx
│  │  ├─ (landing)
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ page.tsx
│  │  │  └─ shop
│  │  │     └─ page.tsx
│  │  ├─ (schadcn)
│  │  │  └─ component
│  │  │     ├─ login
│  │  │     │  └─ page.tsx
│  │  │     └─ signup
│  │  │        └─ page.tsx
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ provider.tsx
│  ├─ components
│  │  ├─ announcement-banner
│  │  │  ├─ announcement-banner.tsx
│  │  │  └─ index.ts
│  │  ├─ auth
│  │  │  ├─ login-form.tsx
│  │  │  └─ signup-form.tsx
│  │  ├─ button-link
│  │  │  ├─ button-link.tsx
│  │  │  └─ index.ts
│  │  ├─ faq
│  │  │  ├─ faq.tsx
│  │  │  └─ index.ts
│  │  ├─ features
│  │  │  ├─ features.tsx
│  │  │  └─ index.ts
│  │  ├─ gradients
│  │  │  └─ background-gradient.tsx
│  │  ├─ hero
│  │  │  ├─ hero.tsx
│  │  │  └─ index.ts
│  │  ├─ highlights
│  │  │  ├─ highlights.tsx
│  │  │  └─ index.ts
│  │  ├─ layout
│  │  │  ├─ footer.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ logo.tsx
│  │  │  ├─ marketing-layout.tsx
│  │  │  ├─ navigation.tsx
│  │  │  └─ theme-toggle.tsx
│  │  ├─ logos
│  │  │  ├─ chakra.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ next.tsx
│  │  │  └─ react.tsx
│  │  ├─ mobile-nav
│  │  │  ├─ index.ts
│  │  │  └─ mobile-nav.tsx
│  │  ├─ motion
│  │  │  ├─ box.tsx
│  │  │  ├─ fall-in-place.tsx
│  │  │  ├─ float.tsx
│  │  │  └─ page-transition.tsx
│  │  ├─ nav
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ nav-main.tsx
│  │  │  ├─ nav-projects.tsx
│  │  │  ├─ nav-secondary.tsx
│  │  │  └─ nav-user.tsx
│  │  ├─ nav-link
│  │  │  ├─ index.ts
│  │  │  └─ nav-link.tsx
│  │  ├─ pricing
│  │  │  └─ pricing.tsx
│  │  ├─ section
│  │  │  ├─ index.ts
│  │  │  ├─ section-title.tsx
│  │  │  └─ section.tsx
│  │  ├─ seo
│  │  │  ├─ index.ts
│  │  │  └─ seo.tsx
│  │  ├─ testimonials
│  │  │  ├─ index.ts
│  │  │  ├─ testimonial.tsx
│  │  │  └─ testimonials.tsx
│  │  ├─ typography
│  │  │  └─ index.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button-group.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ field.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     └─ tooltip.tsx
│  ├─ data
│  │  ├─ appulse.tsx
│  │  ├─ config.tsx
│  │  ├─ faq.tsx
│  │  ├─ logo.tsx
│  │  ├─ pricing.tsx
│  │  └─ testimonials.tsx
│  ├─ hooks
│  │  ├─ use-mobile.ts
│  │  ├─ use-route-changed.ts
│  │  └─ use-scrollspy.ts
│  ├─ lib
│  │  └─ utils.ts
│  └─ theme
│     ├─ components
│     │  ├─ button.ts
│     │  ├─ cta.ts
│     │  ├─ features.ts
│     │  ├─ index.ts
│     │  ├─ section-title.ts
│     │  └─ section.ts
│     ├─ foundations
│     │  └─ typography.ts
│     └─ index.ts
└─ tsconfig.json
```
