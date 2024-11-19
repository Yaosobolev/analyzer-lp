import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { factor } from "./factor";
import { matchArray } from "./match-array";

export const listTerms = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  let hasPositionChanged = position + 1;
  position = factor(tokens, position, tokensMapping);

  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["mult", "div", "and"])
  ) {
    position = consumeArray(tokens, position, ["mult", "div", "and"]);
    hasPositionChanged = position;
    position = factor(tokens, position, tokensMapping);

    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "mult", "div", "and" в позиции ${position}, но ничего не нашлось`
      );
    }
  }

  return position;
};
