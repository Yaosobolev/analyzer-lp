import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";

import { consume } from "./consume";
import { operator } from "./operator";

export const composite = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
): number => {
  const firstKeyword = consume(tokens, position, "[");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "[" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  position = operator(tokens, position, tokensMapping, identifiers);

  while (
    match(tokens, position, ":") ||
    match(tokens, position, String(tokensMapping[position].idTable), "3") ||
    match(tokens, position, "if") ||
    match(tokens, position, "for") ||
    match(tokens, position, "while") ||
    match(tokens, position, "read") ||
    match(tokens, position, "write")
  ) {
    const firstDelimiter = match(tokens, position, ":"); // Пропускаем запятую
    if (firstDelimiter) {
      position++;
    }
    const otherOperator = (position = operator(
      tokens,
      position,
      tokensMapping,
      identifiers
    ));

    if (!otherOperator) {
      throw new Error(
        `Ожидается оператор в позиции ${position}, но найдено ${tokens[position].value}`
      );
    }
  }
  //   while (match(tokens, position, ":") || match(tokens, position, "\n")) {
  //     position = consumeArray(tokens, position, [":", "\n"]); // Пропускаем запятую
  //     const otherOperator = (position = operator(
  //       tokens,
  //       position,
  //       tokensMapping
  //     ));

  //     if (!otherOperator) {
  //       throw new Error(
  //         `Ожидается оператор в позиции ${position}, но найдено ${tokens[position].value}`
  //       );
  //     }
  //   }

  const secondKeyword = match(tokens, position, "]");

  if (!secondKeyword) {
    throw new Error(
      `Ожидается "]" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  return position;
};
