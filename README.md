# KoSocial BounceOps White-Label Site

A minimal Next.js marketing site that embeds a signup form for the BounceOps platform with automatic source tracking.

## Architecture

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Minimal CSS with CSS variables for easy customization
- **Testing**: Jest + React Testing Library
- **Deployment**: PM2 on VPS (port 8081)

## Features

✅ Embedded signup form (user stays on partner domain)
✅ Direct API integration with BounceOps platform
✅ Automatic source tracking (`signupSource: 'kosocial'`)
✅ White-label ready with CSS variables
✅ Mobile responsive
✅ Test coverage for core functionality

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Production Deployment

```bash
# Deploy to VPS
./deploy-kosocial.sh
```

## Customization Guide

### 1. Branding & Colors

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --primary-color: #2563eb;      /* Main brand color */
  --primary-hover: #1d4ed8;      /* Hover state */
  --text-color: #1f2937;         /* Body text */
  --bg-color: #ffffff;           /* Background */
  --border-color: #e5e7eb;       /* Borders */
  --error-color: #dc2626;        /* Error messages */
}
```

### 2. Logo

Add your logo to `/public/logo.png` and reference it in your pages.

### 3. Copy & Content

Edit the following files:
- `app/page.tsx` - Homepage content
- `app/signup/page.tsx` - Signup page content
- `app/layout.tsx` - Site title and description

### 4. Domain Configuration

Update `.env.production`:

```env
NEXT_PUBLIC_PLATFORM_URL=https://slowbill.xyz
NODE_ENV=production
PORT=8081
```

## File Structure

```
kosocial-bounceops-v1/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── signup/
│   │   └── page.tsx            # Signup page
│   └── globals.css             # Styles
├── components/
│   └── SignupForm.tsx          # Signup form component
├── lib/
│   └── config.ts               # Platform configuration
├── __tests__/
│   ├── unit/
│   │   └── config.test.ts      # Config tests
│   └── integration/
│       └── signup-form.test.tsx # Form tests
├── public/
│   └── .gitkeep                # Add your logo here
├── ecosystem.config.cjs         # PM2 configuration
├── deploy-kosocial.sh           # Deployment script
├── .env.example                 # Environment template
├── .env.production              # Production env
└── README.md                    # This file
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Platform Integration

### Signup Flow

1. User fills form on partner domain
2. Form POSTs to BounceOps API with `signupSource: 'kosocial'`
3. On success, redirect to `{tenant}.slowbill.xyz/onboarding`
4. User completes onboarding on platform

### CORS Requirements

The BounceOps platform must allow CORS from partner domains.

## Support

For issues:
1. Check logs: `pm2 logs kosocial-site`
2. Verify build: `npm run build`
3. Test locally: `npm run dev`

## License

Proprietary - KO Social Media
