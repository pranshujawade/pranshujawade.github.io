# Deploy Portfolio

## Description
Deploy the Astro portfolio to GitHub Pages with pre-deployment checks and automated deployment via GitHub Actions.

## When to Use
- User wants to deploy the portfolio
- User says "deploy to production" or "publish the site"
- After significant content or code changes
- After running audits and fixing issues

## Prerequisites
- Project is an Astro 5.x portfolio
- GitHub repository is configured for GitHub Pages
- GitHub Actions workflow exists at `.github/workflows/deploy.yml`
- Remote `origin` points to GitHub repository
- User has push access to `main` branch

## Deployment Model
This portfolio uses **automated deployment via GitHub Actions**:
- Deployments are triggered on push to `main` branch
- Manual deploys are NOT required
- GitHub Actions workflow handles: build, test, and deploy

## Workflow

### 1. Pre-Deployment Checks
Run comprehensive checks before allowing deployment:

#### **Build Check**
```bash
npm run build
```

This command:
- Runs `astro check` (TypeScript + Astro validation)
- Builds the site to `dist/` directory
- Validates all routes and pages
- Checks for broken links (if configured)

Expected output:
```
✓ Getting diagnostics for Astro files in /Users/pjawade/repos/Portfolio...
  Result: 0 errors, 0 warnings, 0 hints

✓ Build successful!
  dist/index.html
  dist/blog/index.html
  ...
```

**Validation:**
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ No Astro validation errors
- ✅ `dist/` directory is populated

#### **Git Status Check**
```bash
git status
```

**Validation:**
- ✅ All changes are committed (working tree clean)
- ✅ On `main` branch (or deployment branch)
- ⚠️ Warn if uncommitted changes exist

#### **Remote Check**
```bash
git remote -v
```

**Validation:**
- ✅ Remote `origin` is configured
- ✅ Remote points to GitHub repository

#### **Branch Check**
```bash
git branch --show-current
```

**Validation:**
- ✅ Currently on `main` branch
- ⚠️ Warn if on different branch

### 2. Pre-Deployment Audit Summary
Present audit results to user:

```
🔍 Pre-Deployment Checks

**Build Status:**
✅ Build successful
✅ TypeScript validation passed
✅ Astro validation passed
✅ Output: dist/ (XX files, XX MB)

**Git Status:**
✅ Working tree clean
✅ Branch: main
✅ Remote: origin → [GitHub URL]
⚠️ Uncommitted changes: [files] (recommend committing first)

**Recommended Actions:**
- Run `audit-seo` skill (optional but recommended)
- Run `audit-performance` skill (optional but recommended)
- Run `audit-accessibility` skill (optional but recommended)

Ready to deploy? This will push to `main` branch and trigger GitHub Actions deployment.
```

### 3. Deployment Process
Once user confirms:

#### **Step 1: Push to Main**
```bash
git push origin main
```

Expected output:
```
Enumerating objects: X, done.
Writing objects: 100% (X/X), done.
To github.com:username/Portfolio.git
   abc1234..def5678  main -> main
```

**Validation:**
- ✅ Push succeeds without errors
- ✅ No merge conflicts
- ✅ GitHub Actions workflow triggered

#### **Step 2: Monitor GitHub Actions**
```bash
gh run list --limit 5
```

Show recent workflow runs and status.

Optional: Watch workflow in real-time
```bash
gh run watch
```

### 4. Deployment Confirmation
After push, inform user:

```
🚀 Deployment Initiated!

**Status:**
✅ Pushed to main branch
✅ GitHub Actions workflow triggered

**Monitoring Deployment:**
- View workflow: gh run watch
- Or visit: [GitHub Actions URL]

**Expected Timeline:**
- Build & Deploy: ~2-5 minutes
- DNS Propagation: ~1-10 minutes (if custom domain)

**Once deployed, your site will be live at:**
- https://pranshujawade.github.io/

I'll continue monitoring the workflow...
```

If monitoring enabled:
```
[Watch GitHub Actions output]

✅ Deployment Complete!

**Deployed Successfully:**
- Site URL: https://pranshujawade.github.io/
- Commit: [hash]
- Deployed at: [timestamp]

**Post-Deployment:**
- Verify site is live: [URL]
- Check for any console errors
- Test navigation and key pages
- Monitor analytics for traffic

🎉 Your portfolio is now live!
```

### 5. Post-Deployment Verification
Optional automated checks:

```bash
# Check if site is reachable
curl -I https://pranshujawade.github.io/
```

Expected: `200 OK` response

Remind user to manually verify:
- [ ] Homepage loads correctly
- [ ] Blog posts are accessible
- [ ] Case studies are visible
- [ ] Navigation works
- [ ] Images load properly
- [ ] No console errors in browser DevTools

## Rules to Follow
- **NEVER** force push to main (`git push --force`) without explicit user permission
- **ALWAYS** run `npm run build` before allowing deployment
- **ALWAYS** check for uncommitted changes and warn user
- **ALWAYS** confirm with user before pushing to main
- **NEVER** deploy if build fails
- **ALWAYS** monitor GitHub Actions after pushing

## Deployment Checklist
Before deploying, ensure:
- [ ] Build completes successfully (`npm run build`)
- [ ] TypeScript validation passes (`astro check`)
- [ ] All changes are committed
- [ ] On correct branch (`main`)
- [ ] Remote is configured (`origin` → GitHub)
- [ ] Content is reviewed (optional: run `content-review`)
- [ ] SEO is optimized (optional: run `audit-seo`)
- [ ] Performance is acceptable (optional: run `audit-performance`)
- [ ] Accessibility is verified (optional: run `audit-accessibility`)

## GitHub Actions Workflow
The deployment is automated via `.github/workflows/deploy.yml`:

**Typical workflow steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Deploy to GitHub Pages (upload `dist/`)

**Workflow triggers:**
- Push to `main` branch
- Manual workflow dispatch (via GitHub UI)

## Related Skills
- `audit-seo` - Pre-deployment SEO check
- `audit-performance` - Pre-deployment performance check
- `audit-accessibility` - Pre-deployment accessibility check
- `content-review` - Review content before deploying

## Related Rules
- `DEPLOYMENT.md` - Deployment procedures
- `SECURITY.md` - Security considerations
- `SEO_REQUIREMENTS.md` - SEO validation

## Error Handling

### Build Failure
```
❌ Build Failed

[Error output]

**Cannot deploy with build errors.** Please fix the following issues:
- [Error 1]
- [Error 2]

After fixing, run `npm run build` again to verify.
```

### Uncommitted Changes
```
⚠️ Warning: Uncommitted Changes

You have uncommitted changes in:
- [file 1]
- [file 2]

**Recommendation:** Commit these changes before deploying to ensure consistency.

Options:
1. Commit changes now
2. Proceed anyway (not recommended)
3. Cancel deployment

What would you like to do?
```

### Wrong Branch
```
⚠️ Warning: Not on Main Branch

Currently on branch: [branch-name]
Deployment requires push to: main

Options:
1. Switch to main branch
2. Merge current branch to main
3. Cancel deployment

What would you like to do?
```

### Push Failure
```
❌ Push Failed

[Error output]

**Common causes:**
- No write access to repository
- Branch protection rules require PR
- Merge conflicts with remote
- Network connectivity issues

**Troubleshooting:**
- Verify GitHub authentication: gh auth status
- Check repository permissions
- Pull latest changes: git pull origin main
- Resolve conflicts if any
```

### GitHub Actions Failure
```
❌ Deployment Failed

GitHub Actions workflow failed during deployment.

**View error details:**
- gh run view [run-id]
- Or visit: [GitHub Actions URL]

**Common causes:**
- Build errors in CI environment
- Dependency installation failures
- GitHub Pages configuration issues
- Workflow permission errors

After fixing issues, push again to retry deployment.
```

## Example Interaction

**User:** "Deploy my portfolio"

**Agent:**
"I'll help you deploy your portfolio to GitHub Pages. Let me run pre-deployment checks first...

[Runs npm run build]

✅ Build successful!

[Runs git status]

⚠️ You have uncommitted changes:
- src/content/blog/2026-02-new-post.mdx

Would you like to commit these changes before deploying? (recommended)"

**User:** "yes"

**Agent:**
"I'll commit the changes first.

[Creates commit]

✅ Changes committed

**Pre-Deployment Summary:**
✅ Build: Successful
✅ Git: Clean working tree, on main branch
✅ Remote: github.com/pranshujawade/Portfolio.git

**Optional Pre-Deployment Audits:**
Would you like me to run SEO, performance, or accessibility audits before deploying? (recommended but optional)"

**User:** "no, just deploy"

**Agent:**
"Understood. Deploying now...

[Runs git push origin main]

🚀 Deployment Initiated!

✅ Pushed to main branch
✅ GitHub Actions workflow triggered

Monitoring deployment...

[Runs gh run watch]

✅ Deployment Complete!

**Your portfolio is now live at:**
🌐 https://pranshujawade.github.io/

**Post-Deployment Checklist:**
- [ ] Verify homepage loads
- [ ] Check blog posts
- [ ] Test navigation
- [ ] Check for console errors

🎉 Deployment successful!"
