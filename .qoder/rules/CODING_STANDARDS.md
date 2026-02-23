# CODING_STANDARDS.md

**Purpose:** Code style guidelines and patterns for the portfolio project  
**Scope:** TypeScript, Astro components, CSS/Tailwind, file organization  
**Last Updated:** 2026-02-23

---

## TypeScript Standards

### Strict Mode Enforcement

```typescript
// ✅ GOOD - Explicit types
interface BlogPostProps {
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
}

// ❌ BAD - Implicit any
function processPost(post) {
  return post.title;
}

// ✅ GOOD - Proper typing
function processPost(post: BlogPostProps): string {
  return post.title;
}
```

### No `any` Types

```typescript
// ❌ BAD
const data: any = await fetchData();

// ✅ GOOD - Use unknown and type guards
const data: unknown = await fetchData();
if (isValidData(data)) {
  // data is now typed
}

// ✅ GOOD - Use proper types
interface ApiResponse {
  status: number;
  data: BlogPost[];
}
const response: ApiResponse = await fetchData();
```

### Type Annotations

- Always annotate function parameters
- Always annotate function return types
- Use type inference for simple variable assignments
- Use `const` assertions for literal types

```typescript
// ✅ GOOD
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// ✅ GOOD - Const assertion
const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  CASE_STUDIES: '/case-studies',
} as const;
```

---

## Astro Component Patterns

### Component Structure

```astro
---
// 1. Imports (external first, then aliases, then relative)
import { Image } from 'astro:assets';
import BaseLayout from '@layouts/BaseLayout.astro';
import { formatDate } from '@utils/date';
import './styles.css';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
  showImage?: boolean;
}

// 3. Destructure props with defaults
const { 
  title, 
  description = 'Default description',
  showImage = true 
} = Astro.props;

// 4. Minimal logic - keep it simple
const formattedTitle = title.toUpperCase();
const currentYear = new Date().getFullYear();
---

<!-- 5. Template -->
<BaseLayout title={formattedTitle}>
  <article>
    <h1>{title}</h1>
    {description && <p>{description}</p>}
    {showImage && <Image src="/image.jpg" alt={title} />}
  </article>
</BaseLayout>
```

### Props Interface Best Practices

- Always define an interface for props
- Use optional properties with `?` when appropriate
- Provide default values in destructuring
- Export interfaces if reused across components

```typescript
// ✅ GOOD
interface CardProps {
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const { 
  title, 
  subtitle, 
  variant = 'primary',
  onClick 
} = Astro.props;
```

### Frontmatter Logic

- Keep frontmatter minimal - only data fetching and preparation
- Complex logic belongs in utility functions
- No business logic in components
- Fetch data at build time, not runtime

```astro
---
// ❌ BAD - Complex logic in frontmatter
const posts = await getCollection('blog');
const filteredPosts = posts
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .map(p => ({
    ...p,
    formattedDate: formatDate(p.data.pubDate),
  }));

// ✅ GOOD - Use utility functions
import { getPublishedPosts } from '@utils/blog';
const posts = await getPublishedPosts();
---
```

---

## Import Organization

### Import Order

1. Node/Astro built-ins
2. External packages (npm)
3. Path aliases (@/*)
4. Relative imports (../, ./)
5. CSS/styles (always last)

```typescript
// ✅ GOOD
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import readingTime from 'reading-time';
import BaseLayout from '@layouts/BaseLayout.astro';
import Button from '@components/ui/Button.astro';
import { formatDate } from '@utils/date';
import '../styles/blog.css';
```

### Path Aliases Usage

Always prefer path aliases over relative imports for better refactoring:

```typescript
// ❌ BAD
import Button from '../../../components/ui/Button.astro';

// ✅ GOOD
import Button from '@components/ui/Button.astro';
```

---

## File Naming Conventions

### Components
- **PascalCase** for component files: `BlogCard.astro`, `Header.astro`
- **PascalCase** for React/framework components: `Counter.tsx`

### Pages
- **kebab-case** for page routes: `case-studies.astro`, `about-me.astro`
- **[brackets]** for dynamic routes: `[slug].astro`, `[...path].astro`

### Utilities & Scripts
- **kebab-case** for utility files: `format-date.ts`, `seo-utils.ts`
- **kebab-case** for scripts: `syndicate-devto.mjs`

### Content Files
- **Blog posts:** `YYYY-MM-slug.mdx` (e.g., `2026-02-building-portfolio.mdx`)
- **Case studies:** `project-name.mdx` (e.g., `ecommerce-redesign.mdx`)

### CSS Files
- **kebab-case** for CSS modules: `blog-card.module.css`
- **kebab-case** for global styles: `global.css`, `typography.css`

---

## Tailwind CSS Standards

### Utility-First Approach

```astro
<!-- ✅ GOOD - Utility classes -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click me
</button>

<!-- ❌ BAD - Inline styles -->
<button style="padding: 0.5rem 1rem; background: blue;">
  Click me
</button>

<!-- ❌ BAD - Custom classes for simple styling -->
<button class="custom-button">
  Click me
</button>
```

### Class Organization

Order classes logically for readability:
1. Layout (flex, grid, block)
2. Positioning (absolute, relative, z-index)
3. Box model (w-, h-, p-, m-)
4. Typography (text-, font-)
5. Visual (bg-, border-, rounded-)
6. Interactive (hover:, focus:, active:)
7. Responsive (sm:, md:, lg:)

```astro
<!-- ✅ GOOD -->
<div class="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow md:px-8">
  Content
</div>
```

### Component Variants with Classes

```typescript
// ✅ GOOD - Type-safe variants
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

const buttonClass = `px-4 py-2 rounded-lg transition-colors ${variantClasses[variant]}`;
```

### No Inline Styles

```astro
<!-- ❌ BAD -->
<div style="margin-top: 20px; color: red;">

<!-- ✅ GOOD -->
<div class="mt-5 text-red-600">
```

**Exception:** Dynamic values that cannot be expressed with Tailwind:

```astro
<!-- ✅ ACCEPTABLE - Dynamic value -->
<div style={`background-image: url(${imageUrl})`}>
```

---

## Functional Programming Patterns

### Prefer Pure Functions

```typescript
// ✅ GOOD - Pure function
function formatDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale);
}

// ❌ BAD - Side effects
let formattedDate: string;
function setFormattedDate(date: Date): void {
  formattedDate = date.toLocaleDateString();
}
```

### Avoid Classes Unless Necessary

```typescript
// ❌ BAD - Unnecessary class
class DateFormatter {
  format(date: Date): string {
    return date.toLocaleDateString();
  }
}

// ✅ GOOD - Simple function
const formatDate = (date: Date): string => date.toLocaleDateString();
```

### Use Composition Over Inheritance

```typescript
// ✅ GOOD - Composable functions
const withPublishedFilter = (posts: BlogPost[]) => 
  posts.filter(p => !p.data.draft);

const withDateSort = (posts: BlogPost[]) =>
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const getPublishedPosts = (posts: BlogPost[]) =>
  withDateSort(withPublishedFilter(posts));
```

---

## Accessibility Standards

### Semantic HTML

```astro
<!-- ✅ GOOD - Semantic elements -->
<article>
  <header>
    <h1>Title</h1>
  </header>
  <section>
    <p>Content</p>
  </section>
  <footer>
    <time datetime="2026-02-23">February 23, 2026</time>
  </footer>
</article>

<!-- ❌ BAD - Div soup -->
<div class="article">
  <div class="header">
    <div class="title">Title</div>
  </div>
</div>
```

### Link Accessibility

```astro
<!-- ✅ GOOD - Descriptive text -->
<a href="/blog/post-slug">Read the full article about accessibility</a>

<!-- ❌ BAD - Generic text -->
<a href="/blog/post-slug">Click here</a>

<!-- ✅ GOOD - External links -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External resource
</a>

<!-- ✅ GOOD - Icon-only buttons -->
<button aria-label="Close menu">
  <Icon name="close" />
</button>
```

### Image Alt Text

```astro
<!-- ✅ GOOD - Descriptive alt text -->
<Image src={portrait} alt="Pranshu Jawade presenting at a web development conference" />

<!-- ❌ BAD - Non-descriptive -->
<Image src={portrait} alt="image" />

<!-- ✅ GOOD - Decorative images -->
<Image src={decoration} alt="" role="presentation" />
```

---

## Code Comments

### When to Comment

- Complex algorithms or logic
- Non-obvious workarounds
- Public API functions
- Regular expressions
- Magic numbers

```typescript
// ✅ GOOD - Explains WHY
// Dev.to API has a rate limit of 10 requests per 10 seconds
// We add a delay to avoid hitting the limit
await delay(1000);

// ❌ BAD - Explains WHAT (code is self-explanatory)
// Increment counter by 1
counter++;
```

### JSDoc for Public APIs

```typescript
/**
 * Formats a date string for display in blog posts.
 * 
 * @param date - The date to format
 * @param locale - Optional locale string (defaults to 'en-US')
 * @returns Formatted date string like "February 23, 2026"
 * 
 * @example
 * formatDate(new Date('2026-02-23')) // "February 23, 2026"
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

---

## Error Handling

### Explicit Error Handling

```typescript
// ✅ GOOD - Handle errors explicitly
async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await getEntry('blog', slug);
    return post || null;
  } catch (error) {
    console.error(`Failed to fetch blog post: ${slug}`, error);
    return null;
  }
}

// ❌ BAD - Silent failures
async function fetchBlogPost(slug: string) {
  const post = await getEntry('blog', slug);
  return post;
}
```

### Type Guards

```typescript
// ✅ GOOD - Type guard for validation
function isBlogPost(obj: unknown): obj is BlogPost {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'title' in obj &&
    'pubDate' in obj
  );
}

if (isBlogPost(data)) {
  // data is now typed as BlogPost
  console.log(data.title);
}
```

---

## Performance Considerations

### Image Optimization

```astro
<!-- ✅ GOOD - Use Astro's Image component -->
<Image 
  src={heroImage} 
  alt="Description"
  width={1200}
  height={630}
  format="webp"
  quality={80}
/>

<!-- ❌ BAD - Raw img tag -->
<img src="/images/hero.jpg" alt="Description">
```

### Lazy Loading

```astro
<!-- ✅ GOOD - Lazy load below-the-fold images -->
<Image src={thumbnail} alt="Thumbnail" loading="lazy" />

<!-- ✅ GOOD - Eager load hero images -->
<Image src={hero} alt="Hero" loading="eager" />
```

### Minimize Client-Side JS

```astro
<!-- ❌ BAD - Unnecessary client directive -->
<Button client:load />

<!-- ✅ GOOD - Static by default -->
<Button />

<!-- ✅ GOOD - Hydrate only when needed -->
<InteractiveCounter client:visible />
```

---

## Summary Checklist

Before committing code, verify:

- [ ] TypeScript strict mode passes with no errors
- [ ] No `any` types used
- [ ] Props interfaces defined for all components
- [ ] Imports organized correctly
- [ ] File names follow conventions
- [ ] Tailwind utilities used (no inline styles)
- [ ] Semantic HTML elements used
- [ ] Links have proper accessibility attributes
- [ ] Images have descriptive alt text
- [ ] Error handling implemented where needed
- [ ] Comments explain WHY, not WHAT

---

**Reference:** See ARCHITECTURE.md for structural patterns, ACCESSIBILITY.md for WCAG compliance details.
