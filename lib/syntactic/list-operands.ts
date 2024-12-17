import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { listTerms } from "./list-terms";
import { matchArray } from "./match-array";

export const listOperands = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  let value = "";
  let action = "";
  let hasPositionChanged = position + 1;
  const { position: newPosition, value: newValue } = listTerms(
    tokens,
    position,
    tokensMapping,
    identifiers
  );
  position = newPosition;
  value = newValue;

  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["plus", "min", "or"])
  ) {
    action = tokens[position].value;
    position = consumeArray(tokens, position, ["plus", "min", "or"]);

    hasPositionChanged = position;
    const { position: newPosition, value: newValue } = listTerms(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    position = newPosition;

    switch (action) {
      case "plus":
        value = (Number(value) + Number(newValue)).toString();
        break;
      case "min":
        value = (Number(value) - Number(newValue)).toString();
        break;
      case "or":
        const leftBool = value === "true" ? true : false;
        const rightBool = newValue === "true" ? true : false;

        value = (leftBool || rightBool).toString();
        break;
    }

    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "plus", "min", "or" в позиции ${position}, но ничего не нашлось`
      );
    }
  }

  return { position, value };
};
