import { Value, ValueMapping } from "@/@types/value";
import { consumeArray } from "./consume-array";
import { match } from "./match";
import { consume } from "./consume";

export const factor = (
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
  const number = match(
    tokens,
    position,
    String(tokensMapping[position].idTable),
    "4"
  );

  if (identifier) {
    return position + 1;
  }
  if (number) {
    return position + 1;
  }
  if (tokens[position].value === "~") {
    position = consume(tokens, position, "~");
    position = factor(tokens, position, tokensMapping);

    // Проверяем, что рекурсия завершилась идентификатором или числом
    const validAfterRecursion =
      match(
        tokens,
        position,
        String(tokensMapping[position - 1]?.idTable),
        "3"
      ) ||
      match(
        tokens,
        position,
        String(tokensMapping[position - 1]?.idTable),
        "4"
      ) ||
      match(tokens, position - 1, "true") ||
      match(tokens, position - 1, "false");

    if (!validAfterRecursion) {
      throw new Error(
        `Ожидается идентификатор, число, логическая константа после "~"`
      );
    }
    return position;
  }

  if (tokens[position].value === "(") {
    position = consume(tokens, position, "(");
    position = factor(tokens, position, tokensMapping);
    position = consume(tokens, position, ")");

    // Проверяем, что рекурсия завершилась идентификатором или числом
    const validAfterRecursion =
      match(
        tokens,
        position,
        String(tokensMapping[position - 2]?.idTable),
        "3"
      ) ||
      match(
        tokens,
        position,
        String(tokensMapping[position - 2]?.idTable),
        "4"
      ) ||
      match(tokens, position - 2, "true") ||
      match(tokens, position - 2, "false");

    if (!validAfterRecursion) {
      throw new Error(`Ожидается выражение после "("`);
    }
    return position;
  }

  if (tokens[position].value === "true" || tokens[position].value === "false") {
    // return consumeArray(tokens, position, ["true", "false"]);
    return position;
  }

  return position;
};
