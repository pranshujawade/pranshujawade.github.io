# SECURITY.md

**Purpose:** Security best practices, secret management, dependency security, and attack prevention  
**Scope:** GitHub Pages limitations, secrets handling, external resources, dependencies  
**Last Updated:** 2026-02-23

---

## Security Context

### Static Site Limitations
- **No server-side code**: This is a static site (no Node.js server, no database)
- **No user authentication**: No login system or user accounts
- **No user-generated content**: All content is authored and deployed by you
- **Limited attack surface**: Fewer security concerns than dynamic applications

### GitHub Pages Security
- **HTTPS enforced**: Automatic SSL certificate
- **DDoS protection**: Cloudflare CDN
- **No custom headers**: Cannot set CSP, HSTS, or other security headers via config
- **Static file serving**: No server-side processing

---

## HTTP Security Headers

### GitHub Pages Limitation
**Important:** GitHub Pages does not allow custom HTTP headers (CSP, HSTS, X-Frame-Options, etc.) through configuration. These are managed by GitHub.

### What GitHub Pages Provides
- **HTTPS enforcement**: Automatically redirects HTTP to HTTPS
- **Basic security headers**: GitHub sets some headers automatically
- **CDN protection**: Cloudflare provides DDoS protection

### What You Cannot Configure
- Custom Content-Security-Policy (CSP)
- Custom HTTP Strict Transport Security (HSTS)
- Custom X-Frame-Options
- Custom X-Content-Type-Options

### Alternative: Meta Tags
Some security policies can be set via meta tags:

```astro
<!-- src/components/BaseHead.astro -->

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin" />

<!-- X-UA-Compatible (for IE) -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

#### Referrer Policy Options

```
strict-origin-when-cross-origin (recommended)
- Same-origin: Full URL
- Cross-origin HTTPS→HTTPS: Origin only
- Cross-origin HTTPS→HTTP: No referrer

Other options:
- no-referrer: Never send referrer
- no-referrer-when-downgrade: Send unless HTTPS→HTTP
- origin: Always send origin only
- strict-origin: Origin only, no HTTPS→HTTP
```

---

## External Links Security

### Required Attributes

**Always use `rel="noopener noreferrer"` with `target="_blank"`:**

```astro
<!-- ✅ GOOD - Secure external link -->
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  External Link
</a>

<!-- ❌ BAD - Missing security attributes -->
<a href="https://example.com" target="_blank">
  External Link
</a>
```

### Why This Matters

#### `rel="noopener"`
Prevents the new page from accessing `window.opener` and potential tabnabbing attacks.

**Without `noopener`:**
```javascript
// Malicious site can redirect your site
window.opener.location = 'https://phishing-site.com';
```

#### `rel="noreferrer"`
Prevents sending referrer information to the external site (privacy benefit).

### Reusable Component

```astro
---
// src/components/ui/ExternalLink.astro
interface Props {
  href: string;
  children: any;
}

const { href, children } = Astro.props;
---

<a 
  href={href} 
  target="_blank" 
  rel="noopener noreferrer"
  class="external-link"
>
  {children}
  <span class="sr-only">(opens in new tab)</span>
</a>
```

---

## Asset Security

### Self-Host All Assets

**Never use CDN JavaScript** (potential supply chain attack vector):

```astro
<!-- ❌ BAD - CDN script -->
<script src="https://cdn.jsdelivr.net/npm/library@1.0.0/lib.js"></script>

<!-- ✅ GOOD - Self-hosted (via npm) -->
<script src="/scripts/library.js"></script>
```

### Font Self-Hosting

```astro
<!-- ❌ BAD - Google Fonts CDN -->
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

<!-- ✅ GOOD - Self-hosted fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

**Why self-host:**
- No third-party requests (privacy)
- No dependency on external service (reliability)
- Better performance (fewer DNS lookups)
- No tracking by font providers

### Subresource Integrity (SRI)

If you **must** use external resources, add SRI hashes:

```html
<!-- ✅ GOOD - External resource with SRI -->
<script 
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

**Generate SRI hashes:**
```bash
# Using openssl
curl https://example.com/library.js | openssl dgst -sha384 -binary | openssl base64 -A

# Using SRI Hash Generator
# https://www.srihash.org/
```

---

## Secrets Management

### Never Commit Secrets

**Never commit these to git:**
- API keys (Dev.to, Hashnode, etc.)
- Access tokens
- Private keys
- Passwords
- Environment variables with sensitive data

### Use GitHub Secrets

Store secrets in GitHub repository settings:

```
Repository Settings > Secrets and variables > Actions
```

**Required secrets for this project:**
- `DEVTO_API_KEY` - Dev.to API authentication
- `HASHNODE_PAT` - Hashnode Personal Access Token  
- `HASHNODE_PUBLICATION_ID` - Hashnode publication ID

### Accessing Secrets in GitHub Actions

```yaml
# .github/workflows/syndicate.yml
jobs:
  syndicate:
    runs-on: ubuntu-latest
    steps:
      - name: Syndicate to Dev.to
        env:
          DEVTO_API_KEY: ${{ secrets.DEVTO_API_KEY }}
        run: npm run syndicate:devto
```

### Local Development

**For local testing:**

```bash
# .env.local (add to .gitignore)
DEVTO_API_KEY=your_dev_to_api_key
HASHNODE_PAT=your_hashnode_token
HASHNODE_PUBLICATION_ID=your_publication_id
```

```javascript
// .gitignore
.env
.env.local
.env.*.local
```

### Validate .gitignore

```bash
# Check what would be committed
git status

# Verify .env is ignored
git check-ignore .env
# Should output: .env
```

---

## API Key Security

### Client-Side API Calls
**NEVER put API keys in client-side code** (they will be visible in browser):

```typescript
// ❌ BAD - API key exposed
const API_KEY = 'sk_live_51234567890';
fetch(`https://api.example.com?key=${API_KEY}`);
```

### Build-Time API Calls
API calls during build (in Astro frontmatter) are safe - the key never reaches the client:

```astro
---
// ✅ GOOD - Build-time only
const API_KEY = import.meta.env.DEVTO_API_KEY;
const posts = await fetch(`https://dev.to/api/articles`, {
  headers: { 'api-key': API_KEY }
});
---
```

### Environment Variable Access

```typescript
// ✅ GOOD - Build-time environment variables
const apiKey = import.meta.env.DEVTO_API_KEY;

// Note: Astro uses import.meta.env, not process.env
// Only available at build time, not in client-side code
```

---

## Dependency Security

### Dependabot

GitHub Dependabot automatically creates PRs for security updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### npm Audit

Run security audits regularly:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (patch and minor updates)
npm audit fix

# Fix all (including breaking changes)
npm audit fix --force
```

### CI Pipeline Integration

```yaml
# .github/workflows/deploy.yml
- name: Security Audit
  run: npm audit --audit-level=high
```

**Audit levels:**
- `low`: Report low severity and above
- `moderate`: Report moderate and above
- `high`: Report high and critical only
- `critical`: Report critical only

### Package Update Strategy

1. **Review PRs from Dependabot**: Check changelog and test locally
2. **Run npm audit weekly**: Catch new vulnerabilities
3. **Update dependencies monthly**: Stay current, reduce technical debt
4. **Lock file committed**: Ensure consistent installs

```bash
# Update all dependencies (minor and patch)
npm update

# Update specific package to latest
npm install astro@latest

# Check outdated packages
npm outdated
```

---

## Content Security

### No User-Generated Content

This is a **static portfolio** with no user input:
- No comment system
- No contact forms with database
- No file uploads
- No user accounts

**If you add forms later**, use:
- Third-party form services (Formspree, Netlify Forms, etc.)
- Client-side validation + server-side validation
- CAPTCHA for spam prevention
- Rate limiting

### Sanitize MDX Content

If you accept MDX from external sources (unlikely), sanitize it:

```typescript
// ❌ BAD - Arbitrary code execution risk
const mdx = userInput;
await compile(mdx); // Can execute arbitrary JavaScript

// ✅ GOOD - Sanitize and validate
const mdx = sanitizeMDX(userInput);
// Strip: import statements, script tags, eval, Function constructors
```

**For this project:** All content is authored by you, so this is not a concern.

---

## Cross-Site Scripting (XSS) Prevention

### Astro's Built-In Protection

Astro automatically escapes HTML in expressions:

```astro
---
const userInput = '<script>alert("XSS")</script>';
---

<!-- ✅ SAFE - Automatically escaped -->
<p>{userInput}</p>
<!-- Renders: &lt;script&gt;alert("XSS")&lt;/script&gt; -->
```

### set:html Directive (Use with Caution)

```astro
---
const trustedHTML = '<strong>Bold text</strong>';
const untrustedHTML = '<script>alert("XSS")</script>';
---

<!-- ✅ SAFE - Trusted content -->
<div set:html={trustedHTML} />

<!-- ❌ DANGEROUS - Never with untrusted content -->
<div set:html={untrustedHTML} />
```

**Rule:** Only use `set:html` with content you control.

### JSON-LD Schema Injection

```astro
---
// ✅ SAFE - JSON.stringify escapes automatically
const schema = {
  "@type": "Person",
  "name": "Pranshu Jawade"
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

## Client-Side Security

### Minimal Client-Side JavaScript

This project uses minimal client-side JavaScript (static-first approach):
- Most components are static HTML
- Interactive components hydrated selectively
- No eval(), Function(), or innerHTML unless absolutely necessary

### Safe DOM Manipulation

```javascript
// ✅ GOOD - Safe DOM manipulation
element.textContent = userInput; // Automatically escaped

// ❌ BAD - XSS risk
element.innerHTML = userInput; // Can execute scripts
```

---

## Image Security

### User-Uploaded Images (N/A)

This project has no user uploads. If added later:
- Validate file types (allow only images)
- Scan for malware
- Strip EXIF data (privacy)
- Use a CDN with image processing (Cloudinary, Imgix)

### Image Optimization

```astro
<!-- ✅ GOOD - Astro's Image component (built-in security) -->
<Image src={blogCover} alt="Cover" width={1200} height={630} />

<!-- Image is processed at build time, no runtime injection risk -->
```

---

## Iframe Security

### Avoid Iframes When Possible

```astro
<!-- ❌ RISKY - External iframe -->
<iframe src="https://untrusted-site.com"></iframe>

<!-- ✅ BETTER - Embed specific content (YouTube, CodePen) -->
<iframe 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
></iframe>
```

### Sandbox Attribute

```html
<!-- Restrict iframe capabilities -->
<iframe 
  src="https://example.com"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

**Sandbox values:**
- `allow-scripts`: Allow JavaScript
- `allow-same-origin`: Allow same-origin access
- `allow-forms`: Allow form submission
- `allow-popups`: Allow popups
- Empty sandbox: Most restrictive

---

## Link Security

### Prevent Tabnabbing

Already covered in External Links section, but worth repeating:

```astro
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

### Avoid javascript: Links

```astro
<!-- ❌ BAD - XSS vector -->
<a href="javascript:alert('XSS')">Click</a>

<!-- ✅ GOOD - Button for actions -->
<button type="button" onClick={handleClick}>Click</button>
```

---

## Build Security

### Verify Build Integrity

```bash
# Check for suspicious files after build
ls -la dist/

# Verify no secrets in build output
grep -r "api_key" dist/
grep -r "secret" dist/
grep -r "password" dist/
```

### GitHub Actions Security

```yaml
# Use specific versions, not @latest
- uses: actions/checkout@v4 # ✅ GOOD
- uses: actions/checkout@latest # ❌ BAD

# Review third-party actions before using
# Check: Stars, maintenance, source code
```

---

## Incident Response

### If API Key is Leaked

1. **Revoke immediately**: Regenerate key on the platform (Dev.to, Hashnode)
2. **Update GitHub Secret**: Replace with new key
3. **Review access logs**: Check for unauthorized usage
4. **Remove from git history**: Use BFG Repo-Cleaner or git filter-branch

```bash
# Remove secret from git history (nuclear option)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push --force --all
```

### If Dependency Vulnerability is Found

1. **Check npm audit**: `npm audit`
2. **Review advisory**: Understand the impact
3. **Update immediately**: `npm audit fix` or manual update
4. **Redeploy**: Trigger new build
5. **Test thoroughly**: Ensure no breaking changes

---

## Security Checklist

### Before Every Deploy

- [ ] No secrets in code or config files
- [ ] .gitignore includes .env files
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] All fonts and scripts are self-hosted (or use SRI)
- [ ] No eval(), Function(), or innerHTML in client code
- [ ] Images are optimized and from trusted sources
- [ ] Build output contains no sensitive data

### Monthly Reviews

- [ ] Run `npm audit` and fix issues
- [ ] Review Dependabot PRs
- [ ] Update dependencies: `npm update`
- [ ] Check for new security advisories for used packages
- [ ] Rotate API keys (if applicable)

### Quarterly Reviews

- [ ] Review GitHub Actions usage and third-party actions
- [ ] Audit access to GitHub repository
- [ ] Review deployed site for security headers (Lighthouse audit)
- [ ] Check for outdated dependencies: `npm outdated`

---

## Security Resources

### Tools
- **npm audit**: Built-in vulnerability scanner
- **Dependabot**: Automated dependency updates
- **Snyk**: Advanced vulnerability scanning (optional)
- **OWASP ZAP**: Web application security scanner

### Learning Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## Summary

**Key Security Practices:**
- Store secrets in GitHub Secrets, never in code
- Use `rel="noopener noreferrer"` on external links
- Self-host fonts and scripts (no CDN JS)
- Run `npm audit` regularly
- Enable Dependabot for automated updates
- Astro automatically escapes HTML (XSS protection)
- No user-generated content = reduced attack surface

**Remember:**
Security is a continuous process, not a one-time task. Stay informed about vulnerabilities in your dependencies and update regularly.

**Reference:**
- PROJECT.md for GitHub Secrets setup
- DEPLOYMENT.md for CI/CD security
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
