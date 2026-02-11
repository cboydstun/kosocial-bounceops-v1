# FINAL PLAN: KoSocial-BounceOps-v1 White-Label Shell

## Executive Summary

Create a minimal Next.js marketing site for KO Social Media that embeds a signup form. The form posts directly to the BounceOps platform API with automatic `source=kosocial` tracking. Users stay on the partner domain throughout the entire signup process for a seamless white-label experience.

---

## Architecture Overview

### User Flow

```
korentalsoftware.com (homepage)
    ↓ Click "Sign Up"
korentalsoftware.com/signup (embedded form)
    ↓ Submit form (AJAX POST to slowbill.xyz API)
{tenant}.slowbill.xyz/onboarding (redirect after success)
    ↓ Complete onboarding
{tenant}.slowbill.xyz/admin (dashboard)
```

### Key Design Decisions

1. **Embedded Form (Not Redirect)** - User never leaves partner domain during signup
2. **Direct API Integration** - Form POSTs to BounceOps `/api/v1/auth/signup` with CORS
3. **Automatic Source Tracking** - Every signup includes `signupSource: 'kosocial'`
4. **Minimal Styling** - Basic CSS for white-label customization by partner
5. **No Authentication** - All user management handled by BounceOps platform

---

## Repository Structure

```
kosocial-bounceops-v1/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (minimal)
│   │   ├── page.tsx                # Homepage with CTA
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page with embedded form
│   │   └── globals.css             # Minimal CSS
│   ├── components/
│   │   └── SignupForm.tsx          # Client-side form (POSTs to platform)
│   └── lib/
│       └── config.ts               # Platform URL configuration
├── __tests__/
│   ├── unit/
│   │   └── config.test.ts          # Config tests
│   └── integration/
│       └── signup-form.test.tsx    # Form submission tests
├── public/
│   └── .gitkeep                    # Partner adds their logo
├── package.json                     # Minimal dependencies (Next.js, React, Jest)
├── tsconfig.json
├── jest.config.ts
├── next.config.ts
├── ecosystem.config.cjs             # PM2 config (port 8081)
├── deploy-kosocial.sh               # Deployment script
├── .env.example
├── .env.production
└── README.md                        # Partner customization guide
```

**Total Files: ~15**  
**Total Code: ~400 lines**

---

## Implementation Phases

### Phase 1: BounceOps Platform Changes (Main Repo)

**Goal:** Enable CORS for partner domain

**Tasks:**

1. Update `src/app/api/v1/auth/signup/route.ts` with CORS headers
2. Add OPTIONS handler for preflight requests
3. Whitelist partner domains: `kosocial.slowbill.xyz`, `korentalsoftware.com`
4. Test CORS with curl/Postman
5. Deploy updated platform

**Time Estimate:** 20 minutes  
**Testing:** Unit tests for CORS headers

---

### Phase 2: Repository Setup

**Goal:** Create new repo with Next.js + TypeScript + Jest

**Tasks:**

1. Create GitHub repo: `gh repo create kosocial-bounceops-v1 --public`
2. Initialize Next.js: `npx create-next-app@latest --typescript --app`
3. Remove unnecessary dependencies (Tailwind, etc.)
4. Configure Jest with React Testing Library
5. Set up `.env.example` with platform URL
6. Create initial README for partners

**Time Estimate:** 15 minutes  
**Testing:** Jest config verified

---

### Phase 3: Core Configuration (TDD)

**Goal:** Platform URL configuration with tests

**Tasks:**

1. Write tests for platform URL generation
2. Implement `lib/config.ts` with `PLATFORM_URL` and `getSignupUrl()`
3. Write tests for source tracking parameter
4. Run tests → All pass

**Time Estimate:** 15 minutes  
**Testing:** 100% coverage of config logic

---

### Phase 4: Signup Form Component (TDD)

**Goal:** Client-side form that POSTs to BounceOps API

**Tasks:**

1. Write tests for form rendering
2. Write tests for API submission with `signupSource: 'kosocial'`
3. Write tests for success redirect to tenant subdomain
4. Write tests for error handling
5. Implement `SignupForm.tsx` component
6. Run tests → All pass

**Time Estimate:** 30 minutes  
**Testing:** Full form submission flow covered

---

### Phase 5: Pages & Layout

**Goal:** Minimal marketing pages

**Tasks:**

1. Create `layout.tsx` with basic HTML structure
2. Create homepage `page.tsx` with features list and CTA
3. Create `signup/page.tsx` with embedded SignupForm
4. Add minimal `globals.css` (white-label ready)
5. Test locally with `npm run dev`

**Time Estimate:** 20 minutes  
**Testing:** Visual verification in browser

---

### Phase 6: VPS Deployment

**Goal:** Deploy to existing VPS

**Tasks:**

1. SSH to VPS: `ssh bounceops`
2. Create directory: `mkdir -p /var/www/kosocial/logs`
3. Create `ecosystem.config.cjs` for PM2 (port 8081)
4. Create `deploy-kosocial.sh` script
5. Configure Nginx reverse proxy for port 8081
6. Run deployment: `./deploy-kosocial.sh`
7. Verify site accessible at `https://kosocial.slowbill.xyz`

**Time Estimate:** 25 minutes  
**Testing:** Site loads, form submits successfully

---

### Phase 7: Custom Domain Setup

**Goal:** Configure korentalsoftware.com

**Tasks:**

1. Update DNS records:
   - A record: korentalsoftware.com → VPS IP
   - CNAME: www.korentalsoftware.com → korentalsoftware.com
2. Generate SSL certificate with Let's Encrypt
3. Update Nginx config to include custom domain
4. Reload Nginx
5. Test HTTPS on both domains

**Time Estimate:** 15 minutes  
**Testing:** Both domains load with valid SSL

---

### Phase 8: End-to-End Testing

**Goal:** Verify complete signup flow

**Tasks:**

1. Test signup from `korentalsoftware.com/signup`
2. Verify form stays on partner domain during submission
3. Confirm signup creates tenant with `signupSource: 'kosocial'`
4. Verify redirect to tenant subdomain after success
5. Check tenant can access dashboard
6. Query database to confirm source tracking

**Time Estimate:** 15 minutes  
**Testing:** Manual E2E test + database verification

---

### Phase 9: Documentation

**Goal:** Partner customization guide

**Tasks:**

1. Write README with setup instructions
2. Document how to customize branding (logo, colors, copy)
3. Document environment variables
4. Create troubleshooting guide
5. Add architecture diagram
6. Document deployment process

**Time Estimate:** 20 minutes  
**Deliverable:** Complete partner documentation

---

## Testing Strategy

### Test Coverage Goals

- **Config Logic:** 100% coverage
- **Signup Form:** All user interactions and API calls
- **Error Handling:** All failure scenarios
- **CORS:** Preflight and actual requests
- **E2E:** Complete signup flow manual test

### Test Types

1. **Unit Tests:** Configuration, utilities
2. **Component Tests:** SignupForm rendering and submission
3. **Integration Tests:** Form → API → Database
4. **E2E Tests:** Manual verification of full flow

### Running Tests

```bash
npm test              # All tests
npm run test:watch    # TDD mode
npm run test:coverage # Coverage report
```

---

## Deployment Configuration

### PM2 Setup

- App name: `kosocial-site`
- Port: `8081` (different from main BounceOps on 8080)
- Process manager: PM2
- Auto-restart: Yes
- Logs: `/var/www/kosocial/logs/`

### Nginx Configuration

- Server names: `kosocial.slowbill.xyz`, `korentalsoftware.com`
- Proxy to: `localhost:8081`
- SSL: Let's Encrypt certificates
- HTTP → HTTPS redirect: Yes

### Environment Variables

```
NEXT_PUBLIC_PLATFORM_URL=https://slowbill.xyz
NODE_ENV=production
PORT=8081
```

---

## Key Features

### What It Does ✅

- Displays KO Rental Software marketing content
- Embeds signup form on partner domain
- POSTs to BounceOps API with automatic source tracking
- Redirects to tenant subdomain after successful signup
- Fully white-labeled during signup process

### What It Doesn't Do ❌

- Authentication (handled by BounceOps)
- User management (handled by BounceOps)
- Payment processing (handled by BounceOps)
- Database operations (handled by BounceOps)
- Complex features or styling (kept minimal for partner customization)

---

## Partner Customization

### Easy to Change

1. **Logo:** Replace `/public/logo.png`
2. **Colors:** Update CSS variables in `globals.css`
3. **Copy:** Edit text in `page.tsx` and `signup/page.tsx`
4. **Styles:** Override any CSS in `globals.css`

### What to Keep

1. **SignupForm component** - Core functionality
2. **Config.ts** - Platform integration
3. **Source tracking** - `signupSource: 'kosocial'`
4. **API endpoint** - `slowbill.xyz/api/v1/auth/signup`

---

## Success Metrics

### Technical Metrics

- Form submission success rate: >95%
- CORS errors: 0
- Page load time: <2s
- Source tracking accuracy: 100%

### User Experience Metrics

- No visible domain changes during signup ✅
- Professional white-label appearance ✅
- Clear error messages ✅
- Mobile responsive ✅

---

## Timeline Summary

| Phase            | Duration | Cumulative |
| ---------------- | -------- | ---------- |
| 1. Platform CORS | 20 min   | 20 min     |
| 2. Repo Setup    | 15 min   | 35 min     |
| 3. Config (TDD)  | 15 min   | 50 min     |
| 4. Form (TDD)    | 30 min   | 80 min     |
| 5. Pages         | 20 min   | 100 min    |
| 6. VPS Deploy    | 25 min   | 125 min    |
| 7. Custom Domain | 15 min   | 140 min    |
| 8. E2E Testing   | 15 min   | 155 min    |
| 9. Documentation | 20 min   | 175 min    |

**Total Time: ~3 hours** (with TDD approach)

---

## Dependencies

### Minimal Package.json

- `next` (^15.5.11)
- `react` (^19.0.0)
- `react-dom` (^19.0.0)
- `typescript` (^5)
- `jest` (^29.7.0)
- `@testing-library/react` (^16.1.0)
- `@testing-library/jest-dom` (^6.6.3)

**Total: 7 dependencies** (vs 50+ in main BounceOps)

---

## Risk Mitigation

### Potential Issues & Solutions

**CORS Errors:**

- Solution: Test CORS thoroughly in Phase 1
- Fallback: Add more allowed origins if needed

**Form Validation:**

- Solution: Reuse BounceOps validation logic
- Fallback: Display API error messages to user

**SSL Certificate:**

- Solution: Use Let's Encrypt with auto-renewal
- Fallback: Manual cert generation if automation fails

**PM2 Port Conflict:**

- Solution: Use unique port 8081
- Fallback: Change port in ecosystem.config.cjs

---

## Deliverables

1. **GitHub Repository:** `kosocial-bounceops-v1` with full source code
2. **Deployed Site:** `https://kosocial.slowbill.xyz` (live and functional)
3. **Custom Domain:** `https://korentalsoftware.com` (configured and redirecting)
4. **Test Suite:** Jest tests with high coverage
5. **Documentation:** Complete README and customization guide
6. **Deploy Script:** One-command deployment to VPS
7. **PM2 Config:** Process management setup
