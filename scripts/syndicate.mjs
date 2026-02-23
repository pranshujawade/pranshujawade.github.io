/**
 * syndicate.mjs
 * Main entry point for the syndication pipeline.
 * Called by GitHub Actions when blog content changes.
 *
 * Environment variables:
 *   SYNDICATE_FILES          - Space-separated list of files to process (SECURITY: prevents injection)
 *   DEVTO_API_KEY            - Dev.to API key
 *   HASHNODE_PAT             - Hashnode Personal Access Token
 *   HASHNODE_PUBLICATION_ID  - Hashnode publication ID
 *   SITE_URL                 - Portfolio site URL (default: https://pranshujawade.github.io)
 *
 * If SYNDICATE_FILES is empty or not set, processes all non-draft blog posts.
 */

import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sanitizeMdxFile } from './sanitize-mdx.mjs';
import { publishToDevTo } from './syndicate-devto.mjs';
import { publishToHashnode } from './syndicate-hashnode.mjs';
import { loadState, saveState, isSyndicated, recordSyndication } from './syndication-tracker.mjs';

const SITE_URL = process.env.SITE_URL || 'https://pranshujawade.github.io';
const BLOG_DIR = resolve(import.meta.dirname, '..', 'src', 'content', 'blog');

async function main() {
  const devtoKey = process.env.DEVTO_API_KEY;
  const hashnodePat = process.env.HASHNODE_PAT;
  const hashnodePubId = process.env.HASHNODE_PUBLICATION_ID;

  if (!devtoKey && !hashnodePat) {
    console.log('No API keys configured. Skipping syndication.');
    process.exit(0);
  }

  // SECURITY: Read file list from environment variable, not command line args
  // This prevents command injection attacks via malicious filenames
  const syndicateFilesEnv = process.env.SYNDICATE_FILES?.trim() || '';
  let filePaths = syndicateFilesEnv
    ? syndicateFilesEnv.split(/\s+/).filter(Boolean)
    : [];

  if (filePaths.length === 0) {
    const files = await readdir(BLOG_DIR);
    filePaths = files
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      .map((f) => resolve(BLOG_DIR, f));
  }

  const state = await loadState();
  let hasChanges = false;

  for (const filePath of filePaths) {
    const slug = filePath
      .split('/')
      .pop()
      .replace(/\.mdx?$/, '');

    console.log(`\nProcessing: ${slug}`);

    try {
      const { frontmatter, body } = await sanitizeMdxFile(filePath, SITE_URL);

      // Skip drafts
      if (frontmatter.draft === true || frontmatter.draft === 'true') {
        console.log(`  Skipping (draft): ${slug}`);
        continue;
      }

      const canonicalUrl = `${SITE_URL}/blog/${slug}`;
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const title = frontmatter.title || slug;
      const description = frontmatter.description || '';

      // Add canonical notice at the bottom
      const bodyWithNotice = `${body}\n\n---\n\n*Originally published at [${SITE_URL}/blog/${slug}](${canonicalUrl})*`;

      // Syndicate to Dev.to
      if (devtoKey && !isSyndicated(state, slug, 'devto')) {
        try {
          console.log('  Publishing to Dev.to...');
          const result = await publishToDevTo({
            title,
            body: bodyWithNotice,
            tags,
            description,
            canonicalUrl,
            apiKey: devtoKey,
          });
          recordSyndication(state, slug, 'devto', {
            id: result.id,
            url: result.url,
          });
          console.log(`  Dev.to: Published -> ${result.url}`);
          hasChanges = true;
        } catch (err) {
          console.error(`  Dev.to error: ${err.message}`);
        }
      } else if (isSyndicated(state, slug, 'devto')) {
        console.log('  Dev.to: Already syndicated, skipping.');
      }

      // Syndicate to Hashnode
      if (hashnodePat && hashnodePubId && !isSyndicated(state, slug, 'hashnode')) {
        try {
          console.log('  Publishing to Hashnode...');
          const result = await publishToHashnode({
            title,
            body: bodyWithNotice,
            tags,
            canonicalUrl,
            publicationId: hashnodePubId,
            apiKey: hashnodePat,
          });
          recordSyndication(state, slug, 'hashnode', {
            id: result.id,
            url: result.url,
            slug: result.slug,
          });
          console.log(`  Hashnode: Published -> ${result.url}`);
          hasChanges = true;
        } catch (err) {
          console.error(`  Hashnode error: ${err.message}`);
        }
      } else if (isSyndicated(state, slug, 'hashnode')) {
        console.log('  Hashnode: Already syndicated, skipping.');
      }
    } catch (err) {
      console.error(`  Error processing ${slug}: ${err.message}`);
    }
  }

  if (hasChanges) {
    await saveState(state);
    console.log('\nSyndication state updated.');
  } else {
    console.log('\nNo new syndications needed.');
  }
}

main().catch((err) => {
  console.error('Syndication failed:', err);
  process.exit(1);
});
