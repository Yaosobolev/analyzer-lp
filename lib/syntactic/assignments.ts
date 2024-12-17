import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { expression } from "./expression";

export const assignments = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[],
  conditionalResult?: string
): number => {
  const identifier = match(
    tokens,
    position,
    String(tokensMapping[position].idTable),
    "3"
  );
  console.log("identifiers: ", identifiers);

  let identifierId = 0;
  if (!identifier) {
    throw new Error(
      `Ожидается идентификатор в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }

  identifiers?.map((item, index) => {
    if (item.value === tokens[position].value && item.declared !== true) {
      throw new Error(`Идентификатор "${tokens[position].value}" не объявлен`);
    } else if (item.value === tokens[position].value) {
      identifierId = index;
    }
  });
  position++;

  if (!match(tokens, position, "as")) {
    throw new Error(
      `Ожидается "as" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  const hasPositionChanged = position;

  const { position: newPosition, value: newValue } = expression(
    tokens,
    position,
    tokensMapping,
    identifiers
  );

  position = newPosition;

  if (conditionalResult !== "false") {
    identifiers[identifierId].variableValue = newValue;
  }

  const variableValue = identifiers[identifierId].variableValue;

  const variableType = identifiers[identifierId].type;

  // Преобразуем значение в число
  const numericValue = Number(variableValue);
  const isInteger = Number.isInteger(numericValue);

  if (
    (variableType === "int" && isInteger) ||
    (variableType === "float" &&
      !Number.isInteger(numericValue) &&
      numericValue) ||
    (variableType === "bool" &&
      (variableValue === "true" || variableValue === "false"))
  ) {
    // Все нормально
  } else {
    throw new Error(
      `Неправильный тип переменной. Ожидался тип "${variableType}", но получено значение "${variableValue}".`
    );
  }

  if (hasPositionChanged === position) {
    throw new Error(`Ожидается выражение`);
  }

  return position;
};
