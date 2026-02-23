# Audit SEO

## Description
Comprehensive SEO audit for the Astro portfolio, checking meta tags, structured data, sitemaps, canonical URLs, and Core Web Vitals compliance.

## When to Use
- Before deploying to production
- User asks to "check SEO" or "audit SEO"
- After adding new content (blog posts, case studies)
- After changing site structure or URLs
- Periodically (monthly) to maintain SEO health

## Prerequisites
- Project is an Astro 5.x portfolio
- Site can be built successfully (`npm run build`)
- Output directory at `dist/` exists

## Workflow

### 1. Build the Site
```bash
npm run build
```

Ensure build succeeds before auditing. The audit inspects built HTML files in `dist/`.

### 2. Audit Categories

#### **A. Page-Level Meta Tags**
For each page type (homepage, blog posts, case studies, about, etc.):

**Check for:**
- ✅ `<title>` tag (50-60 characters optimal)
- ✅ `<meta name="description">` (150-160 characters optimal)
- ✅ `<meta name="robots">` (defaults to "index,follow" is fine)
- ✅ `<link rel="canonical">` (must exist, point to correct URL)
- ✅ Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- ✅ Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)

**Example check for blog post:**
```bash
# Read a built blog post HTML
cat dist/blog/some-post/index.html
```

Grep for meta tags:
```bash
grep -E '<title>|<meta name="description"|<link rel="canonical"|<meta property="og:|<meta name="twitter:' dist/blog/some-post/index.html
```

**Validation criteria:**
- Title: Unique, descriptive, 50-60 chars
- Description: Compelling, includes target keywords, 150-160 chars
- Canonical: Absolute URL, points to https://pranshujawade.github.io/...
- OG tags: All required tags present, og:image is valid URL
- Twitter tags: Card type is "summary_large_image", image present

#### **B. Structured Data (JSON-LD)**
Check for JSON-LD structured data:

**Expected schema types:**
- Homepage: `Organization` or `Person` schema
- Blog posts: `BlogPosting` schema
- Case studies: `CreativeWork` or `Project` schema

**Example check:**
```bash
grep -A 50 'application/ld\+json' dist/index.html
```

**Validation criteria:**
- ✅ Valid JSON-LD syntax
- ✅ Correct schema.org type
- ✅ Required properties present (`@context`, `@type`, `name`, `url`, etc.)
- ✅ Image URLs are absolute
- ✅ Date formats are ISO 8601 (YYYY-MM-DD)
- ✅ Author information present for blog posts

**Validate JSON-LD:**
Use online validators or test locally:
```bash
# Extract JSON-LD and validate
# Can use https://validator.schema.org/ or similar
```

#### **C. Sitemap**
Check `dist/sitemap.xml` or `dist/sitemap-index.xml`:

```bash
cat dist/sitemap-index.xml
```

**Validation criteria:**
- ✅ Sitemap exists at root of site
- ✅ Contains all public pages (excludes drafts)
- ✅ URLs are absolute (https://pranshujawade.github.io/...)
- ✅ `<lastmod>` dates are present and valid
- ✅ `<changefreq>` is reasonable (optional but recommended)
- ✅ No 404 or broken URLs
- ✅ Follows XML sitemap protocol

**Test sitemap validity:**
```bash
# Optionally validate XML syntax
xmllint --noout dist/sitemap-index.xml
```

#### **D. Robots.txt**
Check `dist/robots.txt`:

```bash
cat dist/robots.txt
```

**Expected content:**
```
User-agent: *
Allow: /

Sitemap: https://pranshujawade.github.io/sitemap-index.xml
```

**Validation criteria:**
- ✅ robots.txt exists at root
- ✅ Allows all crawlers (`User-agent: *`, `Allow: /`)
- ✅ Includes sitemap URL
- ✅ Sitemap URL is absolute
- ✅ No disallow rules blocking important content

#### **E. RSS Feed**
Check `dist/rss.xml` or `dist/feed.xml`:

```bash
cat dist/rss.xml
```

**Validation criteria:**
- ✅ RSS feed exists
- ✅ Valid XML syntax
- ✅ Contains recent blog posts
- ✅ `<link>` tags are absolute URLs
- ✅ `<description>` is present for each item
- ✅ `<pubDate>` is valid RFC 822 format

#### **F. Canonical URLs**
Audit canonical tags across the site:

```bash
# Find all canonical tags
grep -r '<link rel="canonical"' dist/ | head -20
```

**Validation criteria:**
- ✅ Every page has exactly one canonical tag
- ✅ Canonical URL is absolute (https://...)
- ✅ Canonical points to the correct page (self-referencing)
- ✅ No trailing slashes inconsistency
- ✅ Syndicated content canonicals point to portfolio (not external sites)

**Common issues:**
- Relative URLs in canonical tags (use absolute)
- Missing canonical on some pages
- Canonical pointing to wrong page

#### **G. Internal Links**
Check for broken or relative internal links:

```bash
# Search for relative links (should be avoided in cross-platform content)
grep -r 'href="/' dist/blog/ | grep -v 'https://' | head -20
```

**Validation criteria:**
- ✅ Internal navigation links work
- ✅ Blog post internal links are complete
- ✅ No broken links (404s)
- ✅ Links open in correct window/tab
- ✅ External links have `rel="noopener noreferrer"` (security)

#### **H. Image Optimization & Alt Text**
Audit images for SEO:

```bash
# Check for images without alt text
grep -r '<img' dist/ | grep -v 'alt=' | head -10
```

**Validation criteria:**
- ✅ All images have `alt` attributes
- ✅ Alt text is descriptive (not just "image" or "photo")
- ✅ Hero images have meaningful alt text
- ✅ Decorative images use `alt=""` (empty alt)
- ✅ Images are optimized (webp, proper sizing)
- ✅ Images use lazy loading where appropriate

### 3. Generate Audit Report
Compile findings into a structured report:

```
📊 SEO Audit Report
Generated: [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSED (X/10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Meta Tags
   ✅ All pages have title tags (50-60 chars)
   ✅ All pages have meta descriptions (150-160 chars)
   ✅ Open Graph tags present
   ✅ Twitter Card tags present

2. Structured Data
   ✅ Valid JSON-LD on homepage (Person schema)
   ✅ Valid JSON-LD on blog posts (BlogPosting schema)
   ✅ Valid JSON-LD on case studies (CreativeWork schema)

3. Sitemap
   ✅ Sitemap exists at /sitemap-index.xml
   ✅ Contains all [X] public pages
   ✅ All URLs are absolute

4. Robots.txt
   ✅ Exists and allows crawling
   ✅ References sitemap

5. RSS Feed
   ✅ Valid RSS feed at /rss.xml
   ✅ Contains [X] recent posts

6. Canonical URLs
   ✅ All pages have canonical tags
   ✅ All canonicals are absolute URLs

7. Internal Links
   ✅ No broken links detected

8. Images
   ✅ All images have alt text

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ WARNINGS (X issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Meta Tags
   ⚠️ 3 pages have descriptions > 160 chars:
      - /blog/some-long-post (165 chars)
      - /blog/another-post (162 chars)
      - /case-studies/project-x (180 chars)

2. Structured Data
   ⚠️ Blog post "Some Post" missing author information

3. Images
   ⚠️ 5 images could benefit from better alt text:
      - /blog/post-1/image.png: alt="image" (too generic)
      - /blog/post-2/screenshot.png: alt="screenshot" (too generic)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ERRORS (X issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Canonical URLs
   ❌ 2 pages have relative canonical URLs:
      - /blog/broken-post: <link rel="canonical" href="/blog/broken-post">
      - Should be: https://pranshujawade.github.io/blog/broken-post

2. Structured Data
   ❌ Invalid JSON-LD on /case-studies/project-y:
      - Missing required property: "datePublished"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority: HIGH
1. Fix relative canonical URLs (critical for SEO)
2. Add missing JSON-LD properties

Priority: MEDIUM
3. Shorten meta descriptions to 150-160 chars
4. Add author info to blog post schemas

Priority: LOW
5. Improve generic alt text for images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall SEO Score: [X]% (Good/Needs Improvement/Poor)

Next Steps:
- Fix all HIGH priority issues before deploying
- Address MEDIUM priority issues when possible
- Improve LOW priority issues over time
```

### 4. Offer to Fix Issues
After presenting the report, offer to fix issues:

"Would you like me to fix any of these issues? I can:
- Update meta descriptions
- Fix canonical URLs
- Add missing structured data properties
- Improve alt text for images"

## Rules to Follow
- **ALWAYS** build the site first (`npm run build`)
- **ALWAYS** check `dist/` output, not source files
- **ALWAYS** validate canonical URLs are absolute
- **ALWAYS** ensure syndicated content has canonical pointing to portfolio
- **NEVER** allow relative canonical URLs
- **ALWAYS** check JSON-LD validity
- **ALWAYS** verify sitemap includes all public pages

## Related Skills
- `deploy-portfolio` - Run before deployment
- `content-review` - Complement with content quality checks
- `audit-performance` - Run together for comprehensive pre-deploy audit

## Related Rules
- `SEO_REQUIREMENTS.md` - SEO standards and requirements
- `CONTENT_GUIDELINES.md` - Content quality guidelines

## Tools & Validation
- **JSON-LD Validator**: https://validator.schema.org/
- **Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- **Meta Tags Checker**: Check with browser DevTools or online tools
- **Canonical Checker**: Grep through dist/ output
- **Lighthouse**: Run for additional SEO insights (if available)

## Error Handling

### Build Failure
```
❌ Cannot audit: Build failed

Please fix build errors first, then re-run the SEO audit.
```

### Missing Critical Files
```
❌ Critical SEO files missing:

Missing:
- dist/sitemap-index.xml
- dist/robots.txt

These files are required for SEO. Check your Astro config for sitemap generation.
```

## Example Interaction

**User:** "Audit my portfolio's SEO"

**Agent:**
"I'll run a comprehensive SEO audit on your portfolio. Let me build the site first...

[Runs npm run build]

✅ Build successful

Auditing SEO...

[Checks meta tags, structured data, sitemap, etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SEO Audit Report
Generated: 2026-02-23

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSED (8/10)

[Detailed report with passed checks]

⚠️ WARNINGS (3 issues)

[List of warnings]

❌ ERRORS (2 issues)

[List of errors with fix recommendations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall SEO Score: 85% (Good)

High-priority fixes needed before deploying:
1. Fix 2 relative canonical URLs
2. Add missing datePublished in case study schema

Would you like me to fix these issues now?"

**User:** "yes, fix them"

**Agent:**
"I'll fix the high-priority SEO issues...

[Fixes canonical URLs in affected files]
[Adds missing schema properties]

✅ Fixes applied

Running audit again to verify...

[Re-runs audit]

✅ All critical issues resolved!

Updated SEO Score: 92% (Excellent)

Your portfolio is now SEO-optimized and ready for deployment."
