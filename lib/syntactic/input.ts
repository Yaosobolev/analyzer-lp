import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";

import { consume } from "./consume";
import { listIdentifiers } from "./list-identifiers";
import { isBynarial } from "../is-bynarial";
import { isDecimal } from "../is-decimal";
import { isOctal } from "../is-octal";
import { isHexadecimal } from "../is-hexadecimal";
import { isExponential } from "../is-exponential";

export const input = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
): number => {
  const identifiersLocal = identifiers;
  // let identifiersLocal = _.cloneDeep(identifiers);
  const firstKeyword = match(tokens, position, "read");

  if (!firstKeyword) {
    throw new Error(
      `Ожидается "read" в позиции ${position}, но найдено ${tokens[position].value}`
    );
  }
  position++;

  position = consume(tokens, position, "(");

  const hasSecondPositionChanged = position;

  const { position: newPosition, identifierList: newValue } = listIdentifiers(
    tokens,
    tokensMapping,
    position,
    identifiersLocal,
    true
  );

  position = newPosition;

  newValue.forEach((idObj) => {
    console.log("idObj: ", idObj);
    let userInput = prompt(
      `Введите значение для переменной "${idObj.value}":`,
      ""
    );

    if (userInput === null || userInput.trim() === "") {
      throw new Error(`Значение для переменной "${idObj.value}" не введено.`);
    }
    if (isBynarial(userInput)) {
      userInput = parseInt(userInput.slice(0, -1), 2).toString();
    } else if (isOctal(userInput)) {
      userInput = parseInt(userInput.slice(0, -1), 8).toString();
    } else if (isDecimal(userInput)) {
      if (userInput.startsWith(".")) {
        userInput = "0" + userInput;
      }
    } else if (isHexadecimal(userInput)) {
      userInput = parseInt(userInput.slice(0, -1), 16).toString();
    } else if (isExponential(userInput)) {
      if (userInput.startsWith(".")) {
        userInput = "0" + userInput;
      }
      userInput = parseFloat(userInput).toString();
    } else if (userInput === "true" || userInput === "false") {
    } else {
      throw new Error(
        `Значение для переменной "${idObj.value}" не является числом или логическим.`
      );
    }

    const variableValue = userInput;
    console.log("variableValue: ", variableValue);
    const variableType = idObj.type;
    console.log("variableType: ", variableType);

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

    // Сохраняем значение в таблице идентификаторов
    const variableIndex = identifiers.findIndex(
      (item) => item.value === idObj.value
    );
    console.log("variableIndex: ", variableIndex);
    if (variableIndex !== -1) {
      identifiers[variableIndex].variableValue = userInput;
    } else {
      throw new Error(
        `Переменная "${idObj.value}" не найдена в таблице идентификаторов.`
      );
    }
  });
  console.log("newValue: ", newValue);
  if (hasSecondPositionChanged === position) {
    throw new Error(`Ожидается идентификатор`);
  }

  position = consume(tokens, position, ")");

  return position;
};
