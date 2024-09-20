export function getEndpoint(pool: string[]): string | undefined {
  return pool.at(0);
}
