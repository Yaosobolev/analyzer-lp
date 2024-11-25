import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";
import { listOperators } from "./list-operators";
import { assignments } from "./assignments";

export const fixedlLoop = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  const firstKeyword = match(tokens, position, "for");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "for" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasFirstPositionChanged = position;

  position = assignments(tokens, position, tokensMapping);
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

  const hasSecondPositionChanged = position;

  position = expression(tokens, position, tokensMapping);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  const thirdKeyword = match(tokens, position, "do");
  if (!thirdKeyword) {
    throw new Error(
      `Ожидается "do" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasThirdPositionChanged = position;

  position = listOperators(tokens, position, tokensMapping);
  if (hasThirdPositionChanged === position) {
    throw new Error(`Ожидается оператор`);
  }

  return position;
};
