/**
 * syndicate-devto.mjs
 * Publishes blog posts to Dev.to via their REST API.
 * Sets canonical_url pointing back to the portfolio site.
 */

const DEVTO_API_URL = 'https://dev.to/api/articles';

/**
 * Publish a single article to Dev.to.
 * @param {Object} params
 * @param {string} params.title - Article title
 * @param {string} params.body - Markdown body
 * @param {string[]} params.tags - Up to 4 lowercase tags
 * @param {string} params.description - Article description
 * @param {string} params.canonicalUrl - Canonical URL pointing to portfolio
 * @param {string} params.apiKey - Dev.to API key
 * @param {boolean} [params.published=true] - Publish immediately
 * @returns {Promise<Object>} The created article response
 */
export async function publishToDevTo({
  title,
  body,
  tags,
  description,
  canonicalUrl,
  apiKey,
  published = true,
}) {
  // Dev.to limits: 4 tags, lowercase, no special chars
  const sanitizedTags = tags
    .slice(0, 4)
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const payload = {
    article: {
      title,
      body_markdown: body,
      published,
      tags: sanitizedTags,
      canonical_url: canonicalUrl,
      description,
    },
  };

  const response = await fetch(DEVTO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dev.to API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Update an existing article on Dev.to.
 */
export async function updateOnDevTo({ articleId, title, body, tags, canonicalUrl, apiKey }) {
  const sanitizedTags = tags
    .slice(0, 4)
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const payload = {
    article: {
      title,
      body_markdown: body,
      tags: sanitizedTags,
      canonical_url: canonicalUrl,
    },
  };

  const response = await fetch(`${DEVTO_API_URL}/${articleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dev.to API update error (${response.status}): ${errorText}`);
  }

  return response.json();
}
