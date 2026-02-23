# SEO_REQUIREMENTS.md

**Purpose:** SEO standards, meta tags, structured data, and performance targets  
**Scope:** On-page SEO, technical SEO, Core Web Vitals, search engine optimization  
**Last Updated:** 2026-02-23

---

## Meta Tags Requirements

### Every Page Must Include

All pages must have these meta tags for optimal SEO and social sharing:

1. **Title tag** (unique, ≤ 60 characters)
2. **Meta description** (unique, ≤ 160 characters)
3. **Canonical URL** (absolute URL)
4. **Open Graph tags** (for social media sharing)
5. **Twitter Card tags** (for Twitter sharing)
6. **Viewport meta** (for mobile responsiveness)
7. **Language attribute** (on `<html>` tag)

---

## BaseHead Component

### Centralized SEO Management

All SEO metadata is managed through `src/components/BaseHead.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const {
  title,
  description,
  image = '/images/default-og.jpg',
  canonical,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
} = Astro.props;

const canonicalURL = canonical || new URL(Astro.url.pathname, Astro.site);
const socialImage = new URL(image, Astro.site);
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={socialImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

{publishedTime && <meta property="article:published_time" content={publishedTime} />}
{modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
{tags && tags.map(tag => <meta property="article:tag" content={tag} />)}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={socialImage} />

<!-- Additional Meta -->
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

---

## Title Tag Guidelines

### Format by Page Type

```
Homepage: "Pranshu Jawade | Frontend Developer & Designer"
About: "About | Pranshu Jawade"
Blog List: "Blog | Pranshu Jawade"
Blog Post: "Post Title | Pranshu Jawade"
Case Study: "Project Name | Pranshu Jawade"
```

### Rules
- **Length**: 50-60 characters (optimal)
- **Uniqueness**: Every page must have unique title
- **Brand**: Include personal name for brand recognition
- **Keywords**: Primary keyword at the beginning when possible
- **Separator**: Use pipe (|) or em dash (—) consistently

```typescript
✅ GOOD
"Building Modern Portfolios with Astro | Pranshu Jawade"
"E-Commerce Redesign Case Study | Pranshu Jawade"

❌ BAD
"Blog Post" // Not descriptive, no branding
"The Ultimate Complete Comprehensive Guide to Everything" // Too long
"Pranshu Jawade - Blog - Post - Web Development" // Too many separators
```

---

## Meta Description Guidelines

### Best Practices
- **Length**: 150-160 characters (optimal for search snippets)
- **Uniqueness**: Every page must have unique description
- **Actionable**: Include value proposition or call-to-action
- **Keywords**: Naturally include relevant keywords
- **Complete sentences**: No truncation mid-sentence

```yaml
✅ GOOD
description: "Learn how to build a performant, SEO-optimized portfolio using Astro 5 and Tailwind CSS. Includes deployment guide and best practices."

❌ BAD
description: "Blog post" # Too short, not descriptive
description: "This is a really long description that goes on and on about building portfolios with Astro and Tailwind CSS and includes way too much detail that will definitely get truncated in search results" # Too long (>160 chars)
```

---

## Canonical URLs

### Critical Importance

Canonical URLs tell search engines which version of a page is the "master" copy. This is **essential for content syndication**.

### Rules
- **Always absolute URLs**: Include protocol and domain
- **Always set on every page**: No exceptions
- **Portfolio is the source**: Never point to syndicated versions
- **Consistent**: Use same URL structure throughout

```astro
<!-- ✅ GOOD -->
<link rel="canonical" href="https://pranshujawade.github.io/blog/post-slug" />

<!-- ❌ BAD -->
<link rel="canonical" href="/blog/post-slug" /> <!-- Relative URL -->
<link rel="canonical" href="https://dev.to/username/post-slug" /> <!-- Points to syndication -->
```

### Implementation

```astro
---
// BaseLayout.astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<link rel="canonical" href={canonicalURL} />
```

---

## Open Graph Tags

### Required for Social Sharing

Open Graph tags control how your content appears when shared on social media (Facebook, LinkedIn, Discord, etc.).

### Minimum Required Tags

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://pranshujawade.github.io/" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://pranshujawade.github.io/images/og-image.jpg" />
```

### Image Requirements
- **Dimensions**: 1200x630px (Facebook/LinkedIn standard)
- **Format**: JPG or PNG (WebP not universally supported)
- **Size**: < 300KB
- **Absolute URL**: Must include full domain
- **Include dimensions**: Helps social platforms optimize

```html
<meta property="og:image" content="https://pranshujawade.github.io/images/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Descriptive alt text" />
```

### Blog-Specific Tags

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-02-23T00:00:00Z" />
<meta property="article:modified_time" content="2026-02-24T10:30:00Z" />
<meta property="article:author" content="Pranshu Jawade" />
<meta property="article:tag" content="astro" />
<meta property="article:tag" content="typescript" />
```

---

## Twitter Card Tags

### Required for Twitter Sharing

Twitter has its own meta tags for rich cards.

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://pranshujawade.github.io/blog/post" />
<meta name="twitter:title" content="Post Title" />
<meta name="twitter:description" content="Post description" />
<meta name="twitter:image" content="https://pranshujawade.github.io/images/og-image.jpg" />
<meta name="twitter:image:alt" content="Descriptive alt text" />
```

### Card Types
- **`summary_large_image`**: Large image card (recommended for blog posts)
- **`summary`**: Small image card (for general pages)

### Optional: Twitter Handle

```html
<meta name="twitter:site" content="@yourusername" />
<meta name="twitter:creator" content="@yourusername" />
```

---

## Structured Data (JSON-LD)

### Person Schema (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pranshu Jawade",
  "url": "https://pranshujawade.github.io",
  "image": "https://pranshujawade.github.io/images/profile.jpg",
  "jobTitle": "Frontend Developer",
  "description": "Frontend developer specializing in React, TypeScript, and modern web technologies.",
  "sameAs": [
    "https://github.com/pranshujawade",
    "https://linkedin.com/in/pranshujawade",
    "https://twitter.com/yourusername"
  ]
}
```

### BlogPosting Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Building Modern Portfolios with Astro",
  "description": "Learn how to build a performant portfolio...",
  "image": "https://pranshujawade.github.io/images/blog/cover.jpg",
  "datePublished": "2026-02-23T00:00:00Z",
  "dateModified": "2026-02-23T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Pranshu Jawade",
    "url": "https://pranshujawade.github.io"
  },
  "publisher": {
    "@type": "Person",
    "name": "Pranshu Jawade"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://pranshujawade.github.io/blog/building-portfolios"
  },
  "keywords": ["astro", "typescript", "portfolio", "seo"]
}
```

### CreativeWork Schema (Case Studies)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "E-Commerce Platform Redesign",
  "description": "Complete redesign of checkout flow and product pages",
  "image": "https://pranshujawade.github.io/images/case-studies/ecommerce.jpg",
  "author": {
    "@type": "Person",
    "name": "Pranshu Jawade"
  },
  "dateCreated": "2025-12-01",
  "keywords": ["react", "typescript", "tailwind", "ecommerce"],
  "url": "https://pranshujawade.github.io/case-studies/ecommerce-redesign"
}
```

### Implementation

```astro
---
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  // ... schema data
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

## Sitemap

### Auto-Generated with @astrojs/sitemap

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pranshujawade.github.io',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
});
```

### What Gets Included
- All static pages
- All dynamic routes (blog posts, case studies)
- Filtered to exclude drafts

### Output
- **File**: `dist/sitemap-index.xml` and `dist/sitemap-0.xml`
- **Automatic**: Generated on every build
- **Submission**: Submit to Google Search Console and Bing Webmaster Tools

---

## RSS Feed

### Configuration

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  const publishedPosts = blog
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Pranshu Jawade Blog',
    description: 'Articles about web development, TypeScript, and modern frontend technologies.',
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
```

### RSS Link in Head

```html
<link rel="alternate" type="application/rss+xml" title="Pranshu Jawade Blog" href="/rss.xml" />
```

---

## Robots.txt

### File Location
`public/robots.txt`

### Content

```
User-agent: *
Allow: /

Sitemap: https://pranshujawade.github.io/sitemap-index.xml
```

### For Staging/Draft Sites

```
User-agent: *
Disallow: /
```

---

## Core Web Vitals Targets

### Lighthouse Performance Budget

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4.0s |
| **FID** (First Input Delay) | < 100ms | < 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | < 3.0s |
| **TTI** (Time to Interactive) | < 3.8s | < 7.3s |
| **TBT** (Total Blocking Time) | < 200ms | < 600ms |

### Lighthouse Score Targets

| Category | Minimum | Target |
|----------|---------|--------|
| Performance | 90 | 95+ |
| Accessibility | 90 | 100 |
| Best Practices | 90 | 100 |
| SEO | 90 | 100 |

### Optimization Strategies

#### Reduce LCP
- Optimize images (WebP, proper sizing)
- Preload critical resources
- Use CDN for static assets
- Minimize render-blocking resources

```astro
<!-- Preload critical images -->
<link rel="preload" as="image" href="/images/hero.webp" />

<!-- Use responsive images -->
<Image src={hero} alt="Hero" width={1200} height={630} format="webp" quality={80} />
```

#### Minimize CLS
- Always set width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content

```astro
<!-- ✅ GOOD - Dimensions set -->
<Image src={thumbnail} alt="Thumbnail" width={400} height={300} />

<!-- ❌ BAD - No dimensions -->
<img src="/thumbnail.jpg" alt="Thumbnail" />
```

#### Reduce FID/TBT
- Minimize JavaScript bundle size
- Code split by route
- Lazy load non-critical components
- Use `client:visible` for below-the-fold interactivity

```astro
<!-- Static by default -->
<Button>Click me</Button>

<!-- Hydrate only when visible -->
<InteractiveChart client:visible />
```

---

## SEO Best Practices

### Internal Linking
- Link to related blog posts
- Include contextual links in content
- Use descriptive anchor text
- Maintain logical site structure

```markdown
✅ GOOD
For more details, see my [guide to Astro optimization](/blog/astro-optimization).

❌ BAD
Click [here](/blog/astro-optimization) for more info.
```

### External Linking
- Link to authoritative sources
- Use `rel="noopener noreferrer"` for external links
- Open external links in new tab when appropriate

```astro
<a href="https://docs.astro.build" target="_blank" rel="noopener noreferrer">
  Astro Documentation
</a>
```

### Image SEO
- Descriptive file names: `astro-project-structure.png` not `img123.png`
- Descriptive alt text (not "image" or "picture")
- Proper image dimensions to prevent CLS
- WebP format for better compression

### URL Structure
- Clean, readable URLs
- Hyphens for word separation (not underscores)
- Lowercase only
- No unnecessary parameters

```
✅ GOOD
/blog/building-modern-portfolios
/case-studies/ecommerce-redesign

❌ BAD
/blog/Building_Modern_Portfolios
/case-studies/project.php?id=123
```

---

## Mobile SEO

### Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Mobile-Friendly Requirements
- Responsive design (Tailwind breakpoints)
- Touch-friendly targets (min 48x48px)
- Readable font sizes (min 16px)
- No horizontal scrolling

### Testing
- Chrome DevTools mobile emulation
- Lighthouse mobile audit
- Google Mobile-Friendly Test

---

## Content SEO

### Heading Hierarchy
- One H1 per page (page title)
- Logical hierarchy (H2 → H3, don't skip levels)
- Descriptive headings (include keywords naturally)

```markdown
✅ GOOD
# Building Modern Portfolios (H1)
## Choosing a Framework (H2)
### Why Astro? (H3)
### Why Not Next.js? (H3)
## Styling with Tailwind (H2)

❌ BAD
# Title (H1)
### Subsection (H3) <!-- Skipped H2 -->
## Another Section (H2)
```

### Content Length
- **Blog posts**: 800-1500 words (minimum 300)
- **Case studies**: 500-1000 words
- **About page**: 300-500 words

### Keyword Usage
- Include primary keyword in H1
- Include related keywords in H2s
- Natural language (no keyword stuffing)
- LSI keywords (related terms)

---

## Technical SEO Checklist

Before deploying:

### Head Section
- [ ] Unique title on every page (≤ 60 chars)
- [ ] Unique description on every page (≤ 160 chars)
- [ ] Canonical URL set (absolute)
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Viewport meta tag present
- [ ] Language attribute on `<html>`

### Structured Data
- [ ] JSON-LD schema on homepage (Person)
- [ ] JSON-LD schema on blog posts (BlogPosting)
- [ ] JSON-LD schema on case studies (CreativeWork)
- [ ] Valid JSON (test with Google Rich Results Test)

### Performance
- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Images optimized (WebP, proper dimensions)

### Indexing
- [ ] Sitemap generated and accessible
- [ ] RSS feed accessible at /rss.xml
- [ ] robots.txt allows indexing
- [ ] No broken links (404s)
- [ ] Canonical URLs point to portfolio (not syndicated versions)

### Accessibility (impacts SEO)
- [ ] All images have alt text
- [ ] Heading hierarchy is logical
- [ ] Links have descriptive text
- [ ] Color contrast meets WCAG AA

---

## SEO Monitoring

### Tools to Use
- **Google Search Console**: Index status, search performance
- **Bing Webmaster Tools**: Index status for Bing
- **Lighthouse CI**: Automated performance/SEO audits
- **Google Analytics** (optional): Traffic analysis

### Metrics to Track
- Organic search traffic
- Keyword rankings
- Core Web Vitals in Search Console
- Indexed pages count
- Crawl errors

---

## Summary

**Critical Requirements:**
- Every page: unique title, description, canonical URL
- All images: proper alt text and dimensions
- Structured data on all page types
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Lighthouse scores: all categories ≥ 90

**Always Remember:**
- Canonical URL is NON-NEGOTIABLE (portfolio is always the source)
- Performance and accessibility directly impact SEO
- Mobile-first approach
- Quality content over quantity

**Reference:**
- CONTENT_GUIDELINES.md for content SEO
- ACCESSIBILITY.md for semantic HTML
- PERFORMANCE.md for optimization strategies (if created)
