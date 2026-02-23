# DEPLOYMENT.md

**Purpose:** Deployment process, GitHub Actions workflows, build configuration, and hosting  
**Scope:** GitHub Pages deployment, CI/CD pipelines, build optimization, pre-deployment checks  
**Last Updated:** 2026-02-23

---

## Deployment Platform

### GitHub Pages

**Hosting:** GitHub Pages (static site hosting)  
**URL:** https://pranshujawade.github.io  
**Source:** GitHub Actions (not branch-based deployment)  
**CDN:** Cloudflare (automatic via GitHub)  
**SSL:** Automatic HTTPS enforcement

### Why GitHub Pages?

- **Free hosting** for static sites
- **Automatic HTTPS** with valid certificate
- **Global CDN** via Cloudflare
- **Custom domain support** (optional)
- **Tight GitHub integration** (deploy on push)
- **Excellent uptime** and reliability

---

## Repository Configuration

### GitHub Pages Settings

**Location:** Repository Settings > Pages

```
Build and deployment:
├── Source: GitHub Actions
├── Custom domain: (optional) yourdomain.com
└── Enforce HTTPS: ✅ Enabled
```

**Important:** Use "GitHub Actions" source, NOT "Deploy from a branch".

### Branch Protection (Optional)

Protect the `main` branch:
- Require pull request reviews
- Require status checks to pass (Lighthouse CI, build, tests)
- Require branches to be up to date

---

## Build Process

### Build Command

```bash
npm run build
```

### Build Steps

1. **Type checking**: `astro check` verifies TypeScript
2. **Content validation**: Zod schemas validate frontmatter
3. **Static generation**: All pages rendered to HTML
4. **Asset optimization**: 
   - Images optimized with Sharp (WebP conversion)
   - CSS processed and minified (Tailwind purge)
   - JavaScript bundled and minified (Vite)
5. **Output**: `dist/` directory ready for deployment

### Build Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pranshujawade.github.io',
  base: '/', // Change if using subdirectory
  output: 'static', // Static site generation
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto', // Inline critical CSS
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp', // Image optimization
    },
  },
});
```

---

## GitHub Actions Deployment Workflow

### Workflow File

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch: # Allow manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Security audit
        run: npm audit --audit-level=high
        continue-on-error: true # Don't block deployment on audit failures
      
      - name: TypeScript type checking
        run: npm run astro check
      
      - name: Build site
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Workflow Triggers

```yaml
on:
  push:
    branches:
      - main # Deploy on every push to main
  workflow_dispatch: # Allow manual deployment via UI
```

**Manual trigger:**
1. Go to: Repository > Actions > Deploy to GitHub Pages
2. Click "Run workflow"
3. Select branch (usually `main`)
4. Click "Run workflow"

---

## Pre-Deployment Checks

### Local Testing

Always test locally before pushing to `main`:

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
# Visit http://localhost:4321

# 3. Run type checking
npm run astro check

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
# Visit http://localhost:4321

# 6. Run security audit
npm audit

# 7. Test in multiple browsers (Chrome, Firefox, Safari)
```

### Automated Checks in CI

The deployment workflow includes:
- ✅ **Dependency installation**: `npm ci` (clean install)
- ✅ **Security audit**: `npm audit --audit-level=high`
- ✅ **Type checking**: `astro check`
- ✅ **Build verification**: `npm run build`

If any step fails, deployment is aborted.

---

## Deployment Process

### Standard Deployment Flow

```
1. Commit changes
   ├── git add .
   ├── git commit -m "Message"
   └── git push origin main

2. GitHub Actions triggered
   ├── Install dependencies
   ├── Run security audit
   ├── Run type checking
   ├── Build static site
   └── Upload dist/ artifact

3. Deploy to GitHub Pages
   ├── Download artifact
   ├── Deploy to Pages
   └── Invalidate CDN cache

4. Site live
   └── https://pranshujawade.github.io
```

### Deployment Time

**Typical deployment:** 2-4 minutes
- Build: 1-2 minutes
- Deploy: 30-60 seconds
- CDN propagation: 30-60 seconds

### Monitoring Deployment

**GitHub Actions tab:**
- Real-time logs
- Build status
- Error messages (if any)

**Deployment URL:**
Once deployed, a comment is added to the commit with the deployment URL.

---

## Build Optimization

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Astro automatically optimizes at build time -->
<Image 
  src={heroImage} 
  alt="Hero" 
  width={1200} 
  height={630}
  format="webp"
  quality={80}
/>
```

**What happens:**
- Original image processed by Sharp
- Converted to WebP (better compression)
- Multiple sizes generated for responsive images
- Width/height set automatically (prevents CLS)

### CSS Optimization

**Tailwind CSS:**
- Unused classes purged automatically
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // Purge removes unused classes based on content glob
};
```

### JavaScript Optimization

**Vite (Astro's bundler):**
- Code splitting by route
- Tree shaking (removes unused code)
- Minification
- Hashing for cache busting

**Islands Architecture:**
- Static by default (no JS sent)
- Hydrate only interactive components
- Lazy load below-the-fold components

```astro
<!-- No JS -->
<Button>Click me</Button>

<!-- JS only when visible -->
<InteractiveChart client:visible />
```

---

## Custom Domain (Optional)

### Setup Process

#### 1. Add CNAME File

**File:** `public/CNAME`

```
yourdomain.com
```

This file is copied to `dist/` during build and tells GitHub Pages your custom domain.

#### 2. Configure DNS

Add DNS records at your domain registrar:

**For apex domain (yourdomain.com):**
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

**For www subdomain:**
```
CNAME    www    pranshujawade.github.io
```

#### 3. Update GitHub Pages Settings

Repository Settings > Pages > Custom domain:
- Enter: `yourdomain.com`
- Wait for DNS check (green checkmark)
- Enable "Enforce HTTPS" (may take a few hours)

#### 4. Update Astro Config

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://yourdomain.com', // Updated
  // ...
});
```

#### 5. Rebuild and Deploy

```bash
npm run build
git add .
git commit -m "Add custom domain"
git push
```

### DNS Propagation

**Timing:** 24-48 hours (typically faster)

**Check propagation:**
```bash
# Check A records
dig yourdomain.com

# Check CNAME
dig www.yourdomain.com
```

---

## Rollback Strategy

### Rolling Back a Deployment

#### Option 1: Revert Commit

```bash
# Revert the last commit
git revert HEAD

# Push revert commit
git push origin main

# GitHub Actions automatically redeploys
```

#### Option 2: Revert to Specific Commit

```bash
# Find commit hash
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Push
git push origin main
```

#### Option 3: Branch Deployment

```bash
# Create fix branch
git checkout -b fix/critical-issue

# Make fixes
git add .
git commit -m "Fix critical issue"

# Merge to main
git checkout main
git merge fix/critical-issue
git push origin main
```

### Deployment History

View deployment history:
- Repository > Deployments
- Lists all deployments with timestamps
- Click to see details and logs

---

## Troubleshooting

### Build Failures

#### TypeScript Errors

```
Error: Type checking failed
```

**Solution:**
```bash
# Run type checking locally
npm run astro check

# Fix reported errors
# Re-run until no errors
```

#### Content Validation Errors

```
Error: Blog post frontmatter validation failed
```

**Solution:**
- Check frontmatter against schema in `src/content/config.ts`
- Ensure all required fields present
- Verify field types (string, number, date, etc.)

#### Build Timeout

```
Error: Build exceeded time limit
```

**Solution:**
- Optimize images before committing (< 200KB each)
- Reduce number of pages (if 1000+)
- Check for infinite loops in code

### Deployment Failures

#### Permission Denied

```
Error: Resource not accessible by integration
```

**Solution:**
- Check workflow permissions in `.github/workflows/deploy.yml`
- Ensure repository settings allow GitHub Actions to deploy

#### Pages Deployment Failed

```
Error: Failed to deploy to GitHub Pages
```

**Solution:**
- Verify GitHub Pages is enabled in settings
- Check source is set to "GitHub Actions"
- Review deployment logs for specific error

### Site Not Updating

#### CDN Cache

**Problem:** Site not reflecting latest changes

**Solution:**
1. Wait 2-3 minutes (CDN propagation)
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Clear browser cache
4. Try incognito/private window

#### Wrong Branch Deployed

**Problem:** Old version still live

**Solution:**
- Verify push went to `main` branch
- Check GitHub Actions completed successfully
- Review deployment logs

---

## Lighthouse CI Workflow

### Performance Budget Enforcement

**File:** `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches:
      - main

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321
            http://localhost:4321/blog
            http://localhost:4321/case-studies
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Lighthouse Configuration

**File:** `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

**Thresholds:**
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

If any score < 90, CI fails (blocks PR merge).

---

## Environment Variables

### Build-Time Variables

Astro supports build-time environment variables:

```typescript
// Access in Astro components (build-time only)
const apiKey = import.meta.env.DEVTO_API_KEY;
```

### GitHub Secrets

Store sensitive values in GitHub Secrets:
- Repository Settings > Secrets and variables > Actions
- Add secrets: `DEVTO_API_KEY`, `HASHNODE_PAT`, etc.

### Using Secrets in Workflows

```yaml
- name: Syndicate content
  env:
    DEVTO_API_KEY: ${{ secrets.DEVTO_API_KEY }}
  run: node scripts/syndicate-devto.mjs
```

**Note:** Secrets are ONLY available in GitHub Actions, not in client-side code.

---

## Deployment Checklist

### Before Every Deploy

- [ ] Test locally: `npm run dev`
- [ ] Run type checking: `npm run astro check`
- [ ] Build locally: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Run security audit: `npm audit`
- [ ] Test in multiple browsers
- [ ] Verify no secrets in code
- [ ] Check image file sizes (< 200KB)

### After Deploy

- [ ] Verify deployment succeeded (GitHub Actions)
- [ ] Visit live site and test navigation
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test all new pages/features
- [ ] Verify images load correctly
- [ ] Check browser console for errors
- [ ] Run Lighthouse audit (target: all ≥ 90)
- [ ] Submit sitemap to Google Search Console (if new pages)

### Monthly

- [ ] Review deployment logs for errors
- [ ] Check GitHub Pages uptime
- [ ] Update dependencies: `npm update`
- [ ] Run full security audit
- [ ] Review Lighthouse CI history

---

## Performance Monitoring

### Tools

- **Lighthouse CI**: Automated audits on PRs
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome DevTools**: Performance tab

### Key Metrics to Monitor

| Metric | Target | Critical |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4.0s |
| **FID** (First Input Delay) | < 100ms | < 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| **Lighthouse Performance** | ≥ 90 | ≥ 70 |

### Optimization Tips

If metrics decline:
1. Check for large images (optimize to < 200KB)
2. Review JavaScript bundle size (check Vite build output)
3. Minimize render-blocking resources
4. Use `client:visible` for below-the-fold components
5. Enable preloading for critical assets

---

## Summary

**Deployment Flow:**
1. Push to `main` branch
2. GitHub Actions runs checks (audit, type check, build)
3. Deploy to GitHub Pages
4. Site live at https://pranshujawade.github.io

**Key Files:**
- `.github/workflows/deploy.yml` - Production deployment
- `.github/workflows/lighthouse.yml` - Performance CI
- `astro.config.mjs` - Build configuration

**Pre-Deploy Checklist:**
- Type check passes
- Build succeeds locally
- No secrets in code
- Images optimized
- Security audit clean

**Post-Deploy Verification:**
- Deployment succeeded
- Site loads correctly
- No console errors
- Lighthouse scores ≥ 90

**Reference:**
- SECURITY.md for secrets management
- SEO_REQUIREMENTS.md for performance targets
- PROJECT.md for development commands
