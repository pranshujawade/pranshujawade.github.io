# Update CV

## Description
Update CV/resume data in the portfolio by editing the JSON Resume schema file, managing professional experience, education, skills, certifications, and more.

## When to Use
- User wants to update their resume/CV
- User says "add job experience" or "update my CV"
- User asks to "add a certification" or "update skills"
- Periodic CV updates (new projects, promotions, skills)

## Prerequisites
- Resume data stored at `src/content/data/resume.json`
- File follows JSON Resume schema (https://jsonresume.org/schema/)
- Portfolio displays resume data on /cv or /resume page

## JSON Resume Schema Overview
The resume.json file follows this structure:

```json
{
  "basics": {
    "name": "Full Name",
    "label": "Job Title",
    "image": "URL to profile photo",
    "email": "email@example.com",
    "phone": "+1234567890",
    "url": "https://portfolio-url.com",
    "summary": "Professional summary...",
    "location": {
      "city": "City",
      "countryCode": "US",
      "region": "State"
    },
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "username",
        "url": "https://linkedin.com/in/username"
      }
    ]
  },
  "work": [
    {
      "name": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "summary": "Role description",
      "highlights": [
        "Achievement 1",
        "Achievement 2"
      ],
      "url": "https://company.com",
      "location": "City, State"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "area": "Major/Field",
      "studyType": "Degree",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "score": "GPA",
      "courses": ["Course 1", "Course 2"]
    }
  ],
  "skills": [
    {
      "name": "Category",
      "level": "Expert/Advanced/Intermediate/Beginner",
      "keywords": ["Skill1", "Skill2", "Skill3"]
    }
  ],
  "certificates": [
    {
      "name": "Certification Name",
      "date": "YYYY-MM-DD",
      "issuer": "Issuing Organization",
      "url": "https://certification-url.com"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "url": "https://project-url.com",
      "highlights": ["Highlight 1", "Highlight 2"],
      "keywords": ["tech1", "tech2"]
    }
  ],
  "awards": [],
  "publications": [],
  "languages": [],
  "interests": [],
  "references": []
}
```

## Workflow

### 1. Ask What to Update
Present user with options:

```
What would you like to update in your CV?

1. 👤 Basics (name, contact, summary)
2. 💼 Work Experience (add/edit job)
3. 🎓 Education (add/edit degree)
4. 🛠️ Skills (add/update skills)
5. 🏆 Certifications (add certification)
6. 📁 Projects (add/edit project)
7. 🏅 Awards
8. 📄 Publications
9. 🌍 Languages
10. 🎯 Interests

Select a number or describe what you'd like to update.
```

### 2. Read Current Resume
```bash
cat src/content/data/resume.json
```

Parse the JSON to understand current state before making changes.

### 3. Update Workflow by Section

#### **A. Updating Basics**
Ask for specific fields to update:

```
Current basics:
- Name: [current name]
- Label: [current job title]
- Email: [current email]
- Summary: [current summary]

What would you like to change?
```

**Validation:**
- Email: Valid email format
- Phone: Valid phone format (international recommended: +1...)
- URL: Valid URL
- Summary: 2-3 sentences, professional tone

#### **B. Adding/Editing Work Experience**
Ask if adding new or editing existing:

**For new job:**
```
Let's add a work experience. I need:

Required:
- Company name: ?
- Position/Job title: ?
- Start date (YYYY-MM-DD): ?
- End date (YYYY-MM-DD or "Present"): ?

Optional but recommended:
- Location (City, State/Country): ?
- Company URL: ?
- Role summary (1-2 sentences): ?
- Key achievements (3-5 bullet points): ?
```

**For editing existing:**
List current work experiences, ask which to edit, then what to change.

**Validation:**
- Start date < End date (if not "Present")
- Dates in ISO format: YYYY-MM-DD
- Highlights are concise (1-2 lines each)
- Use action verbs: "Built", "Led", "Improved", "Designed"

**Ordering:**
Always order work experiences by startDate (most recent first).

#### **C. Adding/Editing Education**
**For new education:**
```
Let's add education. I need:

Required:
- Institution name: ?
- Degree type (Bachelor's, Master's, PhD, etc.): ?
- Field of study/Major: ?
- Start date (YYYY-MM-DD): ?
- End date (YYYY-MM-DD): ?

Optional:
- GPA/Score: ?
- Relevant courses: ?
```

**Validation:**
- Dates in ISO format
- studyType: "Bachelor's", "Master's", "PhD", "Associate", etc.
- Courses as array of strings

#### **D. Adding/Updating Skills**
Skills are organized by category:

```
Current skill categories:
1. Frontend Development: React, TypeScript, Tailwind CSS
2. Backend Development: Node.js, PostgreSQL, GraphQL
3. Tools & Platforms: Git, Docker, AWS

Would you like to:
- Add a new skill category
- Add skills to an existing category
- Update skill level
- Remove skills
```

**Skill levels:**
- Expert: 5+ years, deep expertise
- Advanced: 3-5 years, proficient
- Intermediate: 1-3 years, comfortable
- Beginner: < 1 year, learning

**Validation:**
- Keywords array should have 3-10 items
- Skills should be specific (not "programming")
- Group related technologies together

#### **E. Adding Certifications**
```
Let's add a certification. I need:

Required:
- Certification name: ?
- Issuing organization: ?
- Date obtained (YYYY-MM-DD): ?

Optional:
- Certification URL (for verification): ?
- Expiration date (if applicable): ?
```

**Validation:**
- Date in ISO format
- URL should be verification link if possible

**Ordering:**
Order certifications by date (most recent first).

#### **F. Adding/Editing Projects**
```
Let's add a project. I need:

Required:
- Project name: ?
- Description (1-2 sentences): ?
- Start date (YYYY-MM-DD): ?
- End date (YYYY-MM-DD or "Present"): ?

Optional:
- Project URL (live site or GitHub): ?
- Key highlights/achievements (3-5 points): ?
- Technologies used: ?
```

**Validation:**
- Dates in ISO format
- Keywords array for technologies
- Highlights focus on impact/results

**Ordering:**
Order projects by startDate (most recent first).

### 4. Make the Update
Use the Edit tool to update the JSON file:

```bash
# Read the file first to get exact old_string
cat src/content/data/resume.json
```

Then use Edit tool to make precise JSON changes.

**Important:**
- Maintain valid JSON syntax
- Preserve formatting (2-space indentation)
- Keep arrays properly formatted
- Ensure no trailing commas
- Validate JSON after editing

### 5. Validate JSON
After updating, validate the JSON:

```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('src/content/data/resume.json', 'utf8'))" && echo "✅ Valid JSON" || echo "❌ Invalid JSON"
```

If invalid, fix syntax errors and re-validate.

### 6. Confirmation
Report to user:

```
✅ CV Updated Successfully!

**Changes made:**
- [Summary of changes]

**Updated section:** [Work/Education/Skills/etc.]

Your resume is now up to date. The changes will appear on your portfolio's CV page after the next build/deploy.

**Next steps:**
- Review the full CV: cat src/content/data/resume.json
- Run `npm run build` to see changes locally
- Deploy when ready: use `deploy-portfolio` skill
```

## Rules to Follow
- **ALWAYS** read resume.json before editing
- **ALWAYS** validate JSON after editing
- **ALWAYS** use ISO date format (YYYY-MM-DD)
- **ALWAYS** order work/education/certifications by date (recent first)
- **ALWAYS** use action verbs in highlights
- **NEVER** break JSON syntax
- **ALWAYS** maintain 2-space indentation
- **ALWAYS** use professional language

## Date Formatting
- Start dates: "YYYY-MM-DD" or "YYYY-MM" (if day unknown)
- End dates: "YYYY-MM-DD" or "Present" for current positions
- Certification dates: "YYYY-MM-DD"

## Writing Guidelines
**Highlights/Achievements:**
- Start with action verbs: Built, Led, Improved, Designed, Implemented
- Quantify when possible: "Increased performance by 40%"
- Focus on impact: What was the result?
- Keep concise: 1-2 lines per highlight

**Summaries:**
- Professional tone
- 2-3 sentences
- Highlight key strengths
- Avoid buzzwords without substance

**Skills:**
- Be specific: "React" not "Frontend"
- Include versions if relevant: "React 18"
- Group logically: Languages, Frameworks, Tools

## Related Skills
- `new-case-study` - Projects can become case studies
- `content-review` - Review CV content for quality

## Related Rules
- `CONTENT_GUIDELINES.md` - Writing standards

## Error Handling

### Invalid JSON
```
❌ Error: Invalid JSON syntax after update

Error: Unexpected token } at position 234

I'll fix the syntax error...

[Fixes JSON syntax]

✅ JSON is now valid
```

### Missing Required Fields
```
❌ Error: Missing required fields

Work experience requires:
- name (company name)
- position (job title)
- startDate

Please provide these fields.
```

### Invalid Date Format
```
❌ Error: Invalid date format

Date "02-2024" is invalid. Use ISO format: YYYY-MM-DD

Examples:
- 2024-02-01 (full date)
- 2024-02 (month only, if day unknown)

Correct format?
```

## Example Interaction

**User:** "Add my new job to my CV"

**Agent:**
"I'll help you add a new job to your CV. Let me read your current resume first...

[Reads resume.json]

I see your most recent position is:
- [Company] as [Position] (Started [Date])

Let's add your new job. I need some details:

**Required:**
- Company name: ?
- Position/Job title: ?
- Start date (YYYY-MM-DD): ?
- End date (YYYY-MM-DD or "Present" if current): ?

**Optional:**
- Location: ?
- Company website: ?
- Role summary: ?
- Key achievements: ?"

**User provides:**
- Company: Tech Corp
- Position: Senior Frontend Engineer
- Start: 2025-06-01
- End: Present
- Location: San Francisco, CA
- Achievements: Led React migration, improved performance by 50%, mentored 3 juniors

**Agent:**
"Perfect! I'll add this to your resume...

[Updates resume.json with new work entry]

✅ Job added successfully!

**New work experience:**
- Company: Tech Corp
- Position: Senior Frontend Engineer
- Duration: June 2025 - Present
- Location: San Francisco, CA
- Highlights:
  • Led React migration for legacy application
  • Improved application performance by 50%
  • Mentored 3 junior engineers

Your resume is updated! Changes will appear on your CV page after deploying.

Would you like to add anything else to your CV?"

**User:** "No, that's all"

**Agent:**
"Great! Your CV is now up to date. 

**Next steps:**
- Review: cat src/content/data/resume.json
- Test locally: npm run build && npm run dev
- Deploy: Use `deploy-portfolio` skill when ready"
