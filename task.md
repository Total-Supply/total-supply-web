Performance Optimization - Total Blocking Time (TBT) Reduction
Goal
Reduce Total Blocking Time from 3.2s to under 500ms by optimizing JavaScript bundles, CSS loading, and implementing lazy loading.

Tasks
Phase 1: Critical Fixes
 Remove global swagger-ui-react CSS import from root layout
 Move swagger CSS to SwaggerUIWrapper component
 Add lucide-react to optimizePackageImports in next.config.ts
 Add react-icons to optimizePackageImports
Phase 2: Dynamic Imports for Heavy Components
 Lazy load CartDrawerEnhanced in header
 Lazy load MobileNavContent in header
 Lazy load landing page sections (LandingTestimonials, LandingFeaturedProducts)
Phase 3: Next.js Config Optimizations
 Enable modularizeImports for date-fns
 Configure bundle analyzer (optional, for verification)
Phase 4: Verification
 Run production build to check bundle sizes
 Test landing page load time
 Verify swagger page still works