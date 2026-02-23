# New Case Study

## Description
Scaffold a new case study with structured template including challenge, approach, solution, and results sections for the portfolio.

## When to Use
- User wants to document a project
- User says "add a case study for [project]"
- User asks to "showcase my work on [project]"

## Prerequisites
- Project is an Astro 5.x portfolio
- Content collection at `src/content/case-studies/` exists
- Case studies are professional project showcases

## Workflow

### 1. Gather Information
Ask the user for the following details:

**Required:**
- **Title**: Project name (e.g., "E-commerce Platform Redesign")
- **Tagline**: One-sentence hook (e.g., "Increasing conversion rates by 40% through user-centered design")
- **Role**: Your role in the project (e.g., "Lead Frontend Developer", "Full-Stack Engineer")
- **Duration**: Project timeline (e.g., "6 months", "Jan 2025 - Mar 2025")
- **Technologies**: Stack used (e.g., "React, TypeScript, Node.js, PostgreSQL, AWS")

**Optional:**
- **Client/Company**: Organization name (if applicable)
- **Team Size**: Number of people involved
- **URL**: Live project URL (if publicly accessible)
- **GitHub**: Repository URL (if open source)
- **Custom slug**: Override auto-generated slug

### 2. Generate Slug
- Convert title to lowercase
- Replace spaces with hyphens
- Remove special characters except hyphens
- Keep it short and memorable
- Example: "E-commerce Platform Redesign" → "ecommerce-redesign"

### 3. Create File Path
Format: `src/content/case-studies/slug.mdx`
- Use simple slug (no date prefix for case studies)
- Example: `src/content/case-studies/ecommerce-redesign.mdx`

### 4. Generate Frontmatter Template
```yaml
---
title: "[User-provided title]"
tagline: "[User-provided tagline]"
publishDate: [YYYY-MM-DD format, use current date]
draft: true
featured: false
role: "[User-provided role]"
duration: "[User-provided duration]"
technologies: [tech1, tech2, tech3]
client: "[Client/Company name or leave empty]"
teamSize: [number or leave empty]
url: "[Live URL or leave empty]"
github: "[GitHub URL or leave empty]"
image:
  src: "" # Add project screenshot/hero image
  alt: "[Project title] preview"
gallery: [] # Additional images
---
```

### 5. Generate Content Template
```mdx
## Overview

[Brief 2-3 sentence summary of the project and your involvement]

## The Challenge

[Describe the problem or need that prompted this project. What was the business/user pain point? What constraints existed?]

**Key Challenges:**
- Challenge 1
- Challenge 2
- Challenge 3

## The Approach

[Explain your strategy and methodology. How did you tackle the challenge? What was your process?]

**Process:**
1. **Research & Discovery**: [What you learned]
2. **Planning & Architecture**: [How you structured the solution]
3. **Implementation**: [Key technical decisions]
4. **Testing & Iteration**: [How you validated the solution]

## The Solution

[Detail the implemented solution. What did you build? What technologies did you use and why?]

### Key Features

**Feature 1: [Name]**
[Description of feature and technical implementation]

**Feature 2: [Name]**
[Description of feature and technical implementation]

**Feature 3: [Name]**
[Description of feature and technical implementation]

### Technical Highlights

```typescript
// Example code snippet showcasing a key technical solution
// Add relevant code examples
```

[Explanation of the code and why it matters]

## Results & Impact

[Quantify the outcomes. What impact did your work have? Include metrics if available.]

**Measurable Outcomes:**
- 📈 [Metric 1: e.g., "40% increase in conversion rate"]
- ⚡ [Metric 2: e.g., "2.5s reduction in page load time"]
- 👥 [Metric 3: e.g., "10,000+ active users in first month"]
- 💰 [Metric 4: e.g., "$500K additional revenue generated"]

**Qualitative Impact:**
- [Impact on users]
- [Impact on business]
- [Impact on team/workflow]

## Learnings

[What did you learn from this project? What would you do differently? What are you proud of?]

**Key Takeaways:**
1. [Learning 1]
2. [Learning 2]
3. [Learning 3]

## Gallery

[Add screenshots, diagrams, or demo videos showcasing the project]

---

**Technologies Used:**
[Expanded list with brief explanations of why each was chosen]

**Project Links:**
- [Live Site]([url])
- [GitHub Repository]([github])
```

### 6. Create the File
Use the Write tool to create the file at the generated path with complete frontmatter and content template.

### 7. Confirmation
Report to user:
- File path created
- Slug used
- Remind them: "Case study is in draft mode. Add visuals and metrics before publishing."
- Next steps: "Complete all sections, add gallery images, then set draft: false and featured: true if it's a highlight"

## Rules to Follow
- **ALWAYS** set `draft: true` and `featured: false` by default
- **ALWAYS** use lowercase for slug
- **ALWAYS** include role, duration, and technologies
- Case studies should tell a story: Challenge → Approach → Solution → Results
- Include measurable results whenever possible
- Add code snippets for technical projects
- Use professional, results-oriented language

## Related Skills
- `content-review` - Review case study before publishing
- `audit-seo` - Optimize for search engines

## Related Rules
- `CONTENT_GUIDELINES.md` - Content standards
- `SEO_REQUIREMENTS.md` - SEO best practices

## Error Handling
- If `src/content/case-studies/` doesn't exist, create it with mkdir -p
- If file already exists, ask user to confirm overwrite or choose new slug
- Warn if technologies list is empty
- Remind user to add images before publishing

## Example Interaction

**User:** "Create a case study for my real-time chat app"

**Agent:** 
"I'll help you create a case study for your real-time chat app.

Let me gather some details:
- **Title**: Real-Time Chat Application
- **Tagline**: ?
- **Role**: ?
- **Duration**: ?
- **Technologies**: ?

Could you provide:
1. A compelling one-sentence tagline (e.g., 'Building a scalable WebSocket chat serving 50K concurrent users')
2. Your role in the project
3. Project duration
4. Technologies used"

**After user provides info:**
"✅ Created case study at `src/content/case-studies/realtime-chat-app.mdx`

The case study is in **draft mode**. Next steps:
1. Complete all template sections (Challenge, Approach, Solution, Results)
2. Add measurable metrics and results
3. Include code snippets and technical highlights
4. Add hero image and gallery images
5. Run `content-review` skill before publishing
6. Set `draft: false` and `featured: true` to showcase it"
