# SYNDICATION.md

**Purpose:** Content syndication strategy, platform APIs, canonical URLs, and automation  
**Scope:** Dev.to, Hashnode, Medium, LinkedIn, syndication workflows, MDX sanitization  
**Last Updated:** 2026-02-23

---

## Syndication Philosophy

### Canonical URL is NON-NEGOTIABLE

**Your portfolio is ALWAYS the canonical source.**

This means:
- Publish on portfolio first
- Wait 24-48 hours for Google to index
- Then syndicate to other platforms with canonical URL pointing back to portfolio
- Never let syndication platforms claim originality

**Why this matters:**
- SEO: Avoids duplicate content penalties
- Authority: Portfolio is the authoritative source
- Control: You own the content and its primary location
- Traffic: Drives visitors back to your portfolio

---

## Syndication Platforms

### Supported Platforms

| Platform | Method | Canonical Support | Status |
|----------|--------|------------------|--------|
| **Dev.to** | REST API | ✅ Yes (`canonical_url`) | Automated |
| **Hashnode** | GraphQL API | ✅ Yes (`originalArticleURL`) | Automated |
| **Medium** | Import Tool | ⚠️ Manual (`rel=canonical` sometimes added) | Manual only |
| **LinkedIn** | Share Link | ❌ No (just a link share) | Manual share |

### Dev.to (Automated)

**API Documentation:** https://developers.forem.com/api/v1

#### Authentication
- API Key stored in GitHub Secrets: `DEVTO_API_KEY`
- Get key from: https://dev.to/settings/extensions (API Keys section)

#### Canonical URL Field
```json
{
  "article": {
    "title": "Post Title",
    "body_markdown": "# Content...",
    "published": true,
    "canonical_url": "https://pranshujawade.github.io/blog/post-slug"
  }
}
```

#### Rate Limits
- **10 requests per 10 seconds** per API key
- **429 Too Many Requests** if exceeded
- **Solution**: Add delays between requests in scripts

#### Tag Limits
- **Maximum 4 tags** per article
- **Lowercase only**
- **No spaces** (use hyphens)

```javascript
// ✅ GOOD
tags: ["astro", "typescript", "webdev", "tutorial"]

// ❌ BAD
tags: ["Astro", "TypeScript", "Web Dev", "Tutorial", "JavaScript"] // 5 tags, mixed case, spaces
```

### Hashnode (Automated)

**API Documentation:** https://apidocs.hashnode.com/

#### Authentication
- Personal Access Token (PAT) in GitHub Secrets: `HASHNODE_PAT`
- Publication ID in GitHub Secrets: `HASHNODE_PUBLICATION_ID`
- Get PAT from: Settings > Developer > Generate New Token

#### Canonical URL Field
```graphql
mutation PublishPost($input: PublishPostInput!) {
  publishPost(input: $input) {
    post {
      id
      title
      slug
    }
  }
}

# Variables
{
  "input": {
    "title": "Post Title",
    "contentMarkdown": "# Content...",
    "publicationId": "PUBLICATION_ID",
    "originalArticleURL": "https://pranshujawade.github.io/blog/post-slug"
  }
}
```

#### Rate Limits
- **500 mutations per minute**
- Much more generous than Dev.to

#### Tag Requirements
- More flexible than Dev.to
- Can create custom tags
- No strict limits on count

### Medium (Manual Only)

**Why manual?** Medium's API is restricted to Medium partners and has limited public access.

#### Import Process
1. Publish on portfolio
2. Go to Medium > Stories > Import a story
3. Enter portfolio URL
4. Medium will attempt to preserve canonical URL
5. Verify canonical tag was added: View source and search for `rel="canonical"`

**Note:** Medium sometimes doesn't add canonical URL correctly. Check manually.

### LinkedIn (Manual Share)

LinkedIn doesn't support canonical URLs, but you can:
1. Share the portfolio link directly
2. Add context in the post text
3. Use relevant hashtags

**Not syndication**, just promotion:
```
I wrote about building modern portfolios with Astro 🚀

Key takeaways:
- Static-first architecture
- Optimal performance
- SEO-friendly by default

Read the full article: [portfolio link]

#WebDevelopment #Astro #Frontend
```

---

## Syndication Timing

### Why Wait 24-48 Hours?

**Google needs time to index your original content first:**

1. **Publish on portfolio** (e.g., Monday 9am)
2. **Google indexes** (typically within 24 hours)
3. **Syndicate to Dev.to/Hashnode** (e.g., Wednesday 9am)
4. **Canonical URL tells Google**: Portfolio is the original

**If you syndicate immediately:**
- Google might see Dev.to first (they crawl frequently)
- Could treat portfolio as the duplicate instead
- Canonical URL helps, but timing reduces risk

### Optimal Schedule

```
Day 1 (Monday): Publish on portfolio
Day 1 (Monday): Submit to Google Search Console (optional, speeds indexing)
Day 2-3 (Tuesday-Wednesday): Wait for indexing
Day 3 (Wednesday): Syndicate to Dev.to and Hashnode
Day 4+ (Thursday+): Share on LinkedIn, Twitter, etc.
```

---

## MDX Sanitization

### Why Sanitize?

MDX on your portfolio may include:
- Astro components (`<Image />`, custom components)
- Import statements
- Relative URLs
- Astro-specific syntax

**Syndication platforms expect:**
- Pure Markdown
- No component imports
- Absolute URLs
- Standard Markdown syntax

### Sanitization Requirements

#### 1. Strip Import Statements

```markdown
❌ ORIGINAL (Portfolio)
---
import { Image } from 'astro:assets';
import CustomComponent from '@components/CustomComponent.astro';
---

✅ SANITIZED (Syndication)
---
(imports removed)
---
```

#### 2. Convert Astro Components

```markdown
❌ ORIGINAL
<Image src={heroImage} alt="Hero" width={1200} height={630} />

✅ SANITIZED
![Hero](https://pranshujawade.github.io/images/blog/hero.jpg)
```

#### 3. Resolve Relative URLs

```markdown
❌ ORIGINAL
[Read more](/blog/related-post)
![Image](../images/diagram.png)

✅ SANITIZED
[Read more](https://pranshujawade.github.io/blog/related-post)
![Image](https://pranshujawade.github.io/images/blog/diagram.png)
```

#### 4. Remove JSX/Astro Syntax

```markdown
❌ ORIGINAL
<div class="callout">
  {showAlert && <Alert message={alertText} />}
</div>

✅ SANITIZED
> **Note:** Important information here.
```

### Sanitization Script

**File:** `scripts/sanitize-mdx.mjs`

```javascript
import fs from 'fs/promises';
import { remark } from 'remark';

export async function sanitizeMDX(content, siteUrl) {
  // 1. Remove import statements
  content = content.replace(/^import .+$/gm, '');
  
  // 2. Convert Astro Image components to Markdown images
  content = content.replace(
    /<Image\s+src=\{([^}]+)\}\s+alt="([^"]+)"[^>]*\/>/g,
    '![$2](IMAGE_PLACEHOLDER)'
  );
  
  // 3. Remove JSX expressions
  content = content.replace(/\{[^}]+\}/g, '');
  
  // 4. Convert relative URLs to absolute
  content = content.replace(
    /\[([^\]]+)\]\(\/([^)]+)\)/g,
    `[$1](${siteUrl}/$2)`
  );
  
  // 5. Convert relative image paths
  content = content.replace(
    /!\[([^\]]+)\]\(\.\.\/([^)]+)\)/g,
    `![$1](${siteUrl}/$2)`
  );
  
  // 6. Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // 7. Clean up extra whitespace
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}
```

---

## Syndication Scripts

### Dev.to Script

**File:** `scripts/syndicate-devto.mjs`

```javascript
import fs from 'fs/promises';
import { getCollection } from 'astro:content';
import { sanitizeMDX } from './sanitize-mdx.mjs';

const DEVTO_API_URL = 'https://dev.to/api/articles';
const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
const SITE_URL = 'https://pranshujawade.github.io';

async function syndicateToDevTo(post) {
  const sanitizedContent = await sanitizeMDX(post.body, SITE_URL);
  
  const article = {
    article: {
      title: post.data.title,
      body_markdown: sanitizedContent,
      published: true,
      tags: post.data.tags.slice(0, 4), // Max 4 tags
      canonical_url: `${SITE_URL}/blog/${post.slug}`,
      description: post.data.description,
    }
  };
  
  const response = await fetch(DEVTO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEVTO_API_KEY,
    },
    body: JSON.stringify(article),
  });
  
  if (!response.ok) {
    throw new Error(`Dev.to API error: ${response.status}`);
  }
  
  return await response.json();
}

// Rate limiting: 10 requests per 10 seconds
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const posts = await getCollection('blog');
  const postsToSyndicate = posts.filter(p => !p.data.draft && p.data.featured);
  
  for (const post of postsToSyndicate) {
    try {
      console.log(`Syndicating: ${post.data.title}`);
      const result = await syndicateToDevTo(post);
      console.log(`✅ Published: ${result.url}`);
      
      // Wait 1 second between requests (stay under rate limit)
      await delay(1000);
    } catch (error) {
      console.error(`❌ Failed: ${post.data.title}`, error);
    }
  }
}

main();
```

### Hashnode Script

**File:** `scripts/syndicate-hashnode.mjs`

```javascript
import fs from 'fs/promises';
import { getCollection } from 'astro:content';
import { sanitizeMDX } from './sanitize-mdx.mjs';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const HASHNODE_PAT = process.env.HASHNODE_PAT;
const PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;
const SITE_URL = 'https://pranshujawade.github.io';

const PUBLISH_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        title
        slug
        url
      }
    }
  }
`;

async function syndicateToHashnode(post) {
  const sanitizedContent = await sanitizeMDX(post.body, SITE_URL);
  
  const variables = {
    input: {
      title: post.data.title,
      contentMarkdown: sanitizedContent,
      publicationId: PUBLICATION_ID,
      tags: post.data.tags.map(tag => ({ slug: tag, name: tag })),
      originalArticleURL: `${SITE_URL}/blog/${post.slug}`,
      subtitle: post.data.description,
    }
  };
  
  const response = await fetch(HASHNODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_PAT,
    },
    body: JSON.stringify({
      query: PUBLISH_MUTATION,
      variables,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  return result.data.publishPost.post;
}

async function main() {
  const posts = await getCollection('blog');
  const postsToSyndicate = posts.filter(p => !p.data.draft && p.data.featured);
  
  for (const post of postsToSyndicate) {
    try {
      console.log(`Syndicating: ${post.data.title}`);
      const result = await syndicateToHashnode(post);
      console.log(`✅ Published: ${result.url}`);
    } catch (error) {
      console.error(`❌ Failed: ${post.data.title}`, error);
    }
  }
}

main();
```

---

## Syndication State Tracking

### Why Track State?

Prevent duplicate syndication:
- Don't republish already syndicated posts
- Track syndication status per platform
- Allow re-syndication if needed (e.g., after content updates)

### State File

**File:** `.data/syndication-state.json` (add to .gitignore if contains timestamps, or commit it)

```json
{
  "posts": {
    "2026-02-building-portfolio": {
      "devto": {
        "syndicated": true,
        "url": "https://dev.to/username/building-portfolio",
        "date": "2026-02-23T10:00:00Z"
      },
      "hashnode": {
        "syndicated": true,
        "url": "https://hashnode.com/@username/building-portfolio",
        "date": "2026-02-23T10:05:00Z"
      }
    }
  }
}
```

### State Management in Scripts

```javascript
// Read state
const state = JSON.parse(await fs.readFile('.data/syndication-state.json', 'utf-8'));

// Check if already syndicated
if (state.posts[post.slug]?.devto?.syndicated) {
  console.log(`⏭️  Skipping (already syndicated): ${post.data.title}`);
  continue;
}

// Update state after syndication
state.posts[post.slug] = state.posts[post.slug] || {};
state.posts[post.slug].devto = {
  syndicated: true,
  url: result.url,
  date: new Date().toISOString(),
};

await fs.writeFile('.data/syndication-state.json', JSON.stringify(state, null, 2));
```

---

## GitHub Actions Workflow

### Automated Syndication Workflow

**File:** `.github/workflows/syndicate.yml`

```yaml
name: Content Syndication

on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '0 10 * * 3' # Every Wednesday at 10 AM UTC

jobs:
  syndicate:
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
      
      - name: Syndicate to Dev.to
        env:
          DEVTO_API_KEY: ${{ secrets.DEVTO_API_KEY }}
        run: node scripts/syndicate-devto.mjs
      
      - name: Syndicate to Hashnode
        env:
          HASHNODE_PAT: ${{ secrets.HASHNODE_PAT }}
          HASHNODE_PUBLICATION_ID: ${{ secrets.HASHNODE_PUBLICATION_ID }}
        run: node scripts/syndicate-hashnode.mjs
      
      - name: Commit updated state
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .data/syndication-state.json
          git commit -m "Update syndication state [skip ci]" || echo "No changes"
          git push
```

### Manual Trigger

```bash
# Trigger workflow manually via GitHub UI
# Repository > Actions > Content Syndication > Run workflow

# Or via GitHub CLI
gh workflow run syndicate.yml
```

---

## Best Practices

### Content Selection

Syndicate selectively:
- ✅ Featured posts only (`featured: true`)
- ✅ High-quality, evergreen content
- ✅ Posts with broad appeal
- ❌ Personal updates or portfolio-specific content

### Content Preparation

Before syndicating:
1. ✅ Proofread thoroughly
2. ✅ Optimize images (< 200KB each)
3. ✅ Add clear headings
4. ✅ Include code examples with syntax highlighting
5. ✅ Test locally with sanitization script

### Canonical URL Verification

After syndication:
1. Visit syndicated post
2. View page source
3. Search for `canonical` or `rel="canonical"`
4. Verify URL points to portfolio

```html
<!-- Dev.to -->
<link rel="canonical" href="https://pranshujawade.github.io/blog/post-slug" />

<!-- Hashnode -->
<link rel="canonical" href="https://pranshujawade.github.io/blog/post-slug" />
```

---

## Troubleshooting

### Dev.to API Issues

#### 429 Too Many Requests
**Solution:** Add delays between requests (1 second minimum)

```javascript
await delay(1000); // Wait 1 second between requests
```

#### 422 Unprocessable Entity
**Causes:**
- Invalid Markdown syntax
- Forbidden HTML tags
- Tags > 4 or invalid tag format

**Solution:** Validate Markdown, check tag count and format

### Hashnode API Issues

#### GraphQL Errors
**Solution:** Check response for error details

```javascript
if (result.errors) {
  console.error('GraphQL errors:', result.errors);
}
```

#### Invalid Publication ID
**Solution:** Verify `HASHNODE_PUBLICATION_ID` in GitHub Secrets

### Canonical URL Not Set

**Dev.to:** Check API request includes `canonical_url` field  
**Hashnode:** Check GraphQL mutation includes `originalArticleURL` field  
**Medium:** Verify import was successful and canonical tag exists

---

## Syndication Checklist

### Before First Syndication

- [ ] Publish post on portfolio
- [ ] Verify portfolio post is live and accessible
- [ ] Submit to Google Search Console (optional, speeds indexing)
- [ ] Wait 24-48 hours for indexing

### For Each Syndication

- [ ] Verify canonical URL in frontmatter
- [ ] Sanitize MDX (remove imports, convert components, resolve URLs)
- [ ] Check tags: max 4, lowercase, no spaces
- [ ] Verify images are absolute URLs
- [ ] Run syndication script or trigger workflow
- [ ] Verify syndicated post is live
- [ ] Check canonical URL in syndicated post source code
- [ ] Update syndication state file

### After Syndication

- [ ] Share on social media (LinkedIn, Twitter)
- [ ] Engage with comments on syndicated platforms
- [ ] Monitor traffic to portfolio from syndicated links
- [ ] Track SEO impact via Google Search Console

---

## Summary

**Critical Rules:**
- Portfolio is ALWAYS the canonical source (non-negotiable)
- Wait 24-48 hours after publishing before syndicating
- Always set `canonical_url` (Dev.to) or `originalArticleURL` (Hashnode)
- Sanitize MDX: remove imports, convert components, resolve URLs
- Respect platform limits: Dev.to (4 tags, 10 req/10s), Hashnode (more flexible)

**Automation:**
- Use GitHub Actions for scheduled syndication
- Track syndication state to prevent duplicates
- Scripts handle sanitization and API calls

**Verification:**
- Always check canonical URL in syndicated post source
- Monitor Google Search Console for indexing status
- Test syndication locally before deploying workflow

**Reference:**
- CONTENT_GUIDELINES.md for frontmatter requirements
- SEO_REQUIREMENTS.md for canonical URL importance
- SECURITY.md for API key management
