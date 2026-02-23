# META_RULES.md

**Purpose:** Rules for managing rules - governance, updates, conflicts, and maintenance  
**Scope:** Rule creation, modification, deprecation, conflict resolution, quality standards  
**Last Updated:** 2026-02-23

---

## What Are Meta Rules?

**Meta rules are rules about rules themselves.**

This document defines:
- How to create new rules
- How to update existing rules
- How to deprecate outdated rules
- How to resolve conflicts between rules
- Quality standards for rule documentation
- Review and maintenance cadence

**Why this matters:**
- Ensures rules remain accurate and useful
- Prevents conflicting guidance
- Maintains consistency across documentation
- Scales as the project evolves

---

## Rule Structure

### Required Sections

Every rules file MUST include these sections at the top:

```markdown
# RULE_NAME.md

**Purpose:** One-sentence description of what this rule covers  
**Scope:** What is included/excluded from this rule  
**Last Updated:** YYYY-MM-DD

---

## Section 1

Content...

## Section 2

Content...
```

### Purpose Statement

**Purpose** explains WHY the rule exists and WHAT it covers:

```markdown
✅ GOOD
**Purpose:** Security best practices, secret management, dependency security, and attack prevention

❌ BAD
**Purpose:** Security stuff
```

### Scope Statement

**Scope** defines boundaries - what's included and what's not:

```markdown
✅ GOOD
**Scope:** GitHub Pages limitations, secrets handling, external resources, dependencies

❌ BAD
**Scope:** Security
```

### Last Updated Date

**Last Updated** tracks when the rule was last modified:

```markdown
**Last Updated:** 2026-02-23
```

**When to update:**
- Any content changes (not just typo fixes)
- When examples are added/modified
- When new requirements are added
- When existing guidance changes

---

## Creating New Rules

### When to Create a New Rule

Create a new rule file when:
- ✅ New domain requires significant guidance (e.g., testing, internationalization)
- ✅ Existing file would exceed 1000 lines
- ✅ Topic is distinct from existing rules
- ✅ Multiple team members/agents need to reference it

**Don't create a new rule when:**
- ❌ Content fits in existing file (< 100 lines)
- ❌ Only applies to one feature or component
- ❌ Duplicates existing guidance

### New Rule Process

#### 1. Choose a Name

**Format:** `CATEGORY_NAME.md`

**Naming conventions:**
- ALL_CAPS
- Descriptive (not generic)
- Single-word or hyphenated
- Matches content domain

```
✅ GOOD
TESTING.md
INTERNATIONALIZATION.md
API_DESIGN.md

❌ BAD
rules.md
misc.md
other-stuff.md
```

#### 2. Create File in `.qoder/rules/`

```bash
touch .qoder/rules/NEW_RULE.md
```

#### 3. Add Required Sections

```markdown
# NEW_RULE.md

**Purpose:** [One-sentence description]  
**Scope:** [What's included/excluded]  
**Last Updated:** [YYYY-MM-DD]

---

## Overview

[Introduction to the rule domain]

## Section 1

[Content]

## Section 2

[Content]

## Summary

[Quick recap of key points]

**Reference:**
- [Related rules with links]
```

#### 4. Update PROJECT.md Index

Add the new rule to the "Related Rules Documentation" section in `PROJECT.md`:

```markdown
## Related Rules Documentation

...
10. **[NEW_RULE.md](./NEW_RULE.md)** - Brief description
```

#### 5. Cross-Reference in Related Rules

If the new rule relates to existing rules, add cross-references:

```markdown
## Summary

**Reference:**
- NEW_RULE.md for [specific topic]
- EXISTING_RULE.md for [related topic]
```

---

## Updating Rules

### When to Update

Update a rule when:
- Technology version changes (e.g., Astro 5.x → 6.x)
- Best practices evolve
- Requirements change
- Errors or omissions found
- Examples become outdated

### Update Process

#### 1. Document the Change

Add a dated comment at the change location:

```markdown
## Section Title

<!-- Updated 2026-03-15: Changed recommendation from X to Y due to Z -->

New content here...
```

**For major changes**, add a changelog section at the end:

```markdown
---

## Changelog

### 2026-03-15
- Changed deployment strategy from branch-based to GitHub Actions
- Updated Node.js version from 18 to 20
- Added Lighthouse CI workflow

### 2026-02-23
- Initial version
```

#### 2. Update "Last Updated" Date

```markdown
**Last Updated:** 2026-03-15
```

#### 3. Check for Conflicts

Search other rules files for related content:

```bash
# Search all rules for keywords
grep -r "keyword" .qoder/rules/

# Check for conflicting guidance
grep -r "old recommendation" .qoder/rules/
```

#### 4. Update Cross-References

If the change affects related rules, update those too:

```markdown
<!-- In CODING_STANDARDS.md -->
**Reference:**
- SECURITY.md for API key handling <!-- Updated reference -->
```

#### 5. Notify Affected Parties

If skills or agents reference this rule:
- Check `.qoder/skills/` for references
- Check `.qoder/agents/` for references
- Update if guidance has changed significantly

---

## Deprecating Rules

### When to Deprecate

Deprecate a rule when:
- Content is no longer relevant (technology removed)
- Rule merged into another file
- Requirements no longer apply
- Project direction changed

### Deprecation Process

#### 1. Mark as DEPRECATED

Add a prominent deprecation notice at the top:

```markdown
# RULE_NAME.md

> **⚠️ DEPRECATED:** This rule is no longer maintained.  
> **Reason:** [Why it's deprecated]  
> **Replacement:** See [NEW_RULE.md](./NEW_RULE.md) for updated guidance.  
> **Deprecated on:** 2026-03-15

**Purpose:** [Original purpose]  
**Scope:** [Original scope]  
**Last Updated:** [Date]

---

[Keep original content for historical reference]
```

#### 2. Remove from PROJECT.md Index

~~10. **[DEPRECATED_RULE.md](./DEPRECATED_RULE.md)** - Description~~

Or move to a "Deprecated Rules" section.

#### 3. Update Cross-References

Replace references to deprecated rule with new rule:

```markdown
<!-- ❌ OLD -->
**Reference:**
- DEPRECATED_RULE.md for guidance

<!-- ✅ NEW -->
**Reference:**
- NEW_RULE.md for guidance (replaces deprecated DEPRECATED_RULE.md)
```

#### 4. Keep File (Don't Delete)

**Don't delete deprecated rule files** - they serve as historical documentation.

After 6-12 months, you may move to `.qoder/rules/deprecated/` directory.

---

## Conflict Resolution

### Conflict Hierarchy

When rules conflict, apply this hierarchy (highest priority first):

1. **META_RULES.md** - Rules governance
2. **PROJECT.md** - Project-wide mandates
3. **SECURITY.md** - Security requirements
4. **ACCESSIBILITY.md** - Accessibility compliance
5. **SEO_REQUIREMENTS.md** - SEO standards
6. **DEPLOYMENT.md** - Deployment processes
7. **CODING_STANDARDS.md** - Code style
8. **ARCHITECTURE.md** - System design
9. **CONTENT_GUIDELINES.md** - Content creation
10. **SYNDICATION.md** - Content distribution

**Example conflict:**

```markdown
CODING_STANDARDS.md says: "Always use PascalCase for components"
ACCESSIBILITY.md says: "Use kebab-case for component files"

Resolution: ACCESSIBILITY.md takes precedence.
Update CODING_STANDARDS.md to clarify: "Component files use kebab-case, component names use PascalCase"
```

### Identifying Conflicts

#### Manual Review

Periodically review rules for conflicts:

```bash
# Search for contradictory guidance
grep -r "always" .qoder/rules/
grep -r "never" .qoder/rules/
grep -r "must" .qoder/rules/
```

#### Agent Feedback

When agents report confusion or conflicting guidance:
1. Document the conflict
2. Determine correct guidance using hierarchy
3. Update conflicting rules
4. Add cross-reference to clarify

#### Pull Request Reviews

During PR reviews, check for:
- New code violating rules
- Rules conflicting with implementation
- Outdated guidance

### Resolving Conflicts

**Process:**
1. Identify conflicting rules
2. Apply hierarchy to determine winner
3. Update lower-priority rule to align
4. Add cross-reference for clarity
5. Document resolution in comments

```markdown
<!-- In CODING_STANDARDS.md -->
<!-- Updated 2026-03-15: Aligned with ACCESSIBILITY.md on component file naming -->

## File Naming Conventions

Components use **kebab-case** for files (accessibility requirement):
- `blog-card.astro`
- `header-nav.astro`

Component names in code use **PascalCase**:
```astro
import BlogCard from '@components/BlogCard.astro';
```

**Reference:** ACCESSIBILITY.md for file naming rationale
```

---

## Quality Standards

### Writing Style

#### Clarity
- Use short sentences (< 20 words ideal)
- One idea per sentence
- Active voice preferred
- Second person ("you") when addressing developers

#### Structure
- Logical heading hierarchy (H2 → H3 → H4)
- Descriptive headings (not generic)
- Related content grouped
- Summary section at end

#### Examples
- Provide code examples liberally
- Show both ✅ GOOD and ❌ BAD examples
- Include comments in complex examples
- Keep examples concise (< 20 lines)

#### Formatting
- Use tables for comparisons
- Use lists for requirements
- Use blockquotes for warnings/notes
- Use code blocks with language tags

### Example Quality

```markdown
<!-- ✅ GOOD - Clear, actionable, with examples -->

## External Links Security

Always use `rel="noopener noreferrer"` with `target="_blank"`:

\```astro
<!-- ✅ GOOD -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>

<!-- ❌ BAD -->
<a href="https://example.com" target="_blank">
  External Link
</a>
\```

**Why:** Prevents tabnabbing attacks where malicious sites access `window.opener`.

<!-- ❌ BAD - Vague, no examples -->

## Links

Be careful with external links. Use proper attributes.
```

### Completeness

Every rule should include:
- ✅ Clear purpose and scope
- ✅ Requirements (what must be done)
- ✅ Examples (good and bad)
- ✅ Rationale (why it matters)
- ✅ Related rules references
- ✅ Summary section

### Maintainability

Rules should be:
- **Modular**: Each rule file covers one domain
- **Self-contained**: Minimal dependencies on other files
- **Discoverable**: Indexed in PROJECT.md
- **Versioned**: Last Updated date tracked
- **Referenced**: Cross-linked with related rules

---

## Review Cadence

### Quarterly Reviews (Every 3 Months)

**What to review:**
- [ ] All rules files for accuracy
- [ ] Technology versions (Astro, Tailwind, Node.js)
- [ ] Best practices evolution
- [ ] Broken links or references
- [ ] Deprecated guidance

**Process:**
1. Read each rule file
2. Verify examples still work
3. Check for technology updates
4. Update Last Updated dates
5. Document changes in changelog

### On Technology Updates

When core technologies update (Astro 5.x → 6.x):
1. Review release notes for breaking changes
2. Identify affected rules
3. Update guidance and examples
4. Test examples with new version
5. Update version numbers in PROJECT.md

### On Project Milestones

After major features or changes:
1. Create new rules if needed
2. Update affected rules
3. Check for new conflicts
4. Update PROJECT.md index

---

## Skills and Agents Integration

### When Skills/Agents Are Added

1. **Update PROJECT.md**: List new skills/agents
2. **Reference relevant rules**: In skill/agent description
3. **Check for new rule needs**: Does this skill need new guidance?

### When Rules Are Updated

1. **Search skills/agents**: Check for references to updated rule
2. **Update if needed**: Align skill/agent with new guidance
3. **Test behavior**: Verify skill/agent follows updated rule

### Example

```markdown
<!-- In .qoder/skills/frontend-design.md -->

# Frontend Design Skill

This skill applies:
- CODING_STANDARDS.md for component patterns
- ACCESSIBILITY.md for WCAG compliance
- SEO_REQUIREMENTS.md for meta tags

Last reviewed against rules: 2026-02-23
```

---

## Rule Templates

### New Rule Template

```markdown
# RULE_NAME.md

**Purpose:** [One-sentence description]  
**Scope:** [What's included/excluded]  
**Last Updated:** YYYY-MM-DD

---

## Overview

[Brief introduction to the rule domain]

## Key Principles

[Core principles or philosophy]

## Requirements

[Mandatory requirements]

## Guidelines

[Best practices and recommendations]

## Examples

### Good Examples

\```language
// Example code
\```

### Bad Examples

\```language
// Example code
\```

## Common Issues

[Problems and solutions]

## Summary

[Quick recap of key points]

**Reference:**
- [Related rules]
```

### Update Comment Template

```markdown
<!-- Updated YYYY-MM-DD: [Brief description of change and reason] -->
```

### Deprecation Notice Template

```markdown
> **⚠️ DEPRECATED:** This rule is no longer maintained.  
> **Reason:** [Why it's deprecated]  
> **Replacement:** See [NEW_RULE.md](./NEW_RULE.md) for updated guidance.  
> **Deprecated on:** YYYY-MM-DD
```

---

## Enforcement

### Who Enforces Rules?

- **Developers**: Follow rules when writing code
- **Code Reviewers**: Check PRs against rules
- **AI Agents**: Reference rules for guidance
- **Automated Tools**: Linters, formatters, CI checks

### Enforcement Levels

| Level | Description | Example |
|-------|-------------|---------|
| **MUST** | Mandatory, no exceptions | TypeScript strict mode |
| **SHOULD** | Strongly recommended | Descriptive variable names |
| **MAY** | Optional, at discretion | Additional comments |

### Automated Enforcement

Where possible, enforce rules automatically:

```javascript
// .eslintrc.js - Enforce CODING_STANDARDS.md
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // No any types
    'no-eval': 'error', // No eval() - SECURITY.md
  }
};
```

---

## Summary

**Key Principles:**
- Rules must have Purpose, Scope, Last Updated
- New rules added to PROJECT.md index
- Updates documented with dated comments
- Deprecated rules marked but not deleted
- Conflicts resolved using hierarchy
- Quarterly reviews recommended

**Hierarchy (Highest to Lowest):**
1. META_RULES (this file)
2. PROJECT
3. SECURITY
4. ACCESSIBILITY
5. SEO_REQUIREMENTS
6. DEPLOYMENT
7. CODING_STANDARDS
8. ARCHITECTURE
9. CONTENT_GUIDELINES
10. SYNDICATION

**Process:**
- Create: Choose name → Add to PROJECT.md → Write content → Cross-reference
- Update: Document change → Update date → Check conflicts → Update references
- Deprecate: Mark as deprecated → Update PROJECT.md → Update cross-references → Keep file

**Quality Standards:**
- Clear, actionable guidance
- Good and bad examples
- Rationale for requirements
- Cross-references to related rules
- Summary section

**Maintenance:**
- Quarterly reviews
- Update on technology changes
- Check for conflicts regularly
- Keep PROJECT.md index current

---

**This is the meta level. These rules govern all other rules. When in doubt, refer back here.**
