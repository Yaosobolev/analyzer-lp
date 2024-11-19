import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";

export const assignments = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  const identifier = match(
    tokens,
    position,
    String(tokensMapping[position].idTable),
    "3"
  );

  if (!identifier) {
    throw new Error(
      `Ожидается идентификатор в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  if (!match(tokens, position, "as")) {
    throw new Error(
      `Ожидается "as" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasPositionChanged = position;

  position = expression(tokens, position, tokensMapping);
  if (hasPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  return position;
};
