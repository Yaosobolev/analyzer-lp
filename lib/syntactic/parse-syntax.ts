import { Value, ValueMapping } from "@/@types/value";
import { program } from "./program";

export const parseSyntax = (tokens: Value[], tokensMapping: ValueMapping[]) => {
  try {
    const position = 0;
    const result = program(tokens, position, tokensMapping);
    return { success: true, position: result.position, errorMessage: "" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, errorMessage: error.message };
    }
  }
};
