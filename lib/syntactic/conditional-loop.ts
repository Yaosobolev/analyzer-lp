import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";
import { listOperators } from "./list-operators";

export const conditionalLoop = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  const firstKeyword = match(tokens, position, "while");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "while" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasFirstPositionChanged = position;

  position = expression(tokens, position, tokensMapping);
  if (hasFirstPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  const secondKeyword = match(tokens, position, "do");

  if (!secondKeyword) {
    throw new Error(
      `Ожидается "do" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasSecondPositionChanged = position;

  position = listOperators(tokens, position, tokensMapping);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается оператор`);
  }

  return position;
};
