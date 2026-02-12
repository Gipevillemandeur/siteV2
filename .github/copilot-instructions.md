<!-- Use this file to provide workspace-specific custom instructions to Copilot -->

## GIPE Villemandeur Website - Development Guide

### Project Overview
- **Framework:** Next.js 15 (React)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** GitHub Pages
- **CMS:** Local JSON/TypeScript data files
- **Status:** ✅ Production-ready

### Architecture
```
site2gipe/
├── app/                  # Next.js app router pages
├── components/           # Reusable React components
├── data/                 # Content management (JSON/TS files)
├── lib/                  # TypeScript types and utilities
├── public/               # Static assets (images, favicon, robots.txt, sitemap.xml)
└── .github/workflows/    # GitHub Actions deployment
```

### Key Commands
```bash
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Create production build
npm run lint    # Run ESLint checks
npm run start   # Start production server
```

### Content Management

#### Actualités (News)
- File: `data/news.ts`
- Add/edit news items in TypeScript array
- Fields: id, title, excerpt, content, image, date, author, category

#### Événements (Events)
- File: `data/events.ts`
- Editable calendar events with date, time, location
- Fields: id, title, description, date, time, location, image

### Component Structure
- `Header.tsx` - Navigation (responsive, mobile menu)
- `Footer.tsx` - Footer with contact & social links
- `HeroSection.tsx` - Landing page hero banner
- All components use Tailwind CSS + custom colors (maroon, gold)

### Colors & Styling
- **Maroon:** `#7d201a` (primary)
- **Gold:** `#f59e0b` (accent)
- **Light bg:** `#fffcf5` (cream)
- Edit in: `tailwind.config.ts`, `app/globals.css`

### Images & Assets
Place all images in `public/images/` folder (e.g., `public/images/logo.png`)

### Contact Form Setup
Update `app/contact/page.tsx` line with Formspree ID:
```typescript
// Replace YOUR_FORM_ID with your Formspree form ID
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

Get ID from https://formspree.io (free, 50 emails/month)

### Deployment to GitHub Pages
1. Ensure `next.config.ts` has correct settings
2. GitHub Actions workflow `.github/workflows/deploy.yml` auto-deploys on push to main
3. Custom domain setup:
   - Add `public/CNAME` file with domain name
   - Configure DNS to point to GitHub Pages

### SEO & Performance
- ✅ Meta tags configured in `app/layout.tsx`
- ✅ robots.txt & sitemap.xml in `public/`
- ✅ Open Graph for social sharing
- ✅ Next.js automatic static generation (SSG)
- ✅ Tailwind CSS optimized (~50KB gzipped)

### Testing & QA
```bash
# Build for production (static export)
npm run build

# Check for issues
npm run lint

# Verify with Lighthouse (F12 in browser)
# https://pagespeed.web.dev
```

### Common Development Tasks

**Add a new event:**
```typescript
// In data/events.ts
{
  id: '5',
  title: 'New Event',
  description: 'Event details',
  date: '2026-03-20',
  time: '10h00 - 12h00',
  location: 'Collège Lucie Aubrac',
  image: '/images/event.jpg',
}
```

**Modify hero banner text:**
- File: `components/HeroSection.tsx`
- Edit `<h1>` and `<p>` content

**Change color scheme:**
- File: `tailwind.config.ts` (colors object)
- File: `app/globals.css` (CSS variables)

**Update social media links:**
- File: `components/Footer.tsx`
- Update Facebook/Instagram URLs

### Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [GitHub Pages Guide](https://pages.github.com)
- [Formspree](https://formspree.io) (contact form)

### Support & Issues
- Stuck? Check `README.md` for detailed setup
- Build errors? Run `npm install` and `npm run build` again
- TypeScript errors? Check tsconfig.json paths configuration

---

**Ready to deploy!** Push to `main` branch and GitHub Actions automatically builds & deploys.
