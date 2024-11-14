export function isIdentifier(char: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(char);
}
