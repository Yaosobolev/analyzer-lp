import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";
import { listOperators } from "./list-operators";

export const conditionalLoop = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
): number => {
  let iterations = 0;
  const firstKeyword = match(tokens, position, "while");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "while" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;
  console.log("цикл начался");

  while (true) {
    if (iterations > 500) {
      throw new Error("Зацикливание обнаружено: превышен лимит итераций.");
    }
    let tempPosition = position;

    const hasFirstPositionChanged = tempPosition;

    const { position: newPosition, value: newValue } = expression(
      tokens,
      tempPosition,
      tokensMapping,
      identifiers
    );

    if (newValue !== "true" && newValue !== "false") {
      throw new Error(
        `Ожидается логическое выражение в позиции ${tempPosition}, но найдено "${newValue}"`
      );
    }

    tempPosition = newPosition;
    if (hasFirstPositionChanged === tempPosition) {
      throw new Error(`Ожидается выражение`);
    }

    const secondKeyword = match(tokens, tempPosition, "do");

    if (!secondKeyword) {
      throw new Error(
        `Ожидается "do" в позиции ${tempPosition}, но найдено ${tokens[tempPosition].value}`
      );
    }
    tempPosition++;

    const hasSecondPositionChanged = tempPosition;

    const conditionalErrorResult = newValue === "true" ? "true" : "false";
    tempPosition = listOperators(
      tokens,
      tempPosition,
      tokensMapping,
      identifiers,
      conditionalErrorResult
    );
    if (hasSecondPositionChanged === tempPosition) {
      throw new Error(`Ожидается оператор`);
    }
    if (newValue === "false") {
      position = tempPosition;
      break;
    }
    iterations++;
  }
  console.log("цикл закончился");

  return position;
};
