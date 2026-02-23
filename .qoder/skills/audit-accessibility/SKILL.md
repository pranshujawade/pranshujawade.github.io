# Audit Accessibility

## Description
Comprehensive accessibility (a11y) audit for the Astro portfolio, ensuring compliance with WCAG 2.1 Level AA standards.

## When to Use
- Before deploying to production
- User asks to "check accessibility" or "audit a11y"
- After UI/design changes
- After adding new components
- Quarterly accessibility reviews

## Prerequisites
- Project is an Astro 5.x portfolio
- Site can be built successfully (`npm run build`)
- Output directory at `dist/` exists

## Workflow

### 1. Build the Site
```bash
npm run build
```

Ensure build succeeds before auditing. The audit inspects built HTML files in `dist/`.

### 2. Audit Categories

#### **A. Semantic HTML Structure**
Check for proper use of semantic elements:

```bash
# Check homepage structure
cat dist/index.html
```

**Validation criteria:**
- ✅ Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`, no skipping levels)
- ✅ One `<h1>` per page (typically page title)
- ✅ Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`
- ✅ Lists use `<ul>`, `<ol>`, or `<dl>` (not divs styled as lists)
- ✅ Buttons use `<button>` or `<a>` (not divs with click handlers)
- ❌ Error if heading hierarchy is broken
- ❌ Error if no `<main>` landmark

**Check heading hierarchy:**
```bash
# Extract headings in order
grep -E '<h[1-6]' dist/index.html | sed 's/.*<h\([1-6]\)[^>]*>\(.*\)<\/h[1-6]>.*/\1: \2/'
```

**Check for landmarks:**
```bash
grep -E '<(header|main|nav|footer|article|section)' dist/index.html
```

#### **B. Alt Text for Images**
Every image must have descriptive alt text:

```bash
# Find images without alt attributes
grep -r '<img' dist/ | grep -v 'alt=' | head -20

# Find images with empty or generic alt text
grep -r '<img.*alt=""' dist/ | head -10
grep -r '<img.*alt="image"' dist/ | head -10
grep -r '<img.*alt="photo"' dist/ | head -10
```

**Validation criteria:**
- ✅ All `<img>` tags have `alt` attribute
- ✅ Alt text is descriptive and meaningful
- ✅ Decorative images use `alt=""` (empty alt)
- ✅ Complex images (charts, diagrams) have detailed alt or `longdesc`
- ✅ Logo images have alt like "Company name logo"
- ❌ Error if any image missing alt attribute
- ⚠️ Warn if alt text is generic ("image", "photo", "icon")

**Check for meaningful alt text:**
```bash
# Sample images with alt text
grep -r '<img.*alt=' dist/blog/*.html | head -10
```

#### **C. Color Contrast**
Check color contrast ratios in CSS:

```bash
# Read main CSS file
cat dist/_astro/main.*.css
```

**WCAG 2.1 Level AA Requirements:**
- Normal text (< 18px): Contrast ratio ≥ 4.5:1
- Large text (≥ 18px or ≥ 14px bold): Contrast ratio ≥ 3:1
- UI components and graphics: Contrast ratio ≥ 3:1

**Common areas to check:**
- Body text on background
- Links (default, hover, visited states)
- Button text on button background
- Form labels and inputs
- Navigation items
- Code blocks

**Manual check locations:**
```bash
# Find theme colors defined in CSS or Tailwind config
grep -E 'color:|background:' dist/_astro/main.*.css | head -20
```

**Validation criteria:**
- ✅ Primary text meets 4.5:1 contrast
- ✅ Links are distinguishable (not just by color)
- ✅ Buttons have sufficient contrast
- ✅ Form elements are clearly visible
- ⚠️ Warn if any suspect low-contrast combinations found
- 💡 Recommend using browser DevTools or online contrast checkers

**Tools:**
- Browser DevTools (Chrome/Firefox have built-in contrast checkers)
- Online: https://webaim.org/resources/contrastchecker/
- Online: https://coolors.co/contrast-checker

#### **D. Keyboard Navigation**
Verify keyboard accessibility:

```bash
# Check for skip links
grep -r 'skip-to-content\|skip-link\|skip-navigation' dist/index.html

# Check for focus styles
grep -E 'focus:|focus-visible:' dist/_astro/main.*.css

# Check for tab index
grep -r 'tabindex=' dist/*.html
```

**Validation criteria:**
- ✅ Skip-to-content link at top of page (hidden until focused)
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible (not removed with `outline: none`)
- ✅ Focus order is logical (follows visual order)
- ✅ No keyboard traps (focus can move in and out)
- ✅ No `tabindex` values > 0 (breaks natural tab order)
- ❌ Error if skip link missing
- ❌ Error if focus styles removed without alternative
- ⚠️ Warn if `tabindex` values > 0 found

**Check skip link implementation:**
```bash
# Should find a skip link in header
grep -A 3 'skip.*content' dist/index.html | head -10
```

#### **E. ARIA Labels and Roles**
Check proper use of ARIA attributes:

```bash
# Find ARIA attributes
grep -r 'aria-' dist/*.html | head -30

# Check for role attributes
grep -r 'role=' dist/*.html | head -20
```

**Validation criteria:**
- ✅ ARIA labels used appropriately (not overused)
- ✅ `aria-label` or `aria-labelledby` on icon buttons
- ✅ `aria-hidden="true"` on decorative icons
- ✅ `aria-live` regions for dynamic content
- ✅ `role` attributes only when semantic HTML isn't sufficient
- ⚠️ Warn if ARIA is redundant (e.g., `<button role="button">`)
- ❌ Error if invalid ARIA attributes

**Common patterns:**
- Icon-only buttons: `<button aria-label="Close menu">`
- Decorative icons: `<svg aria-hidden="true">`
- Live regions: `<div aria-live="polite">` (for status updates)

#### **F. Form Accessibility**
Audit form elements:

```bash
# Find all forms
grep -r '<form' dist/*.html

# Check for labels
grep -r '<label' dist/*.html

# Check for required fields
grep -r 'required' dist/*.html
```

**Validation criteria:**
- ✅ All inputs have associated `<label>` elements
- ✅ Labels use `for` attribute matching input `id`
- ✅ Required fields indicated (visually and with `required` attribute)
- ✅ Error messages are announced to screen readers
- ✅ Input types are semantic (`type="email"`, `type="tel"`, etc.)
- ✅ Autocomplete attributes for common fields
- ❌ Error if inputs without labels
- ❌ Error if form validation errors not accessible

**Example check:**
```bash
# Search for contact form or search form
grep -A 20 '<form' dist/index.html
```

#### **G. Link Accessibility**
Check links are accessible:

```bash
# Find links without text content (possible icon-only links)
grep -r '<a' dist/*.html | grep -v '</a>' | head -20

# Find links with generic text
grep -r '>click here<\|>read more<\|>learn more<' dist/*.html
```

**Validation criteria:**
- ✅ All links have descriptive text (not "click here" or "read more")
- ✅ Links have sufficient color contrast
- ✅ Links are distinguishable from surrounding text (underline or bold)
- ✅ Icon-only links have `aria-label` or visually-hidden text
- ✅ External links indicate they open externally (icon or text)
- ⚠️ Warn if generic link text found
- ❌ Error if icon-only links without aria-label

**External link indicator:**
```bash
# Check for external link handling
grep -r 'target="_blank"' dist/*.html | head -10
```

External links should have:
- `rel="noopener noreferrer"` (security)
- Visual indicator (icon or "(opens in new tab)" text)

#### **H. Media Accessibility**
Check video and audio content:

```bash
# Find video elements
grep -r '<video' dist/*.html

# Find audio elements
grep -r '<audio' dist/*.html
```

**Validation criteria:**
- ✅ Videos have captions (`<track kind="captions">`)
- ✅ Videos have transcripts (linked or embedded)
- ✅ Audio content has transcripts
- ✅ Autoplay is disabled (or user-controlled)
- ✅ Media controls are keyboard accessible
- ⚠️ Warn if video without captions
- ❌ Error if video autoplays with sound

#### **I. Responsive and Zoom**
Check responsive design and zoom compatibility:

```bash
# Check viewport meta tag
grep 'viewport' dist/index.html

# Check for fixed font sizes that prevent zoom
grep -E 'font-size:.*px' dist/_astro/main.*.css | grep -v 'calc\|clamp'
```

**Validation criteria:**
- ✅ Viewport meta tag present and correct
- ✅ Content reflows at 400% zoom
- ✅ No horizontal scrolling at mobile viewports
- ✅ Font sizes scale with zoom (use rem/em, not fixed px)
- ✅ Touch targets ≥ 44×44 pixels (mobile)
- ⚠️ Warn if many fixed pixel font sizes

**Viewport meta tag should be:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

NOT:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

#### **J. Language Declaration**
Check HTML lang attribute:

```bash
grep '<html' dist/index.html
```

**Validation criteria:**
- ✅ `<html lang="en">` present (or appropriate language)
- ✅ `lang` attribute on sections with different languages
- ❌ Error if no `lang` attribute on `<html>`

### 3. Generate Audit Report
Compile findings into a structured report:

```
♿ Accessibility Audit Report
Generated: [Date]
Standard: WCAG 2.1 Level AA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSED (8/10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Semantic HTML
   ✅ Proper heading hierarchy (h1 → h2 → h3)
   ✅ One h1 per page
   ✅ Semantic landmarks present (header, main, nav, footer)

2. Alt Text
   ✅ All images have alt attributes
   ✅ Alt text is descriptive

3. Color Contrast
   ✅ Primary text: 7.5:1 (exceeds 4.5:1 requirement)
   ✅ Links: Distinguishable by underline + color

4. Keyboard Navigation
   ✅ Skip-to-content link present
   ✅ Focus styles visible
   ✅ Logical tab order

5. ARIA
   ✅ Appropriate use of ARIA labels
   ✅ Icon buttons have aria-label

6. Forms
   ✅ All inputs have labels
   ✅ Required fields indicated

7. Links
   ✅ Link text is descriptive
   ✅ External links have rel="noopener"

8. Language
   ✅ HTML lang attribute present (lang="en")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ WARNINGS (3 issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Alt Text
   ⚠️ 2 images have generic alt text:
      - /about/team-icon.svg: alt="icon" (add descriptive alt)
      - /blog/post-1/image.png: alt="image" (describe the image)

2. Links
   ⚠️ 3 links use generic text:
      - "Read more" (x2) - add context like "Read more about [topic]"
      - "Click here" (x1) - use descriptive text

3. Color Contrast
   ⚠️ Cannot auto-verify all color combinations
      - Manually test with browser DevTools
      - Check: secondary buttons, code blocks, blockquotes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ERRORS (0 issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No critical accessibility errors found! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority: MEDIUM
1. Improve generic alt text (2 images)
2. Use descriptive link text (3 links)

Priority: LOW
3. Manual color contrast verification with DevTools

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Accessibility Score: 92/100 (Excellent)

WCAG 2.1 Level AA Compliance: ✅ PASS (with minor improvements)

Your portfolio is accessible! Address the warnings for even better a11y.
```

### 4. Offer to Fix Issues
After presenting the report, offer to fix issues:

"Would you like me to fix these accessibility issues?
- Update generic alt text
- Improve link text
- Review color contrast manually?"

## Rules to Follow
- **ALWAYS** build the site first (`npm run build`)
- **ALWAYS** check `dist/` output, not source files
- **ALWAYS** verify skip-to-content link exists
- **ALWAYS** check for proper heading hierarchy
- **ALWAYS** ensure all images have alt attributes
- **NEVER** approve `outline: none` without visible alternative focus style
- **ALWAYS** follow WCAG 2.1 Level AA standards

## Related Skills
- `deploy-portfolio` - Run before deployment
- `audit-seo` - SEO and a11y often overlap
- `audit-performance` - Complete pre-deploy checks

## Related Rules
- `ACCESSIBILITY.md` - Accessibility standards
- `CONTENT_GUIDELINES.md` - Alt text guidelines

## Tools & Validation
- **Browser DevTools**: Chrome/Firefox accessibility panels
- **axe DevTools**: Browser extension for automated a11y testing
- **WAVE**: https://wave.webaim.org/
- **Lighthouse**: Includes accessibility audit
  ```bash
  lighthouse https://pranshujawade.github.io/ --only-categories=accessibility
  ```
- **NVDA** (Windows) or **VoiceOver** (macOS): Screen reader testing
- **Keyboard only**: Navigate site with Tab, Enter, Space, Arrow keys

## Manual Testing Checklist
Automated tools catch ~30-50% of accessibility issues. Manual testing is essential:

- [ ] Navigate entire site with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, VoiceOver, or JAWS)
- [ ] Verify color contrast with DevTools color picker
- [ ] Zoom to 200% and 400%, check layout doesn't break
- [ ] Test on mobile with touch (44px touch targets)
- [ ] Check focus indicators are visible on all interactive elements
- [ ] Verify forms can be completed without mouse
- [ ] Test with browser reader mode

## Error Handling

### Build Failure
```
❌ Cannot audit: Build failed

Please fix build errors first, then re-run the accessibility audit.
```

### Critical Issues
```
❌ Critical Accessibility Issues Found

**WCAG 2.1 Level AA Failures:**
1. No skip-to-content link (REQUIRED)
2. 5 images without alt attributes (REQUIRED)
3. Heading hierarchy broken: h1 → h3 (skips h2) (REQUIRED)

These issues MUST be fixed before deployment.
Your site is currently not accessible to users with disabilities.

Would you like me to fix these issues now?
```

## Example Interaction

**User:** "Check my portfolio's accessibility"

**Agent:**
"I'll run a comprehensive accessibility audit following WCAG 2.1 Level AA standards. Let me build the site first...

[Runs npm run build]

✅ Build successful

Auditing accessibility...

[Checks semantic HTML, alt text, contrast, keyboard nav, ARIA, etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

♿ Accessibility Audit Report
Generated: 2026-02-23
Standard: WCAG 2.1 Level AA

[Detailed report with all checks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Accessibility Score: 92/100 (Excellent)

WCAG 2.1 Level AA Compliance: ✅ PASS

Found 3 minor warnings (no critical errors):
1. 2 images with generic alt text
2. 3 links with generic text ("read more")
3. Manual color contrast verification recommended

Would you like me to fix these warnings?"

**User:** "yes please"

**Agent:**
"I'll improve the accessibility issues...

[Updates alt text for images]
[Improves link text with context]

✅ Fixes applied

Running audit again to verify...

[Re-runs audit]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Accessibility Score: 98/100 (Excellent)

WCAG 2.1 Level AA Compliance: ✅ PASS

All automated checks passed! 🎉

**Recommended Manual Testing:**
- Navigate with keyboard only
- Test with screen reader
- Verify color contrast in DevTools

Your portfolio is now fully accessible!"
