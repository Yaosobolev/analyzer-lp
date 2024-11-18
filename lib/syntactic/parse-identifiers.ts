import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";

export const parseIdentifiers = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  if (!match(tokens, position, String(tokensMapping[position].idTable), "3")) {
    throw new Error(
      `Ожидается идентификатор в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }

  position++; // Пропускаем первый идентификатор

  // Если есть запятые, продолжаем разбирать идентификаторы
  while (match(tokens, position, ",")) {
    position = consume(tokens, position, ",");

    if (
      !match(tokens, position, String(tokensMapping[position].idTable), "3")
    ) {
      throw new Error(
        `Ожидается идентификатор после ',' в позиции ${position}, но найдено ${tokens[position].value}`
      );
    }
    position++; // Пропускаем следующий идентификатор
  }

  return position;
};
