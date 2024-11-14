export function isDecimal(value: string) {
  return /^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)$/.test(value);
}
