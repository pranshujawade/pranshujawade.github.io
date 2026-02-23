# ARCHITECTURE.md

**Purpose:** System architecture, directory structure, and design patterns  
**Scope:** Project organization, routing, data flow, component hierarchy  
**Last Updated:** 2026-02-23

---

## System Overview

### Architecture Pattern
**Static Site Generation (SSG)** with **Islands Architecture**

- All pages pre-rendered at build time
- No server-side runtime required
- Interactive components hydrated on-demand (islands)
- Content stored as MDX and JSON files
- Output: Static HTML, CSS, JS deployed to GitHub Pages

### Build Output
```typescript
// astro.config.mjs
export default defineConfig({
  output: 'static', // Static site generation only
  site: 'https://pranshujawade.github.io',
  base: '/', // Adjust if using subdirectory
});
```

---

## Directory Structure

### Root Level
```
Portfolio/
├── .github/          # GitHub-specific configuration
├── .qoder/           # Qoder rules and agent configuration
├── public/           # Static assets (copied as-is to dist/)
├── scripts/          # Build scripts and automation
├── src/              # Source code (components, pages, content)
├── dist/             # Build output (generated, not committed)
├── node_modules/     # Dependencies (generated, not committed)
├── astro.config.mjs  # Astro configuration
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Source Directory Structure

### `/src` Organization

```
src/
├── components/
│   ├── layout/          # Layout components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Navigation.astro
│   ├── sections/        # Page-level sections
│   │   ├── Hero.astro
│   │   ├── ProjectsGrid.astro
│   │   ├── BlogList.astro
│   │   └── ContactForm.astro
│   └── ui/              # Reusable UI components
│       ├── Button.astro
│       ├── Card.astro
│       ├── Tag.astro
│       └── Icon.astro
├── content/
│   ├── blog/            # Blog posts (MDX)
│   │   └── 2026-02-post-slug.mdx
│   ├── case-studies/    # Portfolio case studies (MDX)
│   │   └── project-name.mdx
│   ├── data/            # JSON data files
│   │   ├── skills.json
│   │   ├── experience.json
│   │   └── education.json
│   └── config.ts        # Content collection schemas
├── layouts/
│   ├── BaseLayout.astro      # HTML structure, head, body
│   ├── BlogLayout.astro      # Blog post template
│   └── CaseStudyLayout.astro # Case study template
├── pages/
│   ├── index.astro           # Homepage
│   ├── about.astro           # About page
│   ├── blog/
│   │   ├── index.astro       # Blog list page
│   │   └── [...slug].astro   # Dynamic blog post pages
│   ├── case-studies/
│   │   ├── index.astro       # Case studies list
│   │   └── [...slug].astro   # Dynamic case study pages
│   ├── rss.xml.ts            # RSS feed generation
│   └── 404.astro             # 404 error page
├── styles/
│   ├── global.css            # Global styles + Tailwind directives
│   └── typography.css        # Custom typography (if needed)
└── utils/
    ├── date.ts               # Date formatting utilities
    ├── blog.ts               # Blog-related utilities
    ├── seo.ts                # SEO utilities
    └── syndication.ts        # Content syndication helpers
```

---

## Component Hierarchy

### Layout Flow

```
BaseLayout.astro                    # Root layout
├── <head> with SEO meta           # Managed by BaseHead.astro
├── <body>
    ├── Header.astro               # Site header
    │   └── Navigation.astro       # Navigation menu
    ├── <main>
    │   └── <slot />               # Page content inserted here
    └── Footer.astro               # Site footer
```

### Page Composition

```
blog/[...slug].astro               # Blog post page
└── BlogLayout.astro               # Blog-specific layout
    └── BaseLayout.astro           # Base HTML structure
        ├── BaseHead.astro         # SEO & meta tags
        └── Article Content        # Rendered MDX
            ├── TableOfContents.astro
            ├── ReadingTime.astro
            └── ShareButtons.astro
```

### Component Size Guidelines

- **Layouts**: Full-page structure, handle SEO and shell
- **Sections**: Page-level blocks (hero, grid, list)
- **UI Components**: Small, reusable, single-responsibility

```astro
<!-- ❌ BAD - Component too large -->
<BlogPage> <!-- Handles layout + content + sidebar + footer -->

<!-- ✅ GOOD - Proper separation -->
<BaseLayout>
  <BlogLayout>
    <BlogPost />
    <BlogSidebar />
  </BlogLayout>
</BaseLayout>
```

---

## Content Collections

### Configuration

Content collections are defined in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
    pubDate: z.date(),
    tags: z.array(z.string()).max(4),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
    canonical: z.string().url().optional(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string().max(160),
    technologies: z.array(z.string()),
    role: z.string(),
    duration: z.string(),
    featured: z.boolean().default(false),
    sortOrder: z.number(),
    results: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
  }),
});

export const collections = { blog, caseStudies };
```

### Blog Collection (`src/content/blog/`)

**File naming:** `YYYY-MM-slug.mdx`

```markdown
---
title: "How I Built My Portfolio"
description: "A deep dive into building a modern portfolio with Astro and Tailwind."
pubDate: 2026-02-23
tags: ["astro", "tailwind", "portfolio"]
draft: false
featured: true
coverImage: "/images/portfolio-cover.jpg"
---

Blog post content in MDX format...
```

### Case Studies Collection (`src/content/case-studies/`)

**File naming:** `project-name.mdx`

```markdown
---
title: "E-Commerce Platform Redesign"
tagline: "Increasing conversion rates through UX improvements"
description: "Complete redesign of checkout flow and product pages."
technologies: ["React", "TypeScript", "Tailwind CSS", "Stripe"]
role: "Frontend Developer"
duration: "3 months"
featured: true
sortOrder: 1
results:
  - "32% increase in conversion rate"
  - "45% reduction in cart abandonment"
liveUrl: "https://example.com"
githubUrl: "https://github.com/username/project"
---

Case study content in MDX format...
```

### Data Files (`src/content/data/`)

JSON files for structured data:

```json
// src/content/data/skills.json
{
  "categories": [
    {
      "name": "Frontend",
      "skills": [
        { "name": "TypeScript", "level": "Advanced" },
        { "name": "React", "level": "Advanced" }
      ]
    }
  ]
}
```

---

## Routing System

### File-Based Routing

Astro uses file-based routing. Files in `src/pages/` automatically become routes:

```
src/pages/
├── index.astro           → /
├── about.astro           → /about
├── blog/
│   ├── index.astro       → /blog
│   └── [...slug].astro   → /blog/* (dynamic)
└── case-studies/
    ├── index.astro       → /case-studies
    └── [...slug].astro   → /case-studies/* (dynamic)
```

### Dynamic Routes

**Rest parameters** (`[...slug].astro`) capture all path segments:

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogLayout post={post}>
  <Content />
</BlogLayout>
```

### Route Priority

1. Static routes (exact matches)
2. Dynamic routes with parameters
3. Rest parameters (catch-all)

```
/blog/index.astro         # Highest priority
/blog/[slug].astro        # Medium priority
/blog/[...slug].astro     # Lowest priority (catch-all)
```

---

## Path Aliases

Defined in `tsconfig.json` for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@content/*": ["src/content/*"],
      "@utils/*": ["src/utils/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

**Usage:**
```typescript
// ❌ BAD
import Button from '../../../components/ui/Button.astro';

// ✅ GOOD
import Button from '@components/ui/Button.astro';
```

---

## Data Flow Patterns

### Content Query Pattern

```astro
---
// 1. Query content collections
import { getCollection } from 'astro:content';

// 2. Filter and sort
const posts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

// 3. Pass to components
---

<BlogList posts={posts} />
```

### Props Drilling (Minimized)

Keep prop drilling shallow by composing at the page level:

```astro
---
// ❌ BAD - Deep prop drilling
<Layout>
  <Section>
    <Container>
      <Grid>
        <Card title={post.title} /> <!-- Props drilled 4 levels -->
      </Grid>
    </Container>
  </Section>
</Layout>

// ✅ GOOD - Pass complete objects
<Layout>
  <BlogGrid posts={posts} /> <!-- Component handles its own structure -->
</Layout>
```

### Utility Functions

Extract reusable logic into utility modules:

```typescript
// src/utils/blog.ts
import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getFeaturedPosts() {
  const posts = await getPublishedPosts();
  return posts.filter(post => post.data.featured);
}
```

---

## State Management

### No Client-Side State Management

- This is a **static site** - no Redux, Zustand, or Context API needed
- State is managed at **build time** through content collections
- Interactive components use **local state** only

### Islands Architecture

Hydrate interactive components selectively:

```astro
<!-- Static by default (no JS sent) -->
<Button>Click me</Button>

<!-- Hydrate only when visible -->
<InteractiveChart client:visible />

<!-- Hydrate on page load -->
<ContactForm client:load />

<!-- Hydrate when idle -->
<NewsletterSignup client:idle />
```

**Guidelines:**
- Default to static (no client directive)
- Use `client:visible` for below-the-fold interactivity
- Use `client:load` sparingly (increases bundle size)
- Use `client:idle` for non-critical interactions

---

## Build Process

### Build Pipeline

```bash
npm run build
```

**Steps:**
1. **TypeScript Type Check**: `astro check`
2. **Content Collection Validation**: Zod schema validation
3. **Page Generation**: Static HTML for all routes
4. **Asset Optimization**: Image optimization with Sharp
5. **CSS Processing**: Tailwind compilation and minification
6. **JS Bundling**: Vite-powered bundling
7. **Output**: `dist/` directory ready for deployment

### Build Output Structure

```
dist/
├── index.html
├── about.html
├── blog/
│   ├── index.html
│   └── post-slug.html
├── case-studies/
│   ├── index.html
│   └── project-name.html
├── _astro/              # Hashed CSS and JS assets
├── images/              # Optimized images
└── robots.txt
```

---

## Performance Architecture

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/images/hero.jpg';
---

<!-- Automatic optimization -->
<Image 
  src={heroImage}
  alt="Hero image"
  width={1200}
  height={630}
  format="webp"
  quality={80}
/>
```

**Features:**
- Automatic format conversion (WebP, AVIF)
- Responsive image generation
- Lazy loading by default (except above-the-fold)
- Automatic width/height attributes (prevents CLS)

### Code Splitting

- Astro automatically splits code per page
- Shared components extracted to common chunks
- CSS scoped per component (no global bloat)

### Critical CSS

- Tailwind purges unused classes
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously

---

## SEO Architecture

### Structured Data

JSON-LD schemas injected in layouts:

```astro
---
// src/layouts/BlogLayout.astro
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "datePublished": post.data.pubDate.toISOString(),
  "author": {
    "@type": "Person",
    "name": "Pranshu Jawade"
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Canonical URLs

All pages include canonical URLs:

```astro
<link rel="canonical" href={`${Astro.site}${Astro.url.pathname}`} />
```

**Critical for syndication**: Syndicated content must reference portfolio as canonical source.

---

## Testing Strategy

### Type Safety
- **TypeScript strict mode** ensures compile-time safety
- **Zod schemas** validate content at build time
- **`astro check`** runs in CI pipeline

### Build-Time Validation
- Content collections validated against schemas
- Invalid content fails the build (fail-fast approach)
- No runtime errors from malformed content

### Lighthouse CI
- Performance budget enforcement
- Accessibility audits
- SEO checks
- Best practices validation

---

## Deployment Architecture

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
- Run astro check (type safety)
- Run astro build (generate static site)
- Deploy dist/ to GitHub Pages
```

### Hosting
- **Platform**: GitHub Pages
- **CDN**: Cloudflare (GitHub's CDN)
- **SSL**: Automatic HTTPS
- **Custom domain**: Configurable via DNS

---

## Extension Points

### Adding New Content Types

1. Define collection schema in `src/content/config.ts`
2. Create content directory: `src/content/[type]/`
3. Add list page: `src/pages/[type]/index.astro`
4. Add dynamic route: `src/pages/[type]/[...slug].astro`
5. Create layout: `src/layouts/[Type]Layout.astro`

### Adding New Features

1. Create utility functions in `src/utils/`
2. Build UI components in `src/components/ui/`
3. Compose sections in `src/components/sections/`
4. Integrate in pages under `src/pages/`

---

## Summary

**Key Architectural Principles:**
- Static-first, interactive islands when needed
- Content as code (MDX + JSON)
- Type-safe at build time
- Performance by default
- SEO-optimized from the ground up

**Reference:**
- CODING_STANDARDS.md for component patterns
- CONTENT_GUIDELINES.md for content structure
- SEO_REQUIREMENTS.md for metadata requirements
