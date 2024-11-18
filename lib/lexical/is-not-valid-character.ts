import { isDelimiters, isDigit, isLetter } from "@/lib";

export const isNotValidCharacter = (char: string) => {
  return (
    !isLetter(char) &&
    !isDigit(char) &&
    !isDelimiters(char) &&
    ![" ", ".", "+", "-", "~"].includes(char)
  );
};
