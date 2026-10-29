import { describe, expect, it } from 'vitest';
import { findProductsUsingCopy } from './postRules';
import type { Post } from './types';

const posts: Post[] = [
  { id: 1, name: 'Full-Body Harness', description: 'Trust your gear.', createdAt: '2026-10-28T10:00:00.000Z' },
  { id: 2, name: 'Dielectric Safety Boots', description: 'Trust your gear.', createdAt: '2026-10-28T11:00:00.000Z' },
];

describe('findProductsUsingCopy (R8)', () => {
  it('returns other products that use the same copy, ignoring case', () => {
    expect(findProductsUsingCopy(posts, 'Anti-Fog Safety Glasses', '  TRUST YOUR GEAR. ')).toEqual([
      'Full-Body Harness',
      'Dielectric Safety Boots',
    ]);
  });

  it('ignores the same product, because that is a duplicate handled by the API', () => {
    expect(findProductsUsingCopy(posts, 'full-body harness', 'Trust your gear.')).toEqual([
      'Dielectric Safety Boots',
    ]);
  });

  it('returns nothing when the copy is new', () => {
    expect(findProductsUsingCopy(posts, 'Full-Body Harness', 'A brand new copy.')).toEqual([]);
  });
});