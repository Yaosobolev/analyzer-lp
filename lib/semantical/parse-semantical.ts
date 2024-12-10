import { ValueMapping } from "@/@types/value";
import { variableDeclaration } from "./variable-declaration";

export type Token = {
  value: string;
  id: number;
  declared?: boolean;
  type?: string;
};

const validTypes = new Set<string>(["int", "float", "bool"]);

export const parseSemantical = (
  tokens: Token[],
  tokensMapping: ValueMapping[]
) => {
  const symbolTable = new Map<string, { declared: boolean; type: string }>();
  console.log("tokens: ", tokens);
  console.log("tokensMapping: ", tokensMapping);

  try {
    variableDeclaration(tokens, tokensMapping);
    return { success: true, errorMessage: "" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, errorMessage: error.message };
    }
  }
};
