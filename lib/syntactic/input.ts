import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";

import { consume } from "./consume";
import { listIdentifiers } from "./list-identifiers";

export const input = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  const firstKeyword = match(tokens, position, "read");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "read" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  position = consume(tokens, position, "(");

  const hasSecondPositionChanged = position;

  position = listIdentifiers(tokens, tokensMapping, position);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается идентификатор`);
  }

  position = consume(tokens, position, ")");

  return position;
};
