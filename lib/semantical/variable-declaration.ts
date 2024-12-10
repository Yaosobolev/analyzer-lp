import { ValueMapping } from "@/@types/value";
import { Token } from "./parse-semantical";

export const variableDeclaration = (
  tokens: Token[],
  tokensMapping: ValueMapping[]
) => {
  const declaredVariables = new Set();
  let typePosition = 0;
  for (const token of tokens) {
    if (tokensMapping[token.id].idTable === 3) {
      if (!declaredVariables.has(token.value)) {
        token.declared = true;
        declaredVariables.add(token.value);
      } else {
        throw new Error(
          `Переменная "${token.value}" была объявлена несколько раз.`
        );
      }
    }

    if (token.value === ";") {
      for (let i = typePosition; i < token.id; i++) {
        if (tokens[i].declared) {
          tokens[i].type = tokens[token.id - 1].value;
        }
      }
      typePosition = token.id - 1;
    }
    if (token.value === "begin") {
      break;
    }
  }
};
