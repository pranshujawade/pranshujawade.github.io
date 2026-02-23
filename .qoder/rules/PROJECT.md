# PROJECT.md

**Purpose:** Master index and project overview for the Pranshu Jawade Portfolio  
**Scope:** All project configuration, documentation references, and commands  
**Last Updated:** 2026-02-23

---

## Project Overview

**Project Name:** Pranshu Jawade Portfolio  
**Site URL:** https://pranshujawade.github.io  
**Description:** Modern portfolio website with blog and case studies, built with performance and accessibility in mind.

---

## Tech Stack

### Core Framework
- **Astro 5.x** - Static site generator with Islands Architecture
- **TypeScript** - Strict mode enabled, no implicit any
- **Node.js** - LTS version (20.x+)

### Styling & UI
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **@tailwindcss/typography** - Prose styling for MDX content

### Content & Media
- **MDX** - Markdown with JSX for blog posts and case studies
- **Sharp** - High-performance image optimization

### Build & Deployment
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting

### Package Manager
- **npm** - Official package manager (NOT yarn or pnpm)

---

## Repository Structure

```
Portfolio/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Production deployment workflow
│       ├── syndicate.yml       # Content syndication automation
│       └── lighthouse.yml      # Lighthouse CI on PRs
├── .qoder/
│   └── rules/                  # Project rules and guidelines (this directory)
├── public/
│   ├── robots.txt              # Search engine directives
│   └── [static assets]         # Fonts, images, favicon, etc.
├── scripts/
│   ├── syndicate-devto.mjs     # Dev.to API integration
│   ├── syndicate-hashnode.mjs  # Hashnode GraphQL integration
│   └── sanitize-mdx.mjs        # MDX sanitization for syndication
├── src/
│   ├── components/
│   │   ├── layout/             # Layout components (Header, Footer, etc.)
│   │   ├── sections/           # Page sections (Hero, Projects, etc.)
│   │   └── ui/                 # Reusable UI components
│   ├── content/
│   │   ├── blog/               # Blog posts (MDX)
│   │   ├── case-studies/       # Portfolio case studies (MDX)
│   │   └── data/               # JSON data files
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base HTML structure
│   │   ├── BlogLayout.astro    # Blog post layout
│   │   └── CaseStudyLayout.astro
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── blog/               # Blog routes
│   │   ├── case-studies/       # Case study routes
│   │   └── [other pages]
│   ├── styles/
│   │   └── global.css          # Global styles & Tailwind directives
│   └── utils/                  # Helper functions & utilities
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration with path aliases
└── package.json                # Dependencies & scripts
```

---

## Key Configuration Files

### Path Aliases (tsconfig.json)
- `@/*` - src/ directory
- `@components/*` - src/components/
- `@layouts/*` - src/layouts/
- `@content/*` - src/content/
- `@utils/*` - src/utils/
- `@styles/*` - src/styles/

### Content Collections
- **blog** - MDX blog posts with strict frontmatter schema
- **case-studies** - MDX portfolio case studies
- **data** - JSON files for structured data

### Build Output
- **Mode:** Static (output: 'static')
- **Directory:** dist/
- **Base:** / (GitHub Pages subdirectory if needed)

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run astro check

# Lint code (if configured)
npm run lint

# Format code (if Prettier configured)
npm run format
```

---

## Deployment Workflows

### Production Deployment
- **File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `main` branch
- **Process:** Install → Type check → Build → Deploy to GitHub Pages
- **Target:** https://pranshujawade.github.io

### Content Syndication
- **File:** `.github/workflows/syndicate.yml`
- **Trigger:** Manual workflow_dispatch or scheduled
- **Targets:** Dev.to, Hashnode
- **Requirement:** Canonical URL must be set to portfolio site

### Quality Assurance
- **File:** `.github/workflows/lighthouse.yml`
- **Trigger:** Pull requests
- **Checks:** Performance, Accessibility, SEO, Best Practices

---

## GitHub Secrets Required

For full functionality, configure these secrets in GitHub repository settings:

- `DEVTO_API_KEY` - Dev.to API authentication
- `HASHNODE_PAT` - Hashnode Personal Access Token
- `HASHNODE_PUBLICATION_ID` - Target Hashnode publication ID

---

## Related Rules Documentation

This project follows comprehensive guidelines across multiple domains:

1. **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Code style, naming conventions, TypeScript patterns
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, directory structure, routing patterns
3. **[CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)** - Blog posts, case studies, frontmatter schemas
4. **[SEO_REQUIREMENTS.md](./SEO_REQUIREMENTS.md)** - Meta tags, structured data, performance targets
5. **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - WCAG compliance, semantic HTML, keyboard navigation
6. **[SECURITY.md](./SECURITY.md)** - Security headers, dependency management, API key handling
7. **[SYNDICATION.md](./SYNDICATION.md)** - Content distribution, canonical URLs, platform APIs
8. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - GitHub Actions, build process, hosting configuration
9. **[META_RULES.md](./META_RULES.md)** - Rules about managing and updating rules

---

## Quick Start Checklist

For new contributors or AI agents:

- [ ] Read PROJECT.md (this file) for overview
- [ ] Review CODING_STANDARDS.md for code patterns
- [ ] Check ARCHITECTURE.md for structure understanding
- [ ] Run `npm install` to set up dependencies
- [ ] Run `npm run dev` to start local development
- [ ] Review existing content for style consistency

---

## Support & Contact

**Maintainer:** Pranshu Jawade  
**Repository:** [GitHub URL]  
**Issues:** Use GitHub Issues for bug reports and feature requests

---

**Note:** This is the authoritative source for project information. When rules conflict, refer to META_RULES.md for resolution hierarchy.
