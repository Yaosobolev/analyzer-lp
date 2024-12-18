import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { listOperands } from "./list-operands";
import { matchArray } from "./match-array";

export const expression = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  let value = "";
  let action = "";
  let hasPositionChanged = position + 1;
  const { position: newPosition, value: newValue } = listOperands(
    tokens,
    position,
    tokensMapping,
    identifiers
  );
  position = newPosition;
  value = newValue;

  if (
    hasPositionChanged <= position &&
    matchArray(tokens, position, ["ne", "eq", "lt", "le", "gt", "ge"])
  ) {
    action = tokens[position].value;
    position = consumeArray(tokens, position, [
      "ne",
      "eq",
      "lt",
      "le",
      "gt",
      "ge",
    ]);

    hasPositionChanged = position;
    const { position: newPosition, value: newValue } = listOperands(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    position = newPosition;

    switch (action.toLocaleLowerCase()) {
      case "ne":
        value = (Number(value) !== Number(newValue)).toString();
        break;
      case "eq":
        value = (Number(value) === Number(newValue)).toString();
        break;
      case "lt":
        value = (Number(value) < Number(newValue)).toString();
        break;
      case "le":
        value = (Number(value) <= Number(newValue)).toString();
        break;
      case "gt":
        value = (Number(value) > Number(newValue)).toString();
        break;
      case "ge":
        value = (Number(value) >= Number(newValue)).toString();
        break;
    }

    if (hasPositionChanged === position) {
      throw new Error(
        `Ожидалось "ne", "eq", "lt", "le", "gt", "ge" в позиции ${position}, но ничего не нашлось`
      );
    }
  }
  return { position, value };
};
