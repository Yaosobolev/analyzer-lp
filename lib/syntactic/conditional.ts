import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";
import { listOperators } from "./list-operators";

export const conditional = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
): number => {
  const firstKeyword = match(tokens, position, "if");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "if" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasFirstPositionChanged = position;

  const { position: newPosition, value: newValue } = expression(
    tokens,
    position,
    tokensMapping,
    identifiers
  );

  position = newPosition;

  if (newValue !== "true" && newValue !== "false") {
    throw new Error(
      `Ожидается логическое выражение в позиции ${position}, но найдено "${newValue}"`
    );
  }
  if (hasFirstPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  const secondKeyword = match(tokens, position, "then");

  if (!secondKeyword) {
    throw new Error(
      `Ожидается "then" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasSecondPositionChanged = position;

  position = listOperators(
    tokens,
    position,
    tokensMapping,
    identifiers,
    newValue
  );
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается оператор`);
  }

  const hasThirdPositionChanged = position;

  const conditionalErrorResult = newValue === "true" ? "false" : "true";

  if (match(tokens, position, "else")) {
    position++;
    position = listOperators(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalErrorResult
    );
    if (hasThirdPositionChanged === position) {
      throw new Error(`Ожидается оператор`);
    }
  }

  return position;
};
