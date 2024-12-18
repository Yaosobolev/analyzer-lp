import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";

import { consume } from "./consume";
import { listExpressions } from "./list-expressions";

export const output = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[],
  conditionalResult?: string
): number => {
  const firstKeyword = match(tokens, position, "write");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "write" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  position = consume(tokens, position, "(");

  const hasSecondPositionChanged = position;

  const { position: newPosition, value: newValue } = listExpressions(
    tokens,
    tokensMapping,
    position,
    identifiers
  );

  position = newPosition;
  // outputValue = [
  //   ...(outputValue || []),
  //   ...newValue.map((item) => ({ value: item })),
  // ];

  if (conditionalResult === "true" || !conditionalResult) {
    if (newValue.length > 0) {
      const prevData = localStorage.getItem("outputValues") || "";
      localStorage.setItem(
        "outputValues",
        prevData + "\n" + newValue.join(", ")
      );

      // outputValue?.push({ value: newValue.join("\n") });

      // alert("Значения: \n" + newValue.join("\n"));
    }
  }

  // console.log("newValue: ", newValue);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  position = consume(tokens, position, ")");

  return position;
};
