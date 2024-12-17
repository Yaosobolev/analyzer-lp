import { Value, ValueMapping } from "@/@types/value";
import { match } from "./match";
import { consume } from "./consume";
import _ from "lodash";

export const listIdentifiers = (
  tokens: Value[],
  tokensMapping: ValueMapping[],
  position: number,
  identifiers: Value[],
  isInput?: boolean
) => {
  const tokensLocal = _.cloneDeep(tokens);
  const identifiersLocal = _.cloneDeep(identifiers);

  const identifierList = [];

  const firstIdentifier = match(
    tokensLocal,
    position,
    String(tokensMapping[position].idTable),
    "3"
  );

  if (!firstIdentifier) {
    throw new Error(
      `Ожидается идентификатор в позиции ${position}, но найдено ${tokensLocal[position].value}`
    );
  }

  if (isInput === true) {
    if (
      !identifiersLocal.find(
        (item) => item.value === tokensLocal[position].value
      )?.declared
    ) {
      throw new Error(
        `Переменная "${tokensLocal[position].value}" не была объявлена.`
      );
    } else {
      tokensLocal[position].declared = identifiersLocal.find(
        (item) => item.value === tokensLocal[position].value
      )?.declared;

      tokensLocal[position].variableValue = identifiersLocal.find(
        (item) => item.value === tokensLocal[position].value
      )?.variableValue;
      tokensLocal[position].type = identifiersLocal.find(
        (item) => item.value === tokensLocal[position].value
      )?.type;
    }
  }

  if (!isInput) {
    identifiersLocal.map((item) => {
      if (
        tokensLocal[position].value === item.value &&
        item.declared === true
      ) {
        throw new Error(
          `Переменная "${tokensLocal[position].value}" была объявлена несколько раз.`
        );
      }
    });
    tokensLocal[position].declared = true;
  }

  identifierList.push(tokensLocal[position]);
  position++;

  // Проверяем наличие запятой и следующего идентификатора
  while (match(tokensLocal, position, ",")) {
    position = consume(tokens, position, ","); // Пропускаем запятую
    const otherIdentifier = match(
      tokensLocal,
      position,
      String(tokensMapping[position].idTable),
      "3"
    );

    if (!otherIdentifier) {
      throw new Error(
        `Ожидается идентификатор в позиции ${position}, но найдено ${tokensLocal[position].value}`
      );
    }

    if (isInput === true) {
      if (
        !identifiersLocal.find(
          (item) => item.value === tokensLocal[position].value
        )?.declared
      ) {
        throw new Error(
          `Переменная "${tokensLocal[position].value}" не была объявлена.`
        );
      } else {
        tokensLocal[position].declared = identifiersLocal.find(
          (item) => item.value === tokensLocal[position].value
        )?.declared;

        tokensLocal[position].variableValue = identifiersLocal.find(
          (item) => item.value === tokensLocal[position].value
        )?.variableValue;
        tokensLocal[position].type = identifiersLocal.find(
          (item) => item.value === tokensLocal[position].value
        )?.type;
      }
    }

    if (!isInput) {
      tokensLocal.map((item) => {
        if (
          tokensLocal[position].value === item.value &&
          item.declared === true
        ) {
          throw new Error(
            `Переменная "${tokensLocal[position].value}" была объявлена несколько раз.`
          );
        }
      });

      tokensLocal[position].declared = true;
    }

    identifierList.push(tokensLocal[position]);
    position++;
  }

  return { position, identifierList };
};
