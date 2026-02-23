# Syndicate Content

## Description
Cross-post published blog posts to Dev.to and Hashnode with proper canonical URL tracking and state management.

## When to Use
- User wants to share a blog post on Dev.to or Hashnode
- User says "syndicate [post-name]"
- User asks to "cross-post to dev.to"
- After publishing a blog post that's ready for wider distribution

## Prerequisites
- Blog post must exist in `src/content/blog/`
- Blog post must have `draft: false` (published)
- Syndication script at `scripts/syndicate.mjs` must exist
- State tracking file at `.data/syndication-state.json`
- API keys configured for Dev.to and/or Hashnode (in environment variables)

## Workflow

### 1. Validate Blog Post
Before syndicating, verify:

```bash
# Read the blog post file
# Check frontmatter for:
# - draft: false (must be published)
# - title (required)
# - description (required)
# - tags (required, max 4)
# - publishDate (required)
```

**Validation checks:**
- ✅ Post is published (`draft: false`)
- ✅ Has title and description
- ✅ Has at least one tag (max 4)
- ✅ Has publishDate in the past or today

If validation fails, inform user and stop.

### 2. Confirm Canonical URL
The canonical URL must point to the portfolio:
```
https://pranshujawade.github.io/blog/[slug]
```

Where `[slug]` is extracted from the filename (remove `YYYY-MM-` prefix).

Example:
- File: `2026-02-building-fast-sites.mdx`
- Slug: `building-fast-sites`
- Canonical: `https://pranshujawade.github.io/blog/building-fast-sites`

**Confirm with user:**
"I'll syndicate this post with canonical URL pointing to your portfolio:
`https://pranshujawade.github.io/blog/[slug]`

This ensures SEO credit goes to your portfolio. Proceed?"

### 3. Run Syndication Script
Execute the syndication script:

```bash
node scripts/syndicate.mjs [filepath]
```

Example:
```bash
node scripts/syndicate.mjs src/content/blog/2026-02-building-fast-sites.mdx
```

### 4. Check Syndication State
After running the script, check `.data/syndication-state.json`:

```bash
cat .data/syndication-state.json
```

The state file tracks:
```json
{
  "posts": {
    "building-fast-sites": {
      "devto": {
        "id": "123456",
        "url": "https://dev.to/username/building-fast-sites-abc",
        "syndicatedAt": "2026-02-23T10:30:00Z"
      },
      "hashnode": {
        "id": "abc123",
        "url": "https://username.hashnode.dev/building-fast-sites",
        "syndicatedAt": "2026-02-23T10:30:00Z"
      }
    }
  }
}
```

### 5. Report Results
Inform user of syndication status:

**Success:**
```
✅ Post syndicated successfully!

**Syndication Summary:**
- Dev.to: [URL]
- Hashnode: [URL]
- Canonical URL: https://pranshujawade.github.io/blog/[slug]

**State tracked in:** .data/syndication-state.json

The post is now live on external platforms with proper canonical attribution to your portfolio.
```

**Partial Success:**
```
⚠️ Partial syndication completed

**Successfully syndicated to:**
- Dev.to: [URL]

**Failed to syndicate to:**
- Hashnode: [Error message]

Check API credentials and try again for failed platforms.
```

**Failure:**
```
❌ Syndication failed

**Error:** [Error message]

**Troubleshooting:**
- Verify API keys are set in environment variables
- Check post frontmatter is complete
- Ensure post is published (draft: false)
- Check network connectivity
```

## Rules to Follow
- **NEVER** syndicate draft posts
- **ALWAYS** set canonical URL to portfolio: `https://pranshujawade.github.io/blog/[slug]`
- **ALWAYS** check `.data/syndication-state.json` after syndication
- **NEVER** syndicate a post twice to the same platform (check state first)
- **ALWAYS** verify post is published before syndicating
- Tag limits: Dev.to max 4 tags, Hashnode max 5 (use first 4 from frontmatter)

## Pre-Syndication Checklist
Before running syndication:
- [ ] Post has `draft: false`
- [ ] Post is live on portfolio site
- [ ] Title is compelling and accurate
- [ ] Description is SEO-optimized (max 160 chars)
- [ ] Tags are relevant (max 4, lowercase)
- [ ] Images have proper alt text
- [ ] Internal links use full URLs (not relative paths)
- [ ] Code blocks have language syntax highlighting
- [ ] Canonical URL is set to portfolio

## Related Skills
- `new-blog-post` - Create blog posts to syndicate
- `content-review` - Review before syndicating
- `audit-seo` - Ensure proper SEO before syndication

## Related Rules
- `CONTENT_GUIDELINES.md` - Content quality standards
- `SEO_REQUIREMENTS.md` - Canonical URL requirements

## Error Handling

### Post Not Found
```
❌ Error: Post not found at [filepath]

Please provide the full path to the blog post:
Example: src/content/blog/2026-02-my-post.mdx
```

### Draft Post
```
❌ Error: Cannot syndicate draft posts

This post has `draft: true` in frontmatter. 
Please publish it first by setting `draft: false`, then try syndicating.
```

### Missing Canonical URL
```
❌ Error: Canonical URL not set

For SEO, the canonical URL must be set to:
https://pranshujawade.github.io/blog/[slug]

I'll add this automatically before syndicating.
```

### Already Syndicated
```
⚠️ Warning: Post already syndicated

According to .data/syndication-state.json, this post was already syndicated:
- Dev.to: [URL] (on [date])
- Hashnode: [URL] (on [date])

Do you want to update the existing posts or skip? 
(Note: Most platforms don't allow duplicate posts)
```

### API Errors
```
❌ Error: [Platform] API error

[Error message from platform]

**Troubleshooting:**
- Check API key for [platform] in environment variables
- Verify API key has write permissions
- Check platform API status
- Review rate limits
```

## Example Interaction

**User:** "Syndicate my Astro view transitions post"

**Agent:**
"I'll syndicate your Astro view transitions post. Let me find it first..."

[Searches for matching post]

"Found: `src/content/blog/2026-02-smooth-page-transitions-with-astro-view-transitions.mdx`

**Pre-syndication checks:**
✅ Post is published (draft: false)
✅ Has title: 'Smooth Page Transitions with Astro View Transitions'
✅ Has description (158 chars)
✅ Has 4 tags: astro, view-transitions, web-animations, ux
✅ Published on: 2026-02-20

**Canonical URL:** https://pranshujawade.github.io/blog/smooth-page-transitions-with-astro-view-transitions

This will cross-post to Dev.to and Hashnode with canonical attribution to your portfolio. Proceed? (yes/no)"

**User:** "yes"

**Agent:**
"Syndicating..."

[Runs node scripts/syndicate.mjs ...]

"✅ Post syndicated successfully!

**Live on:**
- 📝 Dev.to: https://dev.to/pranshujawade/smooth-page-transitions-with-astro-view-transitions
- 📝 Hashnode: https://pranshujawade.hashnode.dev/smooth-page-transitions-with-astro-view-transitions

**Canonical URL:** https://pranshujawade.github.io/blog/smooth-page-transitions-with-astro-view-transitions (SEO credit to portfolio)

Syndication state tracked in `.data/syndication-state.json` ✓"
