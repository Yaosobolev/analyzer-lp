export function isBynarial(value: string) {
  return /^[01]+[bB]$/.test(value);
}
