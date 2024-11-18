import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";

export const listIdentifiers = (
  tokens: Value[],
  tokensMapping: ValueMapping[],
  position: number
): number => {
  const firstIdentifier = match(
    tokens,
    position,
    String(tokensMapping[position].idTable),
    "3"
  );

  if (!firstIdentifier) {
    throw new Error(
      `Ожидается идентификатор в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  // Проверяем наличие запятой и следующего идентификатора
  while (match(tokens, position, ",")) {
    position = consume(tokens, position, ","); // Пропускаем запятую
    const otherIdentifier = match(
      tokens,
      position,
      String(tokensMapping[position].idTable),
      "3"
    );

    if (!otherIdentifier) {
      throw new Error(
        `Ожидается идентификатор в позиции ${position}, но найдено ${tokens[position].value}`
      );
    }
    position++;
  }

  return position;
};
