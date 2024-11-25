import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";

import { consume } from "./consume";
import { listExpressions } from "./list-expressions";

export const output = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  const firstKeyword = match(tokens, position, "write");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "write" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  position = consume(tokens, position, "(");

  const hasSecondPositionChanged = position;

  position = listExpressions(tokens, tokensMapping, position);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  position = consume(tokens, position, ")");

  return position;
};
