import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";
import { expression } from "./expression";

export const factor = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  let value = "";
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

  // !number для фикса ошибки при назначении в write(4)
  if (identifier && !number) {
    const identifierValue =
      identifiers.find((item) => item.value === tokens[position].value)
        ?.variableValue ||
      (() => {
        throw new Error(
          `Переменная "${tokens[position].value}" не имеет значения`
        );
      })();

    return { position: position + 1, value: identifierValue };
  }
  if (number) {
    return { position: position + 1, value: tokens[position].value };
  }
  if (tokens[position].value === "~") {
    position = consume(tokens, position, "~");
    const { position: newPosition, value: newValue } = factor(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    position = newPosition;
    value = newValue === "true" ? "false" : "true";

    // Проверяем, что рекурсия завершилась идентификатором или числом
    const validAfterRecursion =
      match(
        tokens,
        position,
        String(tokensMapping[position - 1]?.idTable),
        "3"
      ) ||
      // match(
      //   tokens,
      //   position,
      //   String(tokensMapping[position - 1]?.idTable),
      //   "4"
      // ) ||
      match(tokens, position - 1, "true") ||
      match(tokens, position - 1, "false") ||
      match(tokens, position - 1, "(") ||
      match(tokens, position - 1, ")");

    if (!validAfterRecursion) {
      throw new Error(
        `Ожидается идентификатор или логическая константа после "~"`
      );
    }

    return { position: position, value };
  }

  if (tokens[position].value === "(") {
    position = consume(tokens, position, "(");
    const { position: newPosition, value: newValue } = expression(
      tokens,
      position,
      tokensMapping,
      identifiers
    );
    position = newPosition;
    value = newValue;
    position = consume(tokens, position, ")");

    // Проверяем, что рекурсия завершилась идентификатором или числом
    // const validAfterRecursion =
    //   match(
    //     tokens,
    //     position,
    //     String(tokensMapping[position - 2]?.idTable),
    //     "3"
    //   ) ||
    //   match(
    //     tokens,
    //     position,
    //     String(tokensMapping[position - 2]?.idTable),
    //     "4"
    //   ) ||
    //   match(tokens, position - 2, "true") ||
    //   match(tokens, position - 2, "false");

    // console.log("validAfterRecursion: ", validAfterRecursion);

    // if (!validAfterRecursion) {
    //   throw new Error(`Ожидается выражение после "("`);
    // }

    return { position: position, value };
  }

  if (tokens[position].value === "true" || tokens[position].value === "false") {
    value = tokens[position].value;
    position++;
    return { position: position, value };
  }
  return { position: position, value: tokens[position].value };
};
