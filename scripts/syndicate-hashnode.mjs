/**
 * syndicate-hashnode.mjs
 * Publishes blog posts to Hashnode via their GraphQL API.
 * Sets originalArticleURL (canonical) pointing back to the portfolio site.
 */

const HASHNODE_API_URL = 'https://gql.hashnode.com';

/**
 * Publish a single article to Hashnode.
 * @param {Object} params
 * @param {string} params.title - Article title
 * @param {string} params.body - Markdown body
 * @param {string[]} params.tags - Tag names
 * @param {string} params.canonicalUrl - Canonical URL pointing to portfolio
 * @param {string} params.publicationId - Hashnode publication ID
 * @param {string} params.apiKey - Hashnode Personal Access Token
 * @returns {Promise<Object>} The created post response
 */
export async function publishToHashnode({
  title,
  body,
  tags,
  canonicalUrl,
  publicationId,
  apiKey,
}) {
  const mutation = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          title
          slug
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      publicationId,
      title,
      contentMarkdown: body,
      originalArticleURL: canonicalUrl,
      tags: tags.map((t) => ({ slug: t.toLowerCase().replace(/\s+/g, '-'), name: t })),
    },
  };

  const response = await fetch(HASHNODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hashnode API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Hashnode GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data.publishPost.post;
}

/**
 * Update an existing article on Hashnode.
 */
export async function updateOnHashnode({ postId, title, body, canonicalUrl, apiKey }) {
  const mutation = `
    mutation UpdatePost($input: UpdatePostInput!) {
      updatePost(input: $input) {
        post {
          id
          title
          slug
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      id: postId,
      title,
      contentMarkdown: body,
      originalArticleURL: canonicalUrl,
    },
  };

  const response = await fetch(HASHNODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hashnode API update error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Hashnode GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data.updatePost.post;
}
