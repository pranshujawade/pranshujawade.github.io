# ACCESSIBILITY.md

**Purpose:** Web accessibility standards and WCAG 2.1 Level AA compliance guidelines  
**Scope:** Semantic HTML, ARIA, keyboard navigation, screen readers, color contrast  
**Last Updated:** 2026-02-23

---

## Accessibility Standards

### Target Compliance Level
**WCAG 2.1 Level AA**

### Why Accessibility Matters
- **Legal requirement** in many jurisdictions
- **Better UX** for everyone, not just users with disabilities
- **SEO benefits**: Search engines favor accessible sites
- **Inclusive design**: Reaches broader audience

### Testing Requirements
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver, JAWS)
- Automated testing with Lighthouse
- Color contrast verification

---

## Semantic HTML

### Use Semantic Elements

Semantic HTML provides meaning and structure that assistive technologies can understand.

#### Landmark Elements

```astro
<!-- ✅ GOOD - Semantic landmarks -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation links -->
  </nav>
</header>

<main>
  <article>
    <!-- Main content -->
  </article>
  
  <aside>
    <!-- Sidebar content -->
  </aside>
</main>

<footer>
  <!-- Footer content -->
</footer>

<!-- ❌ BAD - Generic div soup -->
<div class="header">
  <div class="nav">
    <!-- Navigation -->
  </div>
</div>

<div class="content">
  <!-- Main content -->
</div>

<div class="footer">
  <!-- Footer -->
</div>
```

#### Semantic Landmarks Reference

| Element | Purpose | Max per page |
|---------|---------|--------------|
| `<header>` | Site/section header | Multiple OK |
| `<nav>` | Navigation menu | Multiple OK (use aria-label to differentiate) |
| `<main>` | Primary content | **One only** |
| `<article>` | Self-contained content (blog post, case study) | Multiple OK |
| `<section>` | Thematic grouping | Multiple OK |
| `<aside>` | Tangentially related content | Multiple OK |
| `<footer>` | Site/section footer | Multiple OK |

### Content Structure Elements

```astro
<!-- ✅ GOOD - Semantic content -->
<article>
  <header>
    <h1>Blog Post Title</h1>
    <time datetime="2026-02-23">February 23, 2026</time>
  </header>
  
  <section>
    <h2>Section Title</h2>
    <p>Content paragraph.</p>
  </section>
  
  <footer>
    <p>Author: Pranshu Jawade</p>
  </footer>
</article>

<!-- ❌ BAD - Non-semantic -->
<div class="article">
  <div class="title">Blog Post Title</div>
  <div class="date">February 23, 2026</div>
  <div class="content">Content paragraph.</div>
</div>
```

---

## Heading Hierarchy

### Rules
- **One H1 per page** (the page title)
- **Logical hierarchy**: H1 → H2 → H3 (don't skip levels)
- **Descriptive headings**: Convey structure and meaning
- **No styling-only headings**: Don't use headings just for visual appearance

```astro
<!-- ✅ GOOD - Logical hierarchy -->
<h1>Building Modern Portfolios</h1>

<h2>Choosing a Framework</h2>
<h3>Why Astro?</h3>
<h3>Alternatives to Consider</h3>

<h2>Styling Approaches</h2>
<h3>Tailwind CSS Benefits</h3>

<!-- ❌ BAD - Skipped level -->
<h1>Building Modern Portfolios</h1>
<h3>Why Astro?</h3> <!-- Skipped H2 -->

<!-- ❌ BAD - Multiple H1s -->
<h1>Page Title</h1>
<h1>Section Title</h1> <!-- Should be H2 -->

<!-- ❌ BAD - Styling-only heading -->
<h3 class="small-text">Note:</h3> <!-- Should be <p><strong> or styled differently -->
```

### Screen Reader Navigation
Users navigate by landmarks and headings, so proper hierarchy is critical:

```
Page Title (H1)
├── Section 1 (H2)
│   ├── Subsection A (H3)
│   └── Subsection B (H3)
└── Section 2 (H2)
    └── Subsection C (H3)
```

---

## Language Attribute

### HTML Lang Attribute

Always set the language on the `<html>` tag:

```astro
<!-- ✅ GOOD -->
<html lang="en">

<!-- For specific locales -->
<html lang="en-US">
```

### Inline Language Changes

If content includes text in another language:

```html
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```

---

## Skip Links

### Purpose
Allow keyboard users to skip repetitive content (navigation) and jump to main content.

### Implementation

```astro
---
// src/layouts/BaseLayout.astro
---
<html lang="en">
<head>
  <!-- Head content -->
</head>
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>
  
  <header>
    <nav>
      <!-- Navigation -->
    </nav>
  </header>
  
  <main id="main-content" tabindex="-1">
    <!-- Main content -->
  </main>
</body>
</html>
```

### Skip Link Styling

```css
/* src/styles/global.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**How it works:**
- Hidden by default (positioned off-screen)
- Becomes visible when focused via Tab key
- First focusable element on the page

---

## Keyboard Navigation

### Requirements
All interactive elements must be keyboard accessible:
- **Tab**: Move forward through interactive elements
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Navigate within components (select, radio, etc.)
- **Esc**: Close modals and dialogs

### Focus Management

#### Visible Focus Indicators

```css
/* ✅ GOOD - Visible focus */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ❌ BAD - Removed focus */
*:focus {
  outline: none; /* Never do this without alternative */
}
```

#### Custom Focus Styles

```css
/* Tailwind utility classes */
.focus-visible:outline-2
.focus-visible:outline-blue-600
.focus-visible:outline-offset-2

/* Or custom styles */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

### Interactive Element Requirements

```astro
<!-- ✅ GOOD - Native button (keyboard accessible) -->
<button type="button" onClick={handleClick}>
  Click me
</button>

<!-- ❌ BAD - Div as button (not keyboard accessible) -->
<div onClick={handleClick}>
  Click me
</div>

<!-- ✅ ACCEPTABLE - Div with ARIA (but prefer native button) -->
<div role="button" tabindex="0" onClick={handleClick} onKeyDown={handleKeyDown}>
  Click me
</div>
```

### Tab Order

```astro
<!-- Natural tab order (follows DOM order) -->
<input type="text" /> <!-- Tab 1 -->
<button>Submit</button> <!-- Tab 2 -->
<a href="/link">Link</a> <!-- Tab 3 -->

<!-- ❌ BAD - Custom tab order (confusing for users) -->
<input type="text" tabindex="3" />
<button tabindex="1">Submit</button>
<a href="/link" tabindex="2">Link</a>

<!-- ✅ GOOD - Remove from tab order when appropriate -->
<div tabindex="-1" id="focus-target">
  Can be programmatically focused, but not in tab order
</div>
```

---

## Images and Alt Text

### Alt Text Rules

#### Informative Images
Describe the image content and function:

```astro
<!-- ✅ GOOD - Descriptive alt text -->
<Image 
  src={portrait} 
  alt="Pranshu Jawade presenting at a web development conference in front of an audience" 
  width={400} 
  height={300}
/>

<!-- ❌ BAD - Non-descriptive -->
<img src="image.jpg" alt="image" />
<img src="portrait.jpg" alt="portrait" />
<img src="photo.jpg" alt="photo of person" />
```

#### Decorative Images
Use empty alt text:

```astro
<!-- ✅ GOOD - Decorative image -->
<Image 
  src={decorativeBorder} 
  alt="" 
  role="presentation"
  width={100} 
  height={10}
/>
```

#### Images with Adjacent Text
Avoid repeating information:

```astro
<!-- ✅ GOOD - Alt text adds context -->
<a href="/blog/post-slug">
  <Image src={thumbnail} alt="Thumbnail showing code editor with TypeScript" />
  <h3>TypeScript Best Practices</h3>
</a>

<!-- ❌ BAD - Redundant alt text -->
<a href="/blog/post-slug">
  <img src="thumb.jpg" alt="TypeScript Best Practices" />
  <h3>TypeScript Best Practices</h3>
</a>

<!-- ✅ GOOD - Empty alt since context provided by heading -->
<a href="/blog/post-slug">
  <Image src={thumbnail} alt="" />
  <h3>TypeScript Best Practices</h3>
</a>
```

#### Complex Images (Diagrams, Charts)
Provide detailed description:

```astro
<!-- ✅ GOOD - Detailed description -->
<figure>
  <Image 
    src={architectureDiagram} 
    alt="System architecture diagram showing client, API layer, and database with arrows indicating data flow"
    width={800}
    height={600}
  />
  <figcaption>
    Detailed explanation: The client sends HTTP requests to the API layer,
    which processes them and queries the PostgreSQL database...
  </figcaption>
</figure>
```

### Image Guidelines Summary

| Image Type | Alt Text | Example |
|------------|----------|---------|
| Informative | Describe content/function | `alt="Bar chart showing 50% increase"` |
| Decorative | Empty alt + role | `alt="" role="presentation"` |
| Text in image | Include exact text | `alt="Error: File not found"` |
| Link image | Describe destination | `alt="View GitHub repository"` |
| Complex | Detailed description | Use figcaption or aria-describedby |

---

## Links

### Link Text Requirements

```astro
<!-- ✅ GOOD - Descriptive link text -->
<a href="/blog/astro-guide">Read the complete Astro guide</a>
<a href="/contact">Contact me about this project</a>
<a href="https://docs.astro.build">Visit the official Astro documentation</a>

<!-- ❌ BAD - Generic text -->
<a href="/blog/astro-guide">Click here</a>
<a href="/contact">Learn more</a>
<a href="https://docs.astro.build">Visit this link</a>
```

### Link Purpose
Users should understand where a link goes without surrounding context:

```astro
<!-- ✅ GOOD - Standalone clarity -->
<p>I recently wrote about Astro performance.</p>
<a href="/blog/astro-performance">Read the Astro performance guide</a>

<!-- ❌ BAD - Needs context -->
<p>I recently wrote about Astro performance.</p>
<a href="/blog/astro-performance">Read more</a>
```

### External Links

```astro
<!-- ✅ GOOD - External link with proper attributes -->
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
  aria-label="Visit Example.com (opens in new tab)"
>
  Example.com
</a>

<!-- ✅ GOOD - Visual indicator -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Example.com
  <span class="sr-only">(opens in new tab)</span>
  <Icon name="external-link" aria-hidden="true" />
</a>
```

### Link vs. Button

| Use Link | Use Button |
|----------|------------|
| Navigate to URL | Trigger action |
| href attribute | onClick handler |
| Opens new page/section | Submit form, open modal |
| Can be bookmarked | Cannot be bookmarked |

```astro
<!-- ✅ GOOD - Link for navigation -->
<a href="/about">About Me</a>

<!-- ✅ GOOD - Button for actions -->
<button type="button" onClick={openModal}>Show Details</button>

<!-- ❌ BAD - Link for action -->
<a href="#" onClick={openModal}>Show Details</a>

<!-- ❌ BAD - Button for navigation -->
<button onClick={() => navigate('/about')}>About Me</button>
```

---

## Color Contrast

### WCAG AA Requirements

| Content Type | Contrast Ratio |
|--------------|----------------|
| Normal text (< 18pt) | **4.5:1** minimum |
| Large text (≥ 18pt or bold ≥ 14pt) | **3:1** minimum |
| UI components & graphics | **3:1** minimum |

### Testing Tools
- Chrome DevTools (Inspect > Accessibility)
- WebAIM Contrast Checker
- Lighthouse Accessibility Audit

### Common Issues

```css
/* ❌ BAD - Insufficient contrast */
.text-gray-400 on white background /* Only 2.5:1 contrast */
.text-blue-500 on .bg-blue-600 /* Too similar */

/* ✅ GOOD - Sufficient contrast */
.text-gray-900 on white background /* 19:1 contrast */
.text-white on .bg-blue-600 /* 8:1 contrast */
```

### Tailwind Color Contrast Examples

```astro
<!-- ✅ GOOD - High contrast -->
<p class="text-gray-900">Dark text on white background</p>
<p class="text-white bg-gray-900">White text on dark background</p>

<!-- ❌ BAD - Low contrast -->
<p class="text-gray-400">Light gray text on white background</p>
<p class="text-blue-400 bg-blue-500">Similar blues</p>
```

### Don't Rely on Color Alone

```astro
<!-- ❌ BAD - Color only -->
<p class="text-red-600">Error: Invalid input</p>
<p class="text-green-600">Success: Saved</p>

<!-- ✅ GOOD - Color + icon/text -->
<p class="text-red-600">
  <Icon name="error" aria-hidden="true" />
  <span class="font-semibold">Error:</span> Invalid input
</p>

<p class="text-green-600">
  <Icon name="check" aria-hidden="true" />
  <span class="font-semibold">Success:</span> Saved
</p>
```

---

## ARIA (Accessible Rich Internet Applications)

### When to Use ARIA
- **First rule**: Use native HTML when possible
- **Second rule**: Don't override native semantics unless necessary
- **Third rule**: All interactive ARIA controls must be keyboard accessible

### Common ARIA Attributes

#### `aria-label`
Provides accessible name when visual label is absent:

```astro
<!-- ✅ GOOD - Icon-only button -->
<button aria-label="Close menu">
  <Icon name="close" aria-hidden="true" />
</button>

<!-- ❌ BAD - No label -->
<button>
  <Icon name="close" />
</button>
```

#### `aria-labelledby`
References another element for the label:

```astro
<section aria-labelledby="projects-heading">
  <h2 id="projects-heading">Featured Projects</h2>
  <!-- Projects -->
</section>
```

#### `aria-describedby`
Provides additional description:

```astro
<input 
  type="email" 
  aria-describedby="email-help"
  required
/>
<p id="email-help">We'll never share your email address.</p>
```

#### `aria-hidden`
Hides decorative content from screen readers:

```astro
<!-- ✅ GOOD - Decorative icon hidden -->
<button>
  <Icon name="save" aria-hidden="true" />
  Save Changes
</button>

<!-- Text provides context, icon is decorative -->
```

#### `aria-live`
Announces dynamic content changes:

```astro
<!-- Polite: Announce when user is idle -->
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

<!-- Assertive: Announce immediately (errors) -->
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>
```

### ARIA Roles

#### Navigation

```astro
<!-- ✅ GOOD - Multiple navs with labels -->
<nav aria-label="Main navigation">
  <!-- Primary nav -->
</nav>

<nav aria-label="Footer navigation">
  <!-- Footer links -->
</nav>
```

#### Alerts

```astro
<div role="alert" class="error-message">
  <p>Your session has expired. Please log in again.</p>
</div>
```

#### Status

```astro
<div role="status" aria-live="polite">
  <p>Loading...</p>
</div>
```

---

## Forms (if applicable)

### Label Every Input

```astro
<!-- ✅ GOOD - Explicit label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required />

<!-- ✅ GOOD - Implicit label -->
<label>
  Email Address
  <input type="email" name="email" required />
</label>

<!-- ❌ BAD - No label -->
<input type="email" placeholder="Email Address" />
```

### Required Fields

```astro
<!-- ✅ GOOD - Accessible required indicator -->
<label for="name">
  Name
  <span aria-label="required">*</span>
</label>
<input type="text" id="name" required aria-required="true" />

<!-- Visual and programmatic indication -->
```

### Error Messages

```astro
<!-- ✅ GOOD - Associated error message -->
<label for="email">Email</label>
<input 
  type="email" 
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<p id="email-error" role="alert">
  Please enter a valid email address.
</p>
```

---

## Screen Reader Only Content

### Visually Hidden, Screen Reader Visible

```css
/* src/styles/global.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Make visible when focused (for skip links) */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Usage

```astro
<button>
  <Icon name="github" aria-hidden="true" />
  <span class="sr-only">View on GitHub</span>
</button>

<!-- Icon is visible, text is screen-reader-only -->
```

---

## Testing Checklist

### Manual Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Skip link appears on Tab
- [ ] No keyboard traps
- [ ] Logical tab order

#### Screen Reader Testing
- [ ] All content is announced
- [ ] Images have meaningful alt text
- [ ] Links are descriptive
- [ ] Headings are in logical order
- [ ] Forms have proper labels

#### Visual Testing
- [ ] Text contrast meets 4.5:1 (normal) or 3:1 (large)
- [ ] Content is readable at 200% zoom
- [ ] No loss of functionality at mobile sizes
- [ ] Focus indicators are visible

### Automated Testing

#### Lighthouse
```bash
# Run Lighthouse audit
npm run build
npm run preview
# Open DevTools > Lighthouse > Accessibility
```

**Target:** 100 score

#### axe DevTools
Browser extension for automated accessibility testing

### Screen Reader Testing Tools

| Platform | Screen Reader | Keyboard Shortcut |
|----------|---------------|-------------------|
| Windows | NVDA (free) | Ctrl + Alt + N |
| macOS | VoiceOver (built-in) | Cmd + F5 |
| iOS | VoiceOver (built-in) | Settings > Accessibility |
| Android | TalkBack (built-in) | Settings > Accessibility |

---

## Common Accessibility Issues

### Issue: Missing Alt Text
**Solution:** Add descriptive alt text to all images

### Issue: Poor Color Contrast
**Solution:** Use Tailwind colors with sufficient contrast (e.g., gray-900 on white)

### Issue: No Keyboard Access
**Solution:** Use native buttons/links, add keyboard event handlers if needed

### Issue: Missing Form Labels
**Solution:** Always associate labels with inputs

### Issue: Skipped Heading Levels
**Solution:** Use logical hierarchy (H1 → H2 → H3)

### Issue: Unclear Link Purpose
**Solution:** Use descriptive link text, not "click here"

### Issue: No Focus Indicators
**Solution:** Never remove outlines without providing alternative

---

## Accessibility Statement

Consider adding an accessibility statement page:

```markdown
## Accessibility Statement

I am committed to ensuring digital accessibility for people with disabilities. 
I am continually improving the user experience for everyone and applying the 
relevant accessibility standards.

### Conformance Status
This website aims to conform to WCAG 2.1 Level AA standards.

### Feedback
If you encounter any accessibility barriers, please contact me at [email].

### Technical Specifications
This website's accessibility relies on:
- HTML5
- CSS3
- ARIA attributes
- JavaScript (progressive enhancement)
```

---

## Summary

**Core Principles:**
- Use semantic HTML first
- Provide text alternatives for non-text content
- Ensure keyboard accessibility
- Use sufficient color contrast
- Don't rely on color alone
- Test with real screen readers

**Quick Wins:**
- Add skip link
- Use semantic landmarks
- Write descriptive alt text
- Ensure visible focus indicators
- Test keyboard navigation
- Run Lighthouse audit

**Remember:**
Accessibility is not optional. It's a fundamental requirement for inclusive web design.

**Reference:**
- SEO_REQUIREMENTS.md for structured data
- CODING_STANDARDS.md for component patterns
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
