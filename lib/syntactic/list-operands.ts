import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { listTerms } from "./list-terms";
import { matchArray } from "./match-array";

export const listOperands = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  let hasPositionChanged = position + 1;
  position = listTerms(tokens, position, tokensMapping);

  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["plus", "min", "or"])
  ) {
    position = consumeArray(tokens, position, ["plus", "min", "or"]);
    hasPositionChanged = position;
    position = listTerms(tokens, position, tokensMapping);

    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "plus", "min", "or" в позиции ${position}, но ничего не нашлось`
      );
    }
  }

  return position;
};
