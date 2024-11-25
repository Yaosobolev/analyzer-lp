import { Value, ValueMapping } from "@/@types/value";
import { consume } from "./consume";
import { operator } from "./operator";
import { match } from "./match";

export const listOperators = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
) => {
  if (!tokens.find((item) => item.value.toLocaleLowerCase() === "end.")) {
    return position;
  }
  while (tokens[position].value !== "end.") {
    position = operator(tokens, position, tokensMapping);

    if (match(tokens, position, "else")) {
      return position;
    }

    if (
      tokens[position + 1]?.value === "end." &&
      tokens[position]?.value === ";"
    ) {
      return position;
    }

    position = consume(tokens, position, ";");
  }

  return position++;
};
