import { isDigit, isLetter } from "@/lib";

export const isIgnorableCharacter = (char: string) => {
  return isLetter(char) || isDigit(char) || [".", "+", "-"].includes(char);
};
