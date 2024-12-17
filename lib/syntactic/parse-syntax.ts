import { Value, ValueMapping } from "@/@types/value";
import { program } from "./program";

export const parseSyntax = (
  tokens: Value[],
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  try {
    const position = 0;
    // let outputValue: { value: string }[] = [{ value: "" }];
    const result = program(tokens, position, tokensMapping, identifiers);

    return {
      success: true,
      position: result.position,
      errorMessage: "",
      tokens: result.newIdentifiers,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, errorMessage: error.message, tokens: [] };
    }
  }
};
