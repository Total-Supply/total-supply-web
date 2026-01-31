Performance Optimization Walkthrough
Changes Made
1. Global Swagger CSS Removal
Files: 
layout.tsx
, 
SwaggerUIWrapper.tsx

Moved swagger-ui-react/swagger-ui.css (~200KB) from root layout to SwaggerUIWrapper. CSS now loads only when visiting /swagger page.

2. Tree-Shaking Optimizations
File: 
next.config.ts

Added to optimizePackageImports:

lucide-react - Icon library
react-icons - Icon library
date-fns - Date utilities
@radix-ui/react-dropdown-menu
@radix-ui/react-dialog
3. Header Dynamic Imports
File: 
header.tsx

Converted to lazy loading:

CartDrawerEnhanced - Loads when cart clicked
MobileNavContent - Loads when mobile menu clicked
4. Landing Page Code Splitting
File: 
landing-page.tsx

Below-the-fold sections now lazy loaded:

LandingFeaturedProducts
LandingTestimonials
LandingCTAEnhanced
Test Results
Check	Status
Production build	✅ Passed
Static page generation	✅ 100/100 pages
Expected Impact
~200KB CSS no longer loaded on every page
Reduced initial JS bundle via tree-shaking
Better Time to Interactive from lazy-loaded drawers
Improved LCP from code-split landing sections