Performance Optimization: Reduce Total Blocking Time (3.2s → <500ms)
The application has excessive Total Blocking Time (TBT) of 3.2 seconds caused by:

Large JavaScript bundles blocking main thread
Global CSS imports for rarely-used features
Synchronous loading of heavy components
Missing tree-shaking optimizations
Proposed Changes
Root Layout - Remove Global Swagger CSS
[MODIFY] 
layout.tsx
Remove the global import of swagger-ui-react/swagger-ui.css (line 8). This CSS is ~200KB and only needed on the /swagger page.

-import 'swagger-ui-react/swagger-ui.css'
Swagger Component - Localize CSS Import
[MODIFY] 
SwaggerUIWrapper.tsx
Add the swagger-ui CSS import here where it's actually used:

+'use client'
+
+import '@/src/styles/swagger-dark.css'
+import 'swagger-ui-react/swagger-ui.css'
+import dynamic from 'next/dynamic'
Next.js Config - Add Tree-Shaking Optimizations
[MODIFY] 
next.config.ts
Add more packages to optimizePackageImports for better tree-shaking:

experimental: {
  optimizePackageImports: [
    '@chakra-ui/react',
    'framer-motion',
    'lucide-react',      // Icon library - tree-shake unused icons
    'react-icons',       // Icon library - tree-shake unused icons
    'date-fns',          // Date library - tree-shake unused functions
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-dialog',
  ],
},
Header Component - Lazy Load Drawers
[MODIFY] 
header.tsx
Convert CartDrawerEnhanced and MobileNavContent to dynamic imports. These components are not needed on initial render (only when user interacts):

-import { CartDrawerEnhanced } from '../cart/cart-drawer'
-import { MobileNavContent } from '../mobile-nav'
+import dynamic from 'next/dynamic'
+
+const CartDrawerEnhanced = dynamic(
+  () => import('../cart/cart-drawer').then((mod) => mod.CartDrawerEnhanced),
+  { ssr: false }
+)
+
+const MobileNavContent = dynamic(
+  () => import('../mobile-nav').then((mod) => mod.MobileNavContent),
+  { ssr: false }
+)
Landing Page - Lazy Load Below-the-Fold Sections
[MODIFY] 
landing-page.tsx
Lazy load components that are below the fold (not visible on initial load):

+'use client'
+
+import dynamic from 'next/dynamic'
+import { useEffect, useState } from 'react'
+
+import { LandingHero } from './landing-hero'
+import { LandingStats } from './landing-stats'
+import { LandingFeatures } from './landing-features'
+import { LandingServices } from './landing-services'
+
+// Lazy load below-the-fold sections
+const LandingFeaturedProducts = dynamic(
+  () => import('./landing-featured-products').then((mod) => mod.LandingFeaturedProducts),
+  { ssr: true }
+)
+const LandingTestimonials = dynamic(
+  () => import('./landing-testimonials').then((mod) => mod.LandingTestimonials),
+  { ssr: true }
+)
+const LandingCTAEnhanced = dynamic(
+  () => import('./landing-cta').then((mod) => mod.LandingCTAEnhanced),
+  { ssr: true }
+)
Verification Plan
Automated Tests
Production Build Check
cd c:\Total-Supply\total-supply
npm run build
Verify build completes without errors
Check .next/analyze output for reduced bundle sizes (if analyzer enabled)
Manual Verification
Landing Page Load Test

Run npm run dev
Open browser to http://localhost:3000
Open DevTools → Performance tab
Run Lighthouse audit and verify TBT reduction
Swagger Page Test

Navigate to /swagger
Verify Swagger UI renders correctly with dark theme
CSS should still be applied
Header Functionality Test

Click cart icon → CartDrawer should open
Click mobile menu → MobileNav should open (on mobile viewport)