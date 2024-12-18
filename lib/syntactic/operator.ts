import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { assignments } from "./assignments";
import { conditional } from "./conditional";
import { conditionalLoop } from "./conditional-loop";
import { fixedlLoop } from "./fixed-loop";
import { input } from "./input";
import { output } from "./output";
import { composite } from "./composite";

export const operator = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[],
  conditionalResult?: string
): number => {
  // Последовательно проверяем каждый вариант EOper
  if (match(tokens, position, "[")) {
    return composite(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  } else if (
    match(tokens, position, String(tokensMapping[position].idTable), "3")
  ) {
    return assignments(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  } else if (match(tokens, position, "if")) {
    return conditional(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  } else if (match(tokens, position, "for")) {
    return fixedlLoop(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  } else if (match(tokens, position, "while")) {
    return conditionalLoop(tokens, position, tokensMapping, identifiers);
  } else if (match(tokens, position, "read")) {
    return input(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  } else if (match(tokens, position, "write")) {
    return output(
      tokens,
      position,
      tokensMapping,
      identifiers,
      conditionalResult
    );
  }

  throw new Error(
    `Неожиданный токен в позиции ${position}: ${tokens[position].value}`
  );
};
