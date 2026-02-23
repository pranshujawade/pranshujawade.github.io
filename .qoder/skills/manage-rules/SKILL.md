# Manage Rules

## Description
Self-modifying rules management for the Portfolio project. Add, update, deprecate, or reorganize rules in `.qoder/rules/` while maintaining consistency and checking for conflicts.

## When to Use
- User asks to "add a new rule" or "create a rule"
- User wants to "update" or "change" an existing rule
- User requests to "deprecate" or "remove" a rule
- Need to reorganize rules for better clarity
- Rules conflict or overlap needs resolution
- After significant project changes (architecture, tools, processes)

## Prerequisites
- Rules directory exists at `.qoder/rules/`
- Each rule is a Markdown file (e.g., `RULE_NAME.md`)
- PROJECT.md exists and contains rules index
- Skills and agents may reference rules

## Rule File Structure
Each rule file should follow this template:

```markdown
# [Rule Name]

## Purpose
[Why this rule exists, what problem it solves]

## Scope
[When and where this rule applies]

## Rule Details
[The actual rule or guidelines, can be multiple sections]

### Dos ✅
- [What to do]
- [Best practices]

### Don'ts ❌
- [What to avoid]
- [Anti-patterns]

## Examples
[Code examples, scenarios, or use cases demonstrating the rule]

## Exceptions
[When this rule doesn't apply or can be overridden]

## Related Rules
- [RELATED_RULE_1.md] - [Brief relationship]
- [RELATED_RULE_2.md] - [Brief relationship]

## References
[External links, documentation, or resources]

## Changelog
- [YYYY-MM-DD] - Created
- [YYYY-MM-DD] - Updated: [description]
```

## Workflow

### 1. Determine Action
Ask user what they want to do:

```
What would you like to do with rules?

1. 📝 Add a new rule
2. ✏️ Update an existing rule
3. 🗑️ Deprecate/remove a rule
4. 🔍 Review all rules
5. 🔗 Check for conflicts or overlaps
6. 📋 Update PROJECT.md index

Please specify the action and rule name (if applicable).
```

### 2. Action Workflows

#### **A. Add a New Rule**

**Step 1: Gather Rule Information**
Ask user:
```
Let's create a new rule. I need:

Required:
- Rule name: ? (e.g., "CONTENT_GUIDELINES", "CODE_REVIEW_PROCESS")
- Purpose: ? (Why does this rule exist?)
- Scope: ? (When/where does it apply?)
- Rule details: ? (The actual guidelines)

Optional:
- Examples: ?
- Exceptions: ?
- Related rules: ?
```

**Step 2: Check for Conflicts**
Before creating:
```bash
# List all existing rules
ls .qoder/rules/

# Check if similar rule exists
grep -r "[similar concepts]" .qoder/rules/ --include="*.md"
```

If similar rule exists:
```
⚠️ Found similar existing rule: [EXISTING_RULE.md]

Would you like to:
1. Merge with existing rule
2. Create as separate rule (explain why separate)
3. Cancel
```

**Step 3: Create Rule File**
Use Write tool to create `.qoder/rules/RULE_NAME.md` following the template.

**Step 4: Update PROJECT.md**
Add rule to the rules index in PROJECT.md:
```markdown
## Rules
- [RULE_NAME.md](.qoder/rules/RULE_NAME.md) - [Brief description]
```

**Step 5: Scan for Impacted References**
Check if any skills or agents should reference this new rule:
```bash
# Search skills for related concepts
grep -r "[related concept]" .qoder/skills/ --include="*.md"

# Search agents for related concepts
grep -r "[related concept]" .qoder/agents/ --include="*.md"
```

Suggest updates:
```
💡 Recommendation: The following skills/agents might benefit from referencing this rule:
- .qoder/skills/[skill]/SKILL.md
- .qoder/agents/[agent]/AGENT.md

Would you like me to add references?
```

#### **B. Update an Existing Rule**

**Step 1: Identify Rule to Update**
```
Which rule would you like to update?

Existing rules:
[List all rules with brief descriptions]

Specify the rule name or number.
```

**Step 2: Read Current Rule**
```bash
cat .qoder/rules/RULE_NAME.md
```

**Step 3: Determine Changes**
Ask user:
```
Current rule: [Rule name]

What would you like to change?
1. Purpose
2. Scope
3. Rule details (Dos/Don'ts)
4. Examples
5. Exceptions
6. Related rules
7. Other

Please specify what to update and the new content.
```

**Step 4: Make Updates**
Use Edit tool to update the rule file.

Add changelog entry:
```markdown
## Changelog
- [YYYY-MM-DD] - Updated: [description of changes]
```

**Step 5: Check Impacted References**
If rule scope or purpose changed significantly, check references:
```bash
# Find files referencing this rule
grep -r "RULE_NAME.md" .qoder/ --include="*.md"
```

Verify references are still accurate:
```
⚠️ This rule is referenced by:
- [skill1/SKILL.md]
- [agent2/AGENT.md]

Please review these references to ensure they're still accurate after the update.
```

#### **C. Deprecate/Remove a Rule**

**Step 1: Identify Rule**
Ask user which rule to deprecate.

**Step 2: Check References**
```bash
# Find all references to this rule
grep -r "RULE_NAME.md" .qoder/ --include="*.md"
```

If referenced:
```
⚠️ Warning: This rule is referenced by:
- [list of files]

Options:
1. Deprecate (mark as deprecated but keep file)
2. Replace with another rule
3. Remove references and delete

Which would you like?
```

**Step 3a: If Deprecating (Not Deleting)**
Add deprecation notice to the rule file:
```markdown
# [Rule Name] (DEPRECATED)

⚠️ **DEPRECATED as of [YYYY-MM-DD]**
This rule is deprecated. [Reason for deprecation]
- **Replacement:** [NEW_RULE.md] (if applicable)
- **Migration:** [How to migrate from this rule]

[Original rule content preserved below for reference]
```

Update PROJECT.md to mark as deprecated:
```markdown
- ~~[DEPRECATED_RULE.md](.qoder/rules/DEPRECATED_RULE.md)~~ - Deprecated: [reason]
```

**Step 3b: If Removing**
1. Remove all references from skills and agents
2. Remove from PROJECT.md index
3. Delete the rule file (or move to archive)

#### **D. Review All Rules**

**Step 1: List All Rules**
```bash
ls -1 .qoder/rules/
```

**Step 2: Read Each Rule**
For each rule:
```bash
cat .qoder/rules/RULE_NAME.md
```

**Step 3: Check for Issues**
Analyze:
- ✅ All rules have proper structure
- ✅ All rules have purpose and scope
- ✅ Related rules are cross-referenced
- ⚠️ Rules overlap or conflict
- ⚠️ Rules are outdated
- ⚠️ Rules reference deprecated guidelines

**Step 4: Generate Report**
```
📋 Rules Review Report
Generated: [Date]

Total Rules: [X]
Active Rules: [Y]
Deprecated Rules: [Z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Healthy Rules ([X])
[List of well-structured, up-to-date rules]

⚠️ Issues Found ([X])

1. [RULE_NAME.md]
   Issue: Overlaps with [OTHER_RULE.md]
   Recommendation: Merge or clarify scope

2. [RULE_NAME2.md]
   Issue: No examples provided
   Recommendation: Add examples

3. [RULE_NAME3.md]
   Issue: Not referenced by any skills/agents
   Recommendation: Promote or deprecate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recommendations:
- [List of suggested improvements]
```

#### **E. Check for Conflicts or Overlaps**

**Step 1: Read All Rules**
Load all rule files.

**Step 2: Identify Overlaps**
Compare rules for:
- Similar scopes
- Contradicting guidelines
- Redundant content

**Step 3: Report Findings**
```
🔍 Rules Conflict Analysis
Generated: [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No Conflicts (X rules)
[List of rules with unique, clear scopes]

⚠️ Potential Overlaps (X pairs)

1. [RULE_A.md] ↔️ [RULE_B.md]
   Overlap: Both cover [topic]
   Recommendation: 
   - Merge into single comprehensive rule, OR
   - Clarify distinct scopes

2. [RULE_C.md] ↔️ [RULE_D.md]
   Overlap: Similar examples
   Recommendation: Cross-reference or consolidate

❌ Conflicts (X pairs)

1. [RULE_E.md] ⚠️ [RULE_F.md]
   Conflict: RULE_E says [X], RULE_F says [opposite of X]
   Recommendation: Resolve conflict by [suggestion]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action Required: [X] conflicts need resolution
```

#### **F. Update PROJECT.md Index**

**Step 1: Read Current PROJECT.md**
```bash
cat .qoder/PROJECT.md
```

**Step 2: List All Rules**
```bash
ls -1 .qoder/rules/
```

**Step 3: Generate Updated Index**
For each rule, extract:
- Rule name (from filename)
- Brief description (from "Purpose" section)

**Step 4: Update PROJECT.md**
Use Edit tool to update the rules section in PROJECT.md:
```markdown
## Rules
Rules define project standards, conventions, and best practices.

- [ACCESSIBILITY.md](.qoder/rules/ACCESSIBILITY.md) - Web accessibility standards (WCAG 2.1 AA)
- [ARCHITECTURE.md](.qoder/rules/ARCHITECTURE.md) - System architecture and design patterns
- [CODING_STANDARDS.md](.qoder/rules/CODING_STANDARDS.md) - Code style and quality guidelines
- [CONTENT_GUIDELINES.md](.qoder/rules/CONTENT_GUIDELINES.md) - Content writing and formatting standards
- [DEPLOYMENT.md](.qoder/rules/DEPLOYMENT.md) - Deployment processes and checklists
- [SECURITY.md](.qoder/rules/SECURITY.md) - Security best practices
- [SEO_REQUIREMENTS.md](.qoder/rules/SEO_REQUIREMENTS.md) - SEO optimization requirements
```

## Rules to Follow
- **ALWAYS** use consistent naming: `SCREAMING_SNAKE_CASE.md`
- **ALWAYS** follow the rule template structure
- **ALWAYS** add changelog entries when updating
- **ALWAYS** check for conflicts before creating new rules
- **ALWAYS** update PROJECT.md index when rules change
- **ALWAYS** check for impacted skills/agents references
- **NEVER** create duplicate or redundant rules
- **NEVER** remove referenced rules without updating references

## Rule Naming Conventions
- Use `SCREAMING_SNAKE_CASE.md` (e.g., `CONTENT_GUIDELINES.md`)
- Be descriptive but concise
- Group related rules with prefixes if needed (e.g., `API_DESIGN.md`, `API_SECURITY.md`)

## Related Skills
- `new-blog-post`, `new-case-study`, etc. - May need to follow rules
- All audit skills - May validate rule compliance

## Related Rules
- This skill manages all rules, so it's self-referential

## Example Interaction

**User:** "Add a rule for pull request reviews"

**Agent:**
"I'll help you create a PR review rule. Let me gather information:

**Rule Name:** PR_REVIEW_PROCESS.md

Let me ask you some details:
- **Purpose:** Why do we need this rule? (e.g., 'Ensure code quality and knowledge sharing')
- **Scope:** When does it apply? (e.g., 'All pull requests to main branch')
- **Key guidelines:** What are the main rules?

Please provide these details."

**User provides details**

**Agent:**
"Perfect! Let me check for existing similar rules...

[Checks existing rules]

Found potentially related rule: CODE_REVIEW.md

Would you like to:
1. Create PR_REVIEW_PROCESS.md as separate (explain: PR reviews include more than just code review)
2. Update CODE_REVIEW.md to include PR process

What's your preference?"

**User:** "create separate"

**Agent:**
"Creating PR_REVIEW_PROCESS.md...

[Creates rule file]
[Updates PROJECT.md]
[Checks for impacted references]

✅ Rule created!

**New rule:** .qoder/rules/PR_REVIEW_PROCESS.md
**Added to:** PROJECT.md rules index

💡 Recommendation: This rule might be relevant for:
- code-reviewer agent

Would you like me to add a reference to this rule in the code-reviewer agent?"

**User:** "yes"

**Agent:**
"Added reference to code-reviewer agent.

✅ Rule management complete!

**Summary:**
- Created: PR_REVIEW_PROCESS.md
- Updated: PROJECT.md (rules index)
- Updated: code-reviewer agent (added rule reference)

Your project rules are now up to date."
