import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { assignments } from "./assignments";
import { conditional } from "./conditional";

export const operator = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
): number => {
  // Последовательно проверяем каждый вариант EOper
  if (match(tokens, position, "[")) {
    // return sost(tokens, tokensMapping, position);
    console.log("sost");
  } else if (
    match(tokens, position, String(tokensMapping[position].idTable), "3")
  ) {
    return assignments(tokens, position, tokensMapping);
  } else if (match(tokens, position, "if")) {
    return conditional(tokens, position, tokensMapping);
  }

  // return pris(tokens, tokensMapping, position);
  //   } else if (match(tokens, position, "usl")) {
  //     return usl(tokens, tokensMapping, position);
  //   } else if (match(tokens, position, "fixc")) {
  //     return fixC(tokens, tokensMapping, position);
  //   } else if (match(tokens, position, "uslc")) {
  //     return uslC(tokens, tokensMapping, position);
  //   } else if (match(tokens, position, "rd")) {
  //     return rd(tokens, tokensMapping, position);
  //   } else if (match(tokens, position, "wr")) {
  //     return wr(tokens, tokensMapping, position);
  //   }

  // Если ни один вариант не подошел
  throw new Error(
    `Неожиданный токен в позиции ${position}: ${tokens[position].value}`
  );
};
