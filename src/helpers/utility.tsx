export function truncateString(str: string, limit: number) {
  return str.length > limit ? str.slice(0, limit) + "..." : str;
};