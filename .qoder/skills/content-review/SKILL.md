# Content Review

## Description
Review blog posts, case studies, or other content before publishing, checking for completeness, quality, SEO optimization, and adherence to content guidelines.

## When to Use
- Before setting `draft: false` on any content
- User asks to "review this post" or "check my content"
- After writing new content
- Before syndication to external platforms
- Periodic content quality audits

## Prerequisites
- Content exists in `src/content/blog/` or `src/content/case-studies/`
- Content has frontmatter with required fields

## Workflow

### 1. Identify Content to Review
Ask user which content to review:

```
What would you like me to review?

Options:
- Specific post: "Review blog/2026-02-my-post.mdx"
- Latest post: "Review my latest blog post"
- All drafts: "Review all draft posts"
- Specific case study: "Review case-studies/project-name.mdx"
```

### 2. Read the Content
```bash
cat src/content/blog/2026-02-post-slug.mdx
```

Parse both:
- **Frontmatter**: YAML between `---` delimiters
- **Content**: MDX/Markdown body

### 3. Review Categories

#### **A. Frontmatter Completeness**
Check all required fields are present and valid:

**For Blog Posts:**
- ✅ `title` (required, string)
- ✅ `description` (required, string)
- ✅ `publishDate` (required, date)
- ✅ `draft` (required, boolean)
- ✅ `tags` (required, array, 1-4 items)
- Optional: `category`, `author`, `image`, `canonicalURL`

**For Case Studies:**
- ✅ `title` (required)
- ✅ `tagline` (required)
- ✅ `publishDate` (required)
- ✅ `draft` (required)
- ✅ `role` (required)
- ✅ `duration` (required)
- ✅ `technologies` (required, array)
- Optional: `client`, `teamSize`, `url`, `github`, `image`, `gallery`

**Validation:**
- ❌ Error if any required field is missing
- ⚠️ Warn if optional but recommended fields are missing (e.g., `image`)

#### **B. Frontmatter Quality**
Check quality and SEO of frontmatter values:

**Title:**
- ✅ Between 30-60 characters (optimal for SEO)
- ✅ Compelling and descriptive
- ✅ No clickbait or misleading phrasing
- ✅ Proper capitalization (Title Case)
- ⚠️ Warn if < 30 or > 60 characters
- ⚠️ Warn if all caps or all lowercase

**Description:**
- ✅ Between 120-160 characters (optimal for meta description)
- ✅ Includes target keywords naturally
- ✅ Compelling and informative
- ✅ No keyword stuffing
- ⚠️ Warn if < 120 or > 160 characters
- ❌ Error if missing or < 50 characters

**Tags:**
- ✅ 1-4 tags (most platforms limit to 4)
- ✅ All lowercase
- ✅ Relevant to content
- ✅ Use hyphens for multi-word tags (e.g., "web-dev")
- ⚠️ Warn if > 4 tags (some platforms won't accept all)
- ⚠️ Warn if tags not lowercase
- ⚠️ Warn if tags too generic ("coding", "programming")

**Dates:**
- ✅ `publishDate` in ISO format (YYYY-MM-DD)
- ✅ `publishDate` is not in the future (unless intentional scheduling)
- ⚠️ Warn if publish date > 1 week in future

**Images:**
- ✅ Image src is valid path or URL
- ✅ Image alt text is descriptive (not "image")
- ⚠️ Warn if no featured image (recommended for SEO/social)

#### **C. Content Structure**
Analyze the content body for structure:

**Headings:**
- ✅ Proper heading hierarchy (## → ### → ####)
- ✅ No skipping levels
- ✅ Headings are descriptive
- ✅ At least 2-3 headings (for scanability)
- ⚠️ Warn if no headings (wall of text)
- ⚠️ Warn if heading hierarchy is broken

**Length:**
- ✅ Blog posts: 500-2000 words (optimal)
- ✅ Case studies: 800-2500 words (optimal)
- ⚠️ Warn if < 300 words (too short for SEO)
- ⚠️ Warn if > 3000 words (may need breaking up)

**Paragraphs:**
- ✅ Short paragraphs (2-4 sentences)
- ✅ Not walls of text
- ⚠️ Warn if any paragraph > 10 lines

**Code Blocks:**
- ✅ Code blocks have language syntax (```typescript not just ```)
- ✅ Code is formatted and readable
- ⚠️ Warn if code blocks > 50 lines (consider linking to GitHub)

**Links:**
- ✅ Internal links use full URLs for syndication
- ✅ External links are relevant and authoritative
- ✅ No broken links (check if possible)
- ⚠️ Warn if no links (adds value to reference sources)

#### **D. Content Quality**
Assess the actual content:

**Introduction:**
- ✅ Has clear introduction (first 1-2 paragraphs)
- ✅ Sets context and hooks reader
- ✅ States what reader will learn
- ⚠️ Warn if jumps straight into technical details

**Body:**
- ✅ Logical flow and structure
- ✅ Each section has clear purpose
- ✅ Examples and code snippets where appropriate
- ✅ Explains "why" not just "how"

**Conclusion:**
- ✅ Has conclusion or summary section
- ✅ Recaps key takeaways
- ⚠️ Warn if no conclusion (content feels incomplete)

**Tone:**
- ✅ Professional but approachable
- ✅ Clear and concise
- ✅ No typos or obvious grammar errors
- ⚠️ Suggest proofreading if many grammar issues

#### **E. SEO Optimization**
Check SEO best practices:

**Keywords:**
- ✅ Target keyword appears in title
- ✅ Target keyword appears in description
- ✅ Target keyword appears naturally in content
- ✅ No keyword stuffing (appears naturally)
- ⚠️ Warn if keyword density > 3% (spammy)

**Internal Linking:**
- ✅ Links to other relevant blog posts or case studies
- ✅ Uses descriptive anchor text (not "click here")
- ⚠️ Recommend adding internal links if none

**External Linking:**
- ✅ Links to authoritative sources where appropriate
- ✅ External links open in new tab or same tab (consistent)
- ⚠️ Recommend adding references/sources

**Images:**
- ✅ Images have descriptive alt text
- ✅ Images are optimized (webp, reasonable size)
- ⚠️ Warn if images lack alt text (bad for SEO + a11y)

#### **F. Readability**
Assess readability:

**Sentence Length:**
- ✅ Mix of short and long sentences
- ⚠️ Warn if many sentences > 25 words (hard to read)

**Vocabulary:**
- ✅ Appropriate for target audience
- ✅ Technical terms explained when first introduced
- ⚠️ Warn if overly complex without definitions

**Formatting:**
- ✅ Uses bold/italic for emphasis
- ✅ Uses lists (bullet points, numbered) for scanability
- ✅ Uses blockquotes for callouts
- ⚠️ Recommend formatting improvements if plain text

### 4. Generate Review Report
Compile findings into actionable report:

```
📝 Content Review Report
Content: [Title]
Type: [Blog Post / Case Study]
Status: [Draft / Published]
Generated: [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSED (8/10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Frontmatter Completeness
   ✅ All required fields present

2. Frontmatter Quality
   ✅ Title: "Building Fast Sites with Astro" (45 chars) ✅
   ✅ Description: 155 chars ✅
   ✅ Tags: 4 tags, all lowercase ✅

3. Content Structure
   ✅ Proper heading hierarchy
   ✅ 1,250 words (optimal length)
   ✅ Code blocks have syntax highlighting

4. Content Quality
   ✅ Clear introduction
   ✅ Logical flow
   ✅ Has conclusion

5. SEO Optimization
   ✅ Target keyword in title and description
   ✅ 3 internal links
   ✅ 5 external references

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ WARNINGS (3 issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Frontmatter
   ⚠️ No featured image set (recommended for SEO/social sharing)

2. Content Quality
   ⚠️ Paragraph at line 45 is very long (12 sentences)
      Consider breaking into multiple paragraphs

3. SEO
   ⚠️ Image at line 78 has generic alt text: "screenshot"
      Suggested: "Astro build output showing optimized bundle sizes"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ERRORS (0 critical issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No critical errors found! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Recommendations Before Publishing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority: HIGH
1. Add a featured image to frontmatter

Priority: MEDIUM
2. Break up long paragraph at line 45
3. Improve alt text for screenshot

Priority: LOW
(None)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Content Score: 85/100 (Good)

✅ Ready to publish after addressing HIGH priority items

**Next steps:**
1. Fix HIGH priority items
2. Set draft: false
3. Run `audit-seo` skill (optional but recommended)
4. Deploy with `deploy-portfolio` skill
5. Syndicate with `syndicate-content` skill
```

### 5. Offer to Fix Issues
After presenting the report:

```
Would you like me to fix any of these issues?

I can:
- Add a featured image placeholder to frontmatter
- Break up long paragraphs
- Improve alt text
- Add internal links to related posts
- Fix any other content issues
```

## Rules to Follow
- **ALWAYS** read the full content before reviewing
- **ALWAYS** check frontmatter completeness first
- **ALWAYS** validate dates are in ISO format
- **ALWAYS** check SEO optimization (title, description, keywords)
- **NEVER** approve content with missing required fields
- **NEVER** approve content without description or < 50 char description
- **ALWAYS** recommend improvements tactfully

## Related Skills
- `new-blog-post` - Create posts to review
- `new-case-study` - Create case studies to review
- `audit-seo` - SEO validation before publishing
- `syndicate-content` - Cross-post after review

## Related Rules
- `CONTENT_GUIDELINES.md` - Content quality standards
- `SEO_REQUIREMENTS.md` - SEO requirements

## Review Checklist (Quick Reference)
**Before marking any content as ready:**
- [ ] All required frontmatter fields present
- [ ] Title 30-60 characters
- [ ] Description 120-160 characters
- [ ] 1-4 tags, all lowercase
- [ ] Featured image set (or placeholder)
- [ ] Proper heading hierarchy
- [ ] At least 500 words (blog) or 800 words (case study)
- [ ] Has introduction and conclusion
- [ ] Code blocks have language syntax
- [ ] Images have descriptive alt text
- [ ] Internal/external links present
- [ ] No obvious typos or grammar errors

## Example Interaction

**User:** "Review my latest blog post"

**Agent:**
"I'll review your latest blog post. Let me find it...

[Searches for latest post]

Found: `src/content/blog/2026-02-astro-view-transitions.mdx`

Reviewing...

[Analyzes frontmatter, content structure, quality, SEO, readability]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Content Review Report
Content: "Smooth Page Transitions with Astro"
Type: Blog Post
Status: Draft
Generated: 2026-02-23

[Full detailed report]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Content Score: 85/100 (Good)

Found 3 warnings but no critical errors:
1. No featured image (HIGH priority)
2. Long paragraph at line 45 (MEDIUM)
3. Generic alt text for screenshot (MEDIUM)

Would you like me to fix these issues before you publish?"

**User:** "yes please"

**Agent:**
"I'll fix these issues...

[Adds featured image placeholder to frontmatter]
[Breaks up long paragraph]
[Improves alt text]

✅ Issues fixed!

**Changes made:**
1. Added featured image path to frontmatter (you'll need to add the actual image)
2. Split long paragraph into 3 shorter paragraphs
3. Updated screenshot alt text: 'Astro View Transitions API code example showing navigation configuration'

Running review again to verify...

[Re-runs review]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Content Score: 95/100 (Excellent)

✅ Ready to publish!

**Next steps:**
1. Add the actual featured image at the path I specified
2. Set draft: false to publish
3. Run `audit-seo` for final SEO check
4. Deploy with `deploy-portfolio`
5. Syndicate to Dev.to/Hashnode with `syndicate-content`

Your post is looking great! 🎉"
