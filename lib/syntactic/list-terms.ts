import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { factor } from "./factor";
import { matchArray } from "./match-array";

export const listTerms = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  let value = "";
  let action = "";
  let hasPositionChanged = position + 1;
  const { position: newPosition, value: newValue } = factor(
    tokens,
    position,
    tokensMapping,
    identifiers
  );
  position = newPosition;
  value = newValue;

  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["mult", "div", "and"])
  ) {
    action = tokens[position].value;
    position = consumeArray(tokens, position, ["mult", "div", "and"]);

    hasPositionChanged = position;
    const { position: newPosition, value: newValue } = factor(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    position = newPosition;
    switch (action) {
      case "mult":
        value = (Number(value) * Number(newValue)).toString();
        break;
      case "div":
        value = (Number(value) / Number(newValue)).toString();
        break;
      case "and":
        console.log(value);
        console.log(newValue);
        const leftBool = value === "true" ? true : false;
        const rightBool = newValue === "true" ? true : false;

        value = (leftBool && rightBool).toString();
        break;
    }

    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "mult", "div", "and" в позиции ${position}, но ничего не нашлось`
      );
    }
  }

  return { position, value };
};
