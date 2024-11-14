export function isHexadecimal(value: string) {
  return /^[0-9a-fA-F]+[Hh]$/.test(value);
}
