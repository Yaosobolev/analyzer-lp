import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";
import { expression } from "./expression";

export const listExpressions = (
  tokens: Value[],
  tokensMapping: ValueMapping[],
  position: number,
  identifiers: Value[]
) => {
  const value: string[] = [];
  const { position: firstExpression, value: newValue } = expression(
    tokens,
    position,
    tokensMapping,
    identifiers
  );
  value.push(newValue);

  position = firstExpression;
  console.log("tokens: ", tokens);
  // const firstExpression = newPosition;
  console.log("firstExpression: ", firstExpression);
  if (!firstExpression) {
    throw new Error(
      `Ожидается выражение в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  // console.log("newPosition: ", newPosition);
  // Проверяем наличие запятой и следующего выражение
  while (match(tokens, position, ",")) {
    position = consume(tokens, position, ","); // Пропускаем запятую
    const { position: otherExpression, value: newValue } = expression(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    value.push(newValue);

    position = otherExpression;
    if (!otherExpression) {
      throw new Error(
        `Ожидается выражение в позиции ${position}, но найдено ${tokens[position].value}`
      );
    }
  }

  return { position, value };
};
