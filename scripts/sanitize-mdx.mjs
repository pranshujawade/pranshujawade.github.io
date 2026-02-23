/**
 * sanitize-mdx.mjs
 * Transforms MDX content into portable Markdown suitable for
 * Dev.to and Hashnode by stripping Astro-specific features.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Parse frontmatter and body from an MDX file.
 */
export function parseFrontmatterAndBody(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const rawFrontmatter = match[1];
  const body = match[2].trim();

  const frontmatter = {};
  for (const line of rawFrontmatter.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Handle arrays (simple inline YAML)
    if (value.startsWith('[')) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        // leave as string if parse fails
      }
    }
    // Handle booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    frontmatter[key] = value;
  }

  // Handle multi-line YAML arrays (results, tags, technologies)
  const arrayRegex = /^(\w+):\s*\n((?:\s+-\s+.+\n?)+)/gm;
  let arrayMatch;
  while ((arrayMatch = arrayRegex.exec(rawFrontmatter)) !== null) {
    const key = arrayMatch[1];
    const items = arrayMatch[2]
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => {
        let val = line.replace(/^\s*-\s*/, '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        return val;
      });
    frontmatter[key] = items;
  }

  return { frontmatter, body };
}

/**
 * Sanitize MDX body into portable Markdown.
 * - Removes import statements
 * - Converts Astro/JSX components to plain markdown
 * - Resolves relative image paths to absolute URLs
 */
export function sanitizeBody(body, siteUrl) {
  let sanitized = body;

  // Remove import statements
  sanitized = sanitized.replace(/^import\s+.*?;\s*$/gm, '');

  // Remove Astro component usage (self-closing tags like <Component />)
  sanitized = sanitized.replace(/<[A-Z]\w+\s*[^>]*\/>/g, '');

  // Convert Astro components with children to just their text content
  sanitized = sanitized.replace(/<[A-Z]\w+[^>]*>([\s\S]*?)<\/[A-Z]\w+>/g, '$1');

  // Resolve relative image paths to absolute
  sanitized = sanitized.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_, alt, path) => `![${alt}](${siteUrl}${path.startsWith('/') ? '' : '/'}${path})`
  );

  // Resolve relative links to absolute
  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((?!https?:\/\/)(?!#)([^)]+)\)/g,
    (_, text, path) => `[${text}](${siteUrl}${path.startsWith('/') ? '' : '/'}${path})`
  );

  // Clean up extra blank lines (more than 2 consecutive)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  return sanitized.trim();
}

/**
 * Read and sanitize an MDX file, returning frontmatter + clean Markdown body.
 */
export async function sanitizeMdxFile(filePath, siteUrl) {
  const content = await readFile(resolve(filePath), 'utf-8');
  const { frontmatter, body } = parseFrontmatterAndBody(content);
  const sanitizedBody = sanitizeBody(body, siteUrl);
  return { frontmatter, body: sanitizedBody };
}
