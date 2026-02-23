# CONTENT_GUIDELINES.md

**Purpose:** Content creation standards for blog posts, case studies, and data files  
**Scope:** Frontmatter schemas, file naming, writing style, content structure  
**Last Updated:** 2026-02-23

---

## Blog Posts

### File Location
`src/content/blog/`

### File Naming Convention
**Format:** `YYYY-MM-slug.mdx`

**Rules:**
- Date prefix for chronological sorting
- Slug is kebab-case, descriptive, SEO-friendly
- Maximum 3-5 words in slug
- No special characters except hyphens

**Examples:**
```
✅ GOOD
2026-02-building-portfolio.mdx
2026-01-astro-performance.mdx
2025-12-typescript-tips.mdx

❌ BAD
building-portfolio.mdx           # Missing date prefix
2026-02-23-building-portfolio.mdx # Too specific (includes day)
my_post.mdx                      # Underscore instead of hyphen
blog-post-about-web-dev-and-stuff.mdx # Too long
```

---

### Blog Post Frontmatter Schema

```yaml
---
title: "Building a Modern Portfolio with Astro"
description: "Learn how to build a performant, SEO-optimized portfolio using Astro 5 and Tailwind CSS."
pubDate: 2026-02-23
tags: ["astro", "tailwind", "portfolio", "typescript"]
draft: false
featured: false
coverImage: "/images/blog/building-portfolio-cover.jpg"
canonical: "https://pranshujawade.github.io/blog/building-portfolio"
---
```

### Frontmatter Field Requirements

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | ✅ Yes | Max 60 chars | Post title (SEO-optimized) |
| `description` | string | ✅ Yes | Max 160 chars | Meta description |
| `pubDate` | date | ✅ Yes | YYYY-MM-DD | Publication date |
| `tags` | string[] | ✅ Yes | Max 4, lowercase | Topic tags |
| `draft` | boolean | No | Default: false | Hide from production |
| `featured` | boolean | No | Default: false | Show on homepage |
| `coverImage` | string | No | Path or URL | Cover image path |
| `canonical` | string | No | Full URL | Canonical URL |

### Field Guidelines

#### `title`
- **Length**: 50-60 characters (optimal for SEO)
- **Style**: Title case
- **Content**: Clear, descriptive, includes primary keyword
- **No clickbait**: Be descriptive, not sensational

```yaml
✅ GOOD
title: "Building a Modern Portfolio with Astro"
title: "5 TypeScript Tips for Cleaner Code"
title: "Understanding React Server Components"

❌ BAD
title: "You Won't Believe This One Trick!" # Clickbait
title: "Blog Post #17" # Non-descriptive
title: "An Incredibly Comprehensive and Detailed Guide to Everything About Modern Web Development" # Too long
```

#### `description`
- **Length**: 150-160 characters (optimal for search snippets)
- **Style**: Complete sentence(s)
- **Content**: Expands on title, includes secondary keywords
- **CTA**: Can end with value proposition or question

```yaml
✅ GOOD
description: "Learn how to build a performant, SEO-optimized portfolio using Astro 5 and Tailwind CSS. Includes deployment guide."

❌ BAD
description: "A post about Astro" # Too short
description: "This is a really long description that goes on and on about building portfolios and includes way too much detail that will get cut off in search results anyway" # Too long
```

#### `pubDate`
- **Format**: ISO 8601 date (YYYY-MM-DD)
- **Timezone**: Date only, no time (avoids timezone issues)
- **Backdating**: Use actual publish date, not content creation date

```yaml
✅ GOOD
pubDate: 2026-02-23

❌ BAD
pubDate: "February 23, 2026" # Wrong format
pubDate: 2026-02-23T14:30:00Z # Unnecessary time
```

#### `tags`
- **Limit**: Maximum 4 tags (Dev.to limit)
- **Case**: Always lowercase
- **Specificity**: Balance broad and specific tags
- **Consistency**: Reuse existing tags when possible

```yaml
✅ GOOD
tags: ["astro", "typescript", "portfolio", "seo"]
tags: ["react", "performance", "hooks"]

❌ BAD
tags: ["Astro", "TypeScript"] # Not lowercase
tags: ["web", "dev", "code", "programming", "javascript"] # More than 4
tags: ["a"] # Too generic
```

**Common Tags to Use:**
- Frontend: `react`, `vue`, `astro`, `typescript`, `javascript`
- Styling: `css`, `tailwind`, `sass`
- Backend: `node`, `api`, `database`
- Concepts: `performance`, `accessibility`, `seo`, `testing`
- Career: `career`, `portfolio`, `learning`

#### `draft`
- **Usage**: Set to `true` for unpublished posts
- **Behavior**: Filtered out in production queries
- **Local dev**: Visible locally for preview

```yaml
✅ GOOD
draft: false # Published
draft: true  # Work in progress

❌ BAD
draft: "no" # Should be boolean
```

#### `featured`
- **Usage**: Highlight on homepage or featured section
- **Limit**: Maximum 3-4 featured posts recommended
- **Selection**: Your best/most recent content

```yaml
featured: true  # Show on homepage
featured: false # Normal listing only
```

#### `coverImage`
- **Path**: Relative to `public/` or imported asset
- **Format**: WebP preferred, JPG/PNG acceptable
- **Dimensions**: 1200x630px (Open Graph standard)
- **Size**: < 200KB after optimization

```yaml
✅ GOOD
coverImage: "/images/blog/post-cover.jpg"
coverImage: "../assets/cover.webp"

❌ BAD
coverImage: "cover.jpg" # No path
```

#### `canonical`
- **Usage**: Set to portfolio URL (this is the source)
- **Syndication**: Use this same URL when syndicating
- **Format**: Full URL including protocol

```yaml
✅ GOOD
canonical: "https://pranshujawade.github.io/blog/building-portfolio"

❌ BAD
canonical: "/blog/building-portfolio" # Relative URL
canonical: "pranshujawade.github.io/blog/post" # Missing protocol
```

---

### Blog Post Content Structure

```markdown
---
frontmatter here
---

# Main Title (H1) - Automatically rendered from frontmatter

Brief introduction paragraph (2-3 sentences) that hooks the reader and explains what they'll learn.

## Section 1: Core Concept (H2)

Content explaining the first major point. Use short paragraphs (3-4 lines max).

### Subsection if needed (H3)

More detailed explanation.

```typescript
// Code examples with syntax highlighting
const example = "Well-commented, production-ready code";
\```

## Section 2: Implementation (H2)

Step-by-step guidance with examples.

## Section 3: Best Practices (H2)

Tips and recommendations.

## Conclusion

Summary and call-to-action (next steps, related posts, etc.).

---

**Note:** You can comment or reach out at [contact info].
\```

### Content Writing Guidelines

#### Tone & Voice
- **Professional but approachable**: Not stuffy, not overly casual
- **Second person**: "You can build..." not "One can build..."
- **Active voice**: "Astro renders..." not "Pages are rendered by..."
- **No jargon without explanation**: Define technical terms

#### Paragraph Length
- **Maximum**: 3-4 lines per paragraph
- **Break up**: Long paragraphs hurt readability
- **White space**: Essential for web reading

#### Code Examples
- **Always specify language**: \```typescript not \```
- **Keep concise**: 10-20 lines max per snippet
- **Add comments**: Explain non-obvious code
- **Show context**: Include imports if relevant

```markdown
✅ GOOD
\```typescript
// Fetch published blog posts sorted by date
export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
\```

❌ BAD
\```
posts.filter(p => !p.draft)
\```
```

#### Images in Content
- **Alt text**: Always required, descriptive
- **Captions**: Use for context when helpful
- **Optimization**: Use Astro's Image component when possible

```markdown
✅ GOOD
![Astro project structure showing src, pages, and components directories](./images/astro-structure.png)

❌ BAD
![image](./img.png)
```

#### Links
- **Descriptive text**: Not "click here"
- **External links**: Open in new tab with proper rel attributes
- **Internal links**: Relative URLs

```markdown
✅ GOOD
Check out the [official Astro documentation](https://docs.astro.build) for more details.

❌ BAD
Click [here](https://docs.astro.build) for more info.
```

---

## Case Studies

### File Location
`src/content/case-studies/`

### File Naming Convention
**Format:** `project-name.mdx`

**Rules:**
- Kebab-case
- Project or client name (or descriptive identifier)
- No date prefix (unlike blog posts)

**Examples:**
```
✅ GOOD
ecommerce-redesign.mdx
task-management-app.mdx
portfolio-website.mdx

❌ BAD
case-study-1.mdx      # Non-descriptive
EcommerceRedesign.mdx # Not kebab-case
```

---

### Case Study Frontmatter Schema

```yaml
---
title: "E-Commerce Platform Redesign"
tagline: "Increasing conversion rates through UX improvements"
description: "Complete redesign of checkout flow and product pages for a mid-size e-commerce platform."
technologies: ["React", "TypeScript", "Tailwind CSS", "Stripe", "Next.js"]
role: "Frontend Developer"
duration: "3 months"
featured: true
sortOrder: 1
results:
  - "32% increase in conversion rate"
  - "45% reduction in cart abandonment"
  - "2.1s improvement in page load time"
liveUrl: "https://example.com"
githubUrl: "https://github.com/username/project"
---
```

### Case Study Field Requirements

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | ✅ Yes | - | Project name |
| `tagline` | string | ✅ Yes | Max 100 chars | One-line summary |
| `description` | string | ✅ Yes | Max 160 chars | Detailed summary |
| `technologies` | string[] | ✅ Yes | - | Tech stack used |
| `role` | string | ✅ Yes | - | Your role in project |
| `duration` | string | ✅ Yes | - | Project timeline |
| `featured` | boolean | No | Default: false | Highlight on homepage |
| `sortOrder` | number | ✅ Yes | Unique | Display order |
| `results` | string[] | ✅ Yes | 3-5 items | Quantifiable outcomes |
| `liveUrl` | string | No | Full URL | Live site link |
| `githubUrl` | string | No | Full URL | Source code link |

### Case Study Field Guidelines

#### `tagline`
- **Length**: 50-100 characters
- **Focus**: Value delivered or problem solved
- **Style**: Active, results-oriented

```yaml
✅ GOOD
tagline: "Increasing conversion rates through UX improvements"
tagline: "Building a real-time collaboration platform"

❌ BAD
tagline: "A project I worked on" # Vague
```

#### `technologies`
- **Order**: Most important/prominent first
- **Specificity**: Include frameworks, languages, key libraries
- **Limit**: 5-8 technologies (don't list everything)

```yaml
✅ GOOD
technologies: ["React", "TypeScript", "Tailwind CSS", "Stripe"]

❌ BAD
technologies: ["JavaScript", "HTML", "CSS", "Git", "VS Code"] # Too generic/trivial
```

#### `role`
- **Be specific**: Not just "Developer"
- **Include level if relevant**: "Senior", "Lead", etc.

```yaml
✅ GOOD
role: "Frontend Developer"
role: "Full-Stack Developer (Solo Project)"
role: "Lead Frontend Developer"

❌ BAD
role: "Worked on it" # Too vague
```

#### `duration`
- **Format**: Human-readable
- **Precision**: Months for longer projects, weeks for shorter

```yaml
✅ GOOD
duration: "3 months"
duration: "6 weeks"
duration: "1 year (part-time)"

❌ BAD
duration: "90 days" # Too precise
duration: "A while" # Too vague
```

#### `sortOrder`
- **Purpose**: Control display order on case studies page
- **Lower numbers first**: 1, 2, 3...
- **Featured projects**: Give lower numbers

```yaml
featured: true
sortOrder: 1  # Shows first
```

#### `results`
- **Quantify**: Use numbers, percentages, metrics
- **Be specific**: Not "improved performance"
- **3-5 items**: Quality over quantity

```yaml
✅ GOOD
results:
  - "32% increase in conversion rate"
  - "45% reduction in cart abandonment"
  - "2.1s improvement in page load time"
  - "Generated $50K additional monthly revenue"

❌ BAD
results:
  - "Made it faster" # Not quantified
  - "Users loved it" # Vague
```

---

### Case Study Content Structure

```markdown
---
frontmatter here
---

## Overview

Brief project summary (2-3 paragraphs):
- What was the project?
- What problem did it solve?
- Who was it for?

## Challenge

Description of the problem or requirements:
- Business context
- Technical constraints
- User pain points

## Solution

Your approach to solving the problem:
- Architecture decisions
- Technology choices
- Key features implemented

## Implementation

Technical details (optional, for complex projects):
- System architecture
- Interesting technical challenges
- Code examples (if applicable)

## Results

Outcomes and impact:
- Metrics and KPIs
- User feedback
- Business impact

## Lessons Learned

Reflections:
- What went well
- What you'd do differently
- Skills gained
```

---

## Data Files

### File Location
`src/content/data/`

### Format
JSON files for structured data (skills, experience, education, etc.)

### Example: Skills

```json
{
  "categories": [
    {
      "name": "Frontend Development",
      "skills": [
        {
          "name": "TypeScript",
          "level": "Advanced",
          "yearsOfExperience": 3
        },
        {
          "name": "React",
          "level": "Advanced",
          "yearsOfExperience": 4
        },
        {
          "name": "Astro",
          "level": "Intermediate",
          "yearsOfExperience": 1
        }
      ]
    },
    {
      "name": "Styling",
      "skills": [
        {
          "name": "Tailwind CSS",
          "level": "Advanced",
          "yearsOfExperience": 2
        },
        {
          "name": "CSS/SCSS",
          "level": "Advanced",
          "yearsOfExperience": 5
        }
      ]
    }
  ]
}
```

### Example: Experience

```json
{
  "positions": [
    {
      "title": "Senior Frontend Developer",
      "company": "Tech Company Inc.",
      "location": "Remote",
      "startDate": "2024-01",
      "endDate": null,
      "current": true,
      "description": "Lead frontend development for SaaS product serving 10K+ users.",
      "achievements": [
        "Reduced page load time by 40% through code splitting",
        "Implemented design system used across 3 products"
      ],
      "technologies": ["React", "TypeScript", "Tailwind CSS"]
    }
  ]
}
```

---

## Content Quality Checklist

Before publishing blog posts or case studies:

### Technical
- [ ] Frontmatter validates against schema
- [ ] All required fields present
- [ ] Tags are lowercase and max 4
- [ ] Image paths are correct
- [ ] Code examples have syntax highlighting

### SEO
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Canonical URL is set
- [ ] Cover image is optimized (< 200KB)
- [ ] All images have alt text

### Content
- [ ] No spelling or grammar errors
- [ ] Paragraphs are 3-4 lines max
- [ ] Headers are hierarchical (H2 → H3, not skipping)
- [ ] Links are descriptive
- [ ] Code examples are clear and commented
- [ ] Tone is professional but approachable

### Accessibility
- [ ] All images have descriptive alt text
- [ ] Links have meaningful text
- [ ] Code examples are readable
- [ ] Heading hierarchy is logical

---

## Content Maintenance

### Updating Posts
- Update `pubDate` only when first published
- Add update note at top if significantly changed:

```markdown
> **Update (2026-03-15):** Added section on Astro 5.1 features.
```

### Deprecating Content
- Set `draft: true` to hide from listings
- Add deprecation notice at top:

```markdown
> **Deprecated:** This post covers Astro 4.x. See the [updated version](/blog/new-post) for Astro 5.x.
```

---

## Summary

**Blog Posts:**
- File: `YYYY-MM-slug.mdx`
- Max 4 tags, lowercase
- Title ≤ 60 chars, description ≤ 160 chars
- Always set canonical URL

**Case Studies:**
- File: `project-name.mdx`
- Include quantified results
- Use sortOrder for display control
- Highlight featured projects

**General:**
- Professional, approachable tone
- Short paragraphs
- Descriptive alt text
- Proper heading hierarchy

**Reference:**
- ARCHITECTURE.md for content collections
- SEO_REQUIREMENTS.md for meta tags
- CODING_STANDARDS.md for code examples
