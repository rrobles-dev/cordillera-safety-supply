import type { Post } from './types';

const normalize = (value: string) => value.trim().toLowerCase();

/**
 * R8: returns the products that already use this copy, excluding the same product.
 * Same product + same copy is a duplicate (R3), enforced by the backend instead.
 */
export function findProductsUsingCopy(posts: Post[], product: string, copy: string): string[] {
  const targetProduct = normalize(product);
  const targetCopy = normalize(copy);

  const products = posts
    .filter((post) => normalize(post.description) === targetCopy && normalize(post.name) !== targetProduct)
    .map((post) => post.name);

  return [...new Set(products)];
}