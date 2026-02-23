# Audit Performance

## Description
Comprehensive performance audit for the Astro portfolio, analyzing bundle sizes, image optimization, Core Web Vitals, and load times.

## When to Use
- Before deploying to production
- User asks to "check performance" or "audit performance"
- After adding heavy dependencies or large assets
- After significant code changes
- Monthly performance reviews

## Prerequisites
- Project is an Astro 5.x portfolio
- Site can be built successfully (`npm run build`)
- Output directory at `dist/` exists

## Workflow

### 1. Build the Site
```bash
npm run build
```

The build output provides initial performance insights. Astro displays file sizes and build stats.

**Expected output:**
```
✓ Build complete!
  
  dist/index.html              5.2 kB
  dist/about/index.html        4.8 kB
  dist/blog/index.html         6.1 kB
  ...
  
  dist/_astro/main.abc123.css  12.4 kB
  dist/_astro/main.def456.js   45.2 kB
  
Total build time: 3.42s
```

### 2. Audit Categories

#### **A. Bundle Size Analysis**
Check JavaScript and CSS bundle sizes:

```bash
# List all JS files with sizes
find dist/_astro -name "*.js" -exec ls -lh {} \; | awk '{print $9, $5}'

# List all CSS files with sizes
find dist/_astro -name "*.css" -exec ls -lh {} \; | awk '{print $9, $5}'
```

**Optimal targets:**
- Total JS (initial load): < 100 KB (compressed)
- Total CSS (initial load): < 50 KB (compressed)
- Individual JS chunks: < 50 KB each
- Individual CSS files: < 20 KB each

**Check compression:**
```bash
# If gzip files exist
ls -lh dist/_astro/*.js.gz
ls -lh dist/_astro/*.css.gz
```

**Validation criteria:**
- ✅ JS bundles are code-split
- ✅ No single bundle > 100 KB
- ✅ CSS is minified
- ✅ Unused CSS is purged (via Tailwind JIT or similar)
- ⚠️ Warn if total JS > 150 KB
- ❌ Error if total JS > 300 KB (too heavy)

#### **B. Image Optimization**
Audit all images in the build output:

```bash
# Find all images
find dist -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" \)

# Check sizes
find dist -type f \( -name "*.jpg" -o -name "*.png" \) -exec ls -lh {} \; | awk '{print $9, $5}' | sort -k2 -h
```

**Validation criteria:**
- ✅ Modern formats used (WebP, AVIF)
- ✅ Images are responsive (multiple sizes available)
- ✅ Hero images < 300 KB
- ✅ Thumbnail images < 50 KB
- ✅ Images use lazy loading (check HTML: `loading="lazy"`)
- ⚠️ Warn if any image > 500 KB
- ❌ Error if any image > 1 MB (unoptimized)

**Check for lazy loading:**
```bash
grep -r 'loading="lazy"' dist/*.html | wc -l
```

**Check for unoptimized images:**
```bash
# Large PNG files that should be WebP
find dist -name "*.png" -size +200k
```

#### **C. Font Loading**
Check font files and loading strategy:

```bash
# Find font files
find dist -type f \( -name "*.woff" -o -name "*.woff2" -o -name "*.ttf" \)

# Check font sizes
ls -lh dist/fonts/* 2>/dev/null || echo "No local fonts (may use CDN)"
```

**Validation criteria:**
- ✅ Fonts are WOFF2 format (best compression)
- ✅ Only necessary font weights/styles included
- ✅ Fonts are preloaded for critical text
- ✅ Font display strategy is set (`font-display: swap`)
- ⚠️ Warn if total fonts > 200 KB
- ❌ Error if using legacy formats (TTF, OTF without WOFF2)

**Check for preload:**
```bash
grep -r '<link rel="preload".*font' dist/*.html
```

#### **D. HTML Size**
Check HTML file sizes (should be minimal):

```bash
# List HTML files with sizes
find dist -name "*.html" -exec ls -lh {} \; | awk '{print $9, $5}' | sort -k2 -h
```

**Validation criteria:**
- ✅ Homepage < 50 KB (uncompressed HTML)
- ✅ Blog posts < 100 KB each
- ✅ Case studies < 150 KB each
- ⚠️ Warn if any HTML > 200 KB
- ❌ Error if any HTML > 500 KB (likely has inlined data)

#### **E. Render-Blocking Resources**
Check for render-blocking CSS/JS:

```bash
# Check for blocking stylesheets in <head>
grep -r '<link rel="stylesheet"' dist/*.html | grep -v 'media='

# Check for blocking scripts
grep -r '<script' dist/*.html | grep -v 'async\|defer'
```

**Validation criteria:**
- ✅ Critical CSS is inlined
- ✅ Non-critical CSS uses media queries or is deferred
- ✅ JavaScript uses `defer` or `async`
- ✅ No render-blocking resources in `<head>`
- ⚠️ Warn if any blocking resources found

#### **F. Third-Party Scripts**
Identify and audit third-party scripts:

```bash
# Search for external script sources
grep -r '<script.*src="http' dist/*.html | grep -v 'pranshujawade.github.io'
```

**Common third-party scripts:**
- Analytics (Google Analytics, Plausible, etc.)
- Fonts (Google Fonts)
- CDNs

**Validation criteria:**
- ✅ Third-party scripts use `async` or `defer`
- ✅ Third-party scripts are from trusted sources
- ✅ Minimal number of third-party scripts (< 3)
- ⚠️ Warn if > 3 third-party scripts (performance impact)
- ❌ Error if any third-party script is blocking

#### **G. Core Web Vitals Estimate**
While we can't measure real user metrics, estimate based on build output:

**Largest Contentful Paint (LCP):**
- Target: < 2.5s
- Affected by: Large images, render-blocking resources, server response time
- Estimate: "Good" if hero images < 200 KB and no blocking resources

**First Input Delay (FID):**
- Target: < 100ms
- Affected by: Heavy JavaScript execution
- Estimate: "Good" if total JS < 150 KB

**Cumulative Layout Shift (CLS):**
- Target: < 0.1
- Affected by: Images without dimensions, web fonts, dynamic content
- Check for: width/height on images, font-display strategy

```bash
# Check if images have width/height attributes
grep -r '<img' dist/*.html | grep -v 'width=' | head -10
```

**Validation criteria:**
- ✅ All images have width/height attributes (prevents CLS)
- ✅ Font loading uses `font-display: swap` (reduces CLS)
- ✅ No layout shifts from dynamic content

#### **H. Caching Strategy**
Check cache headers in build output (if available):

```bash
# Check for cache busting in filenames
ls dist/_astro/ | grep -E '\.[a-f0-9]{8}\.'
```

**Validation criteria:**
- ✅ Static assets have cache-busting hashes
- ✅ HTML files are not cached (use Cache-Control: no-cache)
- ✅ Assets use long-term caching (check GitHub Pages headers)

### 3. Generate Audit Report
Compile findings into a structured report:

```
⚡ Performance Audit Report
Generated: [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Bundle Sizes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  main.def456.js          42.1 KB (gzipped: 14.2 KB) ✅
  vendor.abc123.js        38.9 KB (gzipped: 13.1 KB) ✅
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total JS:               81.0 KB (gzipped: 27.3 KB) ✅

CSS:
  main.xyz789.css         15.2 KB (gzipped: 4.1 KB) ✅
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total CSS:              15.2 KB (gzipped: 4.1 KB) ✅

Verdict: Excellent ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️ Image Optimization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Images: 24
Format Breakdown:
  WebP: 18 images ✅
  PNG: 6 images ⚠️ (consider converting to WebP)

Size Analysis:
  Largest image: hero.webp (245 KB) ✅
  Average image: 85 KB ✅
  Images > 200 KB: 2 ⚠️
    - hero-blog-post.png (312 KB) ⚠️ Convert to WebP
    - case-study-banner.jpg (278 KB) ⚠️ Optimize

Lazy Loading: 22/24 images ✅
Missing lazy load: 2 images (above fold, acceptable)

Verdict: Good (minor optimizations recommended)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔤 Font Loading
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fonts:
  Inter-Regular.woff2     45 KB ✅
  Inter-Bold.woff2        47 KB ✅
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total:                  92 KB ✅

Font Display: swap ✅
Preload Strategy: Critical fonts preloaded ✅

Verdict: Excellent ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 HTML Sizes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  index.html              5.2 KB ✅
  blog/index.html         6.1 KB ✅
  about/index.html        4.8 KB ✅
  
  Largest page: 12.4 KB ✅

Verdict: Excellent ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Render-Blocking Resources
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blocking Stylesheets: 0 ✅
Blocking Scripts: 0 ✅
Critical CSS: Inlined ✅

Verdict: Excellent ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Third-Party Scripts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Count: 1
  - Plausible Analytics (async) ✅

Verdict: Excellent ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Core Web Vitals (Estimated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LCP (Largest Contentful Paint):
  Estimated: < 2.5s ✅
  Factors: Small bundle, optimized images, no blocking resources

FID (First Input Delay):
  Estimated: < 100ms ✅
  Factors: Minimal JavaScript (27 KB gzipped)

CLS (Cumulative Layout Shift):
  Estimated: < 0.1 ✅
  Factors: All images have dimensions, font-display: swap

Verdict: All metrics in "Good" range ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority: MEDIUM
1. Convert 2 large PNG images to WebP:
   - hero-blog-post.png (312 KB → ~90 KB estimated)
   - case-study-banner.jpg (278 KB → ~80 KB estimated)
   
   Potential savings: ~350 KB

Priority: LOW
2. Consider converting remaining 6 PNG thumbnails to WebP
   Potential savings: ~50 KB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Performance Score: 95/100 (Excellent)

Summary:
✅ Bundle sizes are optimal
✅ Most images are well-optimized
✅ Font loading is efficient
✅ No render-blocking resources
✅ Minimal third-party scripts
✅ Core Web Vitals estimated as "Good"

Your portfolio is well-optimized for performance!
```

### 4. Offer to Fix Issues
After presenting the report, offer to optimize:

"Would you like me to:
- Convert PNG images to WebP format?
- Add lazy loading attributes where missing?
- Optimize any specific assets?"

## Rules to Follow
- **ALWAYS** build the site first (`npm run build`)
- **ALWAYS** check `dist/` output, not source files
- **ALWAYS** report file sizes in both raw and gzipped formats
- **ALWAYS** estimate Core Web Vitals based on measurable factors
- **NEVER** recommend premature optimization without evidence
- **ALWAYS** prioritize issues by performance impact

## Related Skills
- `deploy-portfolio` - Run before deployment
- `audit-seo` - Run together for comprehensive audit
- `audit-accessibility` - Complete pre-deploy checks

## Related Rules
- `PERFORMANCE.md` - Performance standards (if exists)
- `DEPLOYMENT.md` - Deployment checklist

## Tools & Validation
- **Lighthouse**: Run for detailed performance metrics (if available)
  ```bash
  # If Lighthouse CLI installed
  lighthouse https://pranshujawade.github.io/ --only-categories=performance
  ```
- **Bundle Analyzer**: For JavaScript bundle visualization (if configured)
- **WebPageTest**: For real-world performance testing
- **PageSpeed Insights**: Google's performance tool

## Error Handling

### Build Failure
```
❌ Cannot audit: Build failed

Please fix build errors first, then re-run the performance audit.
```

### Large Bundles
```
❌ Performance Issue: JavaScript bundles too large

Total JS: 425 KB (gzipped: 145 KB)
Target: < 100 KB (gzipped)

**Recommendations:**
- Enable code splitting for routes
- Lazy load heavy components
- Check for duplicate dependencies
- Review and remove unused libraries

Run: npm run build -- --analyze (if available) to visualize bundle
```

### Unoptimized Images
```
⚠️ Performance Issue: Large unoptimized images

Found 5 images > 500 KB:
- hero-1.png: 1.2 MB
- banner.jpg: 890 KB
- screenshot.png: 650 KB

**Impact:** +2.5s estimated page load time

Would you like me to optimize these images?
```

## Example Interaction

**User:** "Check my portfolio's performance"

**Agent:**
"I'll run a comprehensive performance audit. Let me build the site first...

[Runs npm run build]

✅ Build successful (3.42s)

Analyzing performance...

[Checks bundle sizes, images, fonts, etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Performance Audit Report
Generated: 2026-02-23

[Detailed report with all metrics]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Performance Score: 95/100 (Excellent)

Your portfolio is well-optimized! Found 2 medium-priority improvements:
1. Convert 2 large PNG images to WebP (~350 KB savings)
2. Optimize case study banner image

Would you like me to optimize these images?"

**User:** "yes please"

**Agent:**
"I'll optimize those images...

[Converts images to WebP, updates references]

✅ Optimization complete!

**Results:**
- hero-blog-post.png → hero-blog-post.webp (312 KB → 89 KB) 💾 223 KB saved
- case-study-banner.jpg → case-study-banner.webp (278 KB → 82 KB) 💾 196 KB saved

Total savings: 419 KB (56% reduction)

Running audit again to verify...

[Re-runs audit]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Performance Score: 98/100 (Excellent)

Your portfolio is now fully optimized for performance! 🎉"
