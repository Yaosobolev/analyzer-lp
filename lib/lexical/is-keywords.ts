import { keywords } from "../constants";

export function isKeywords(identifier: string) {
  if (
    keywords.find((item) => {
      return item.value.toLocaleLowerCase() === identifier.toLocaleLowerCase();
    })
  ) {
    return true;
  }
  return false;
}
