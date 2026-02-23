# New Blog Post

## Description
Scaffold a new blog post with proper frontmatter, file naming conventions, and content structure for the Astro portfolio.

## When to Use
- User wants to create a new blog post
- User says "write a blog post about [topic]"
- User asks to "start a new blog article"

## Prerequisites
- Project is an Astro 5.x portfolio
- Content collection at `src/content/blog/` exists
- Blog posts follow the naming pattern: `YYYY-MM-slug.mdx`

## Workflow

### 1. Gather Information
Ask the user for the following details:

**Required:**
- **Title**: The blog post title (max 60 characters recommended)
- **Description**: A brief summary (max 160 characters recommended)
- **Tags**: Up to 4 tags, lowercase, comma-separated (e.g., "astro, typescript, web-dev, performance")

**Optional:**
- **Category**: Main category (e.g., "tutorial", "opinion", "case-study")
- **Author**: Author name (defaults to portfolio owner)
- **Custom slug**: Override auto-generated slug

### 2. Generate Slug
- Convert title to lowercase
- Replace spaces with hyphens
- Remove special characters except hyphens
- Example: "Building Fast Sites" → "building-fast-sites"

### 3. Create File Path
Format: `src/content/blog/YYYY-MM-slug.mdx`
- Use current date for YYYY-MM prefix
- Example: `src/content/blog/2026-02-building-fast-sites.mdx`

### 4. Generate Frontmatter Template
```yaml
---
title: "[User-provided title]"
description: "[User-provided description]"
publishDate: [YYYY-MM-DD format, use current date]
draft: true
tags: [tag1, tag2, tag3, tag4]
category: "[category or 'article']"
author: "[author name]"
image:
  src: "" # Add later
  alt: ""
canonicalURL: "" # Will be set on publish
---
```

### 5. Generate Content Template
```mdx
## Introduction

[Write an engaging introduction that hooks the reader]

## Main Content

[Develop the main points here]

### Subsection 1

[Content]

### Subsection 2

[Content]

## Conclusion

[Summarize key takeaways]

---

**Further Reading:**
- [Related article 1]
- [Related article 2]
```

### 6. Create the File
Use the Write tool to create the file at the generated path with complete frontmatter and content template.

### 7. Confirmation
Report to user:
- File path created
- Slug used
- Remind them: "Post is in draft mode. Use content-review skill before publishing."
- Next steps: "Edit content, add images, then set draft: false"

## Rules to Follow
- **ALWAYS** set `draft: true` by default
- **NEVER** exceed 4 tags
- **ALWAYS** use lowercase for tags and slugs
- **ALWAYS** use YYYY-MM- prefix for filename
- **ALWAYS** include all required frontmatter fields
- Check if file already exists before creating (use Glob to search)

## Related Skills
- `content-review` - Review post before publishing
- `syndicate-content` - Cross-post after publishing

## Related Rules
- `CONTENT_GUIDELINES.md` - Content standards
- `SEO_REQUIREMENTS.md` - SEO best practices

## Error Handling
- If `src/content/blog/` doesn't exist, create it with mkdir -p
- If file already exists, ask user to confirm overwrite or choose new slug
- Validate tags count (max 4)
- Validate title length (warn if >60 chars)
- Validate description length (warn if >160 chars)

## Example Interaction

**User:** "Create a blog post about Astro view transitions"

**Agent:** 
"I'll help you create a new blog post about Astro view transitions.

Let me gather some details:
- **Title**: Smooth Page Transitions with Astro View Transitions
- **Description**: Learn how to implement seamless page transitions in Astro 5 for a modern, app-like experience.
- **Tags**: astro, view-transitions, web-animations, ux
- **Category**: tutorial

I'll create the post at: `src/content/blog/2026-02-smooth-page-transitions-with-astro-view-transitions.mdx`

Does this look good? (You can customize any of these fields)"

**After confirmation:**
"✅ Created blog post at `src/content/blog/2026-02-smooth-page-transitions-with-astro-view-transitions.mdx`

The post is in **draft mode**. Next steps:
1. Edit the content and add your tutorial
2. Add a featured image (update frontmatter)
3. Run `content-review` skill before publishing
4. Set `draft: false` when ready
5. Use `syndicate-content` to cross-post to Dev.to/Hashnode"
