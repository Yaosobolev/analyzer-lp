import { StateLexixal } from "@/@types/lexical";
import {
  addDelimiter,
  addIdentifier,
  addKeyword,
  addNumber,
  isDelimiters,
  isDigit,
  isIgnorableCharacter,
  isKeywords,
  isLetter,
  isNotValidCharacter,
} from "@/lib";
import { variantsErrorMessage } from "../constants";

export const handleOutsideBlock = (
  char: string,
  charsToCheck: string[],
  state: StateLexixal
) => {
  if (isNotValidCharacter(char)) {
    state.errorMessage = variantsErrorMessage.noChar + `"${char}"`;
    state.isError = true;
  }

  if (isIgnorableCharacter(char)) {
    state.currentIdentifier += char;
  } else {
    const resultKeywords = isKeywords(state.currentIdentifier);

    if (resultKeywords) {
      addKeyword(state);
    } else if (isLetter(state.currentIdentifier[0])) {
      addIdentifier(state);
    } else if (
      isDigit(state.currentIdentifier[0]) ||
      state.currentIdentifier[0] === "."
    ) {
      addNumber(state);
    }

    if (isDelimiters(char)) {
      addDelimiter(char, state);
    }

    // Проверка на одиночные символы ., +, -
    if (charsToCheck.some((char) => state.currentIdentifier.includes(char))) {
      state.errorMessage =
        variantsErrorMessage.noChar + `"${state.currentIdentifier}"`;
      state.isError = true;
    }
  }
};
