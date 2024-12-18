import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";
import { listOperators } from "./list-operators";
import { assignments } from "./assignments";

export const fixedlLoop = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[],
  conditionalResult?: string
): number => {
  let iterations = 0;
  const firstKeyword = match(tokens, position, "for");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "for" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasFirstPositionChanged = position;

  position = assignments(
    tokens,
    position,
    tokensMapping,
    identifiers,
    conditionalResult
  );
  if (hasFirstPositionChanged === position) {
    throw new Error(`Ожидается присваивание`);
  }

  const secondKeyword = match(tokens, position, "to");

  if (!secondKeyword) {
    throw new Error(
      `Ожидается "to" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  while (true) {
    if (iterations > 500) {
      throw new Error("Зацикливание обнаружено: превышен лимит итераций.");
    }
    let tempPosition = position;

    const hasSecondPositionChanged = tempPosition;

    const { position: newPosition, value: newValue } = expression(
      tokens,
      tempPosition,
      tokensMapping,
      identifiers
    );
    tempPosition = newPosition;
    if (hasSecondPositionChanged === tempPosition) {
      throw new Error(`Ожидается выражение`);
    }

    if (newValue !== "true" && newValue !== "false") {
      throw new Error(
        `Ожидается логическое выражение в позиции ${tempPosition}"`
      );
    }

    tempPosition = newPosition;

    const thirdKeyword = match(tokens, tempPosition, "do");
    if (!thirdKeyword) {
      throw new Error(
        `Ожидается "do" в позиции ${tempPosition}, но найдено ${tokens[tempPosition].value}`
      );
    }
    tempPosition++;

    const hasThirdPositionChanged = tempPosition;

    const conditionalErrorResult = newValue === "true" ? "true" : "false";
    tempPosition = listOperators(
      tokens,
      tempPosition,
      tokensMapping,
      identifiers,
      conditionalErrorResult
    );
    if (hasThirdPositionChanged === tempPosition) {
      throw new Error(`Ожидается оператор`);
    }
    if (newValue === "false") {
      // position = tempPosition;
      return tempPosition;
      // break;
    }
    iterations++;
  }

  // return position;
};
