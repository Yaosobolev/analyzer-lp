import { separators } from "../constants";

export function isDelimiters(identifier: string) {
  if (separators.find((item) => item.value === identifier)) {
    return true;
  }
  return false;
}
