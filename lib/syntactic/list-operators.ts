import { Value, ValueMapping } from "@/@types/value";
import { consume } from "./consume";
import { operator } from "./operator";
import { match } from "./match";

export const listOperators = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[],
  conditionalResult?: string
) => {
  let endProgram = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].value === "end.") {
      endProgram = i;
    }
  }
  if (!tokens.find((item) => item.value.toLocaleLowerCase() === "end.")) {
    return position;
  }

  while (tokens[position].value !== "end.") {
    position = operator(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );

    if (match(tokens, position, "else")) {
      return position;
    }

    if (
      position + 1 === endProgram &&
      // tokens[position + 1]?.value === "end." &&
      tokens[position]?.value === ";"
    ) {
      return position;
    }

    if (
      tokens[position - 1].value === "]" &&
      // || tokens[position].value === "]"

      conditionalResult
    ) {
      return position;
    }
    if (
      // tokens[position].value === ";" &&
      conditionalResult
    ) {
      return position;
    }

    position = consume(tokens, position, ";");
  }

  return position++;
};
