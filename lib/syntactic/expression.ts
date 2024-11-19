import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { listOperands } from "./list-operands";
import { matchArray } from "./match-array";

export const expression = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  let hasPositionChanged = position + 1;
  position = listOperands(tokens, position, tokensMapping);
  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["ne", "eq", "lt", "le", "gt", "ge"])
  ) {
    position = consumeArray(tokens, position, [
      "ne",
      "eq",
      "lt",
      "le",
      "gt",
      "ge",
    ]);
    hasPositionChanged = position;
    position = listOperands(tokens, position, tokensMapping);
    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "ne", "eq", "lt", "le", "gt", "ge" в позиции ${position}, но ничего не нашлось`
      );
    }
  }
  return position;
};
