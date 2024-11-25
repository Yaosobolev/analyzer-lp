import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";
import { expression } from "./expression";

export const listExpressions = (
  tokens: Value[],
  tokensMapping: ValueMapping[],
  position: number
): number => {
  const firstExpression = (position = expression(
    tokens,
    position,
    tokensMapping
  ));

  if (!firstExpression) {
    throw new Error(
      `Ожидается выражение в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }

  // Проверяем наличие запятой и следующего выражение
  while (match(tokens, position, ",")) {
    position = consume(tokens, position, ","); // Пропускаем запятую
    const otherExpression = (position = expression(
      tokens,
      position,
      tokensMapping
    ));

    if (!otherExpression) {
      throw new Error(
        `Ожидается выражение в позиции ${position}, но найдено ${tokens[position].value}`
      );
    }
  }

  return position;
};
