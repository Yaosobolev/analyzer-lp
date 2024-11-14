export function isExponential(value: string) {
  // /^[0-9]+\.?[0-9]*[eE][+-]?[0-9]+$/ - без плавающей запятой
  return /^0*(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)[eE][+-]?[0-9]+$/.test(value);
}
