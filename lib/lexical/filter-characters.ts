import { Value } from "@/@types/value";
import { handleInsideBlock, handleOutsideBlock } from "@/lib";
import { variantsErrorMessage } from "../constants";

export const filterCharacters = (chars: string[]) => {
  const state = {
    identifiers: [] as Value[],
    delimiters: [] as Value[],
    keywords: [] as Value[],
    numbers: [] as Value[],
    allElements: [] as Value[],
    currentIdentifier: "",
    errorMessage: "",
    isExit: false,
    isError: false,
    id: 0,
    insideBlock: false,
  };
  let openBraceCount = 0;

  const charsToCheck = [".", "+", "-"];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const isBlocked = state.isError || state.isExit;

    if (!isBlocked && !state.insideBlock && char === "{") {
      state.insideBlock = true; // Входим в блок
      openBraceCount++;
      state.currentIdentifier = "";
    } else if (state.insideBlock && char === "}") {
      openBraceCount--;
      state.insideBlock = false;
      state.currentIdentifier = "";
    } else if (state.insideBlock) {
      handleInsideBlock(char, state);
    } else if (!isBlocked && !state.insideBlock) {
      handleOutsideBlock(char, charsToCheck, state);
    }
  }

  if (openBraceCount > 0) {
    state.errorMessage = variantsErrorMessage.noClosedBrace;
    state.isError = true;
  }

  state.allElements.push(
    ...state.identifiers,
    ...state.delimiters,
    ...state.keywords,
    ...state.numbers
  );
  state.allElements.sort((a, b) => a.id - b.id);

  return {
    ...state,
  };
};
