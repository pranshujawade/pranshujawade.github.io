/**
 * syndication-tracker.mjs
 * Tracks which posts have been syndicated to which platforms.
 * Prevents duplicate publications.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const STATE_FILE = resolve(import.meta.dirname, '..', '.data', 'syndication-state.json');

/**
 * Load current syndication state from disk.
 */
export async function loadState() {
  try {
    const raw = await readFile(STATE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { lastRun: null, posts: {} };
  }
}

/**
 * Save syndication state to disk.
 */
export async function saveState(state) {
  state.lastRun = new Date().toISOString();
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf-8');
}

/**
 * Check if a post has been syndicated to a given platform.
 * @param {Object} state - The syndication state object
 * @param {string} slug - Post slug (filename without extension)
 * @param {string} platform - Platform name ('devto' | 'hashnode')
 * @returns {boolean}
 */
export function isSyndicated(state, slug, platform) {
  return !!(state.posts[slug]?.[platform]);
}

/**
 * Record a successful syndication.
 * @param {Object} state - The syndication state object
 * @param {string} slug - Post slug
 * @param {string} platform - Platform name
 * @param {Object} data - Platform-specific data (id, url, etc.)
 */
export function recordSyndication(state, slug, platform, data) {
  if (!state.posts[slug]) {
    state.posts[slug] = {};
  }
  state.posts[slug][platform] = {
    ...data,
    syndicatedAt: new Date().toISOString(),
  };
}
