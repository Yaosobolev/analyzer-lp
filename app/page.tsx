"use client";

import { Button } from "@/components/ui";
import { Container, TableValues, TextareaCode } from "@/components/shared";
import { TextareaResult } from "@/components/shared/textarea-result";
import { separators, serviceWords } from "@/lib/constants";
import { useState } from "react";

import { ResultValue, Value } from "@/@types/value";

interface analysisResult {
  identifiers: Value[];
  delimiters: Value[];
  keywords: Value[];
  numbers: Value[];
  allElements: Value[];
  errorMessage: string;
}

export default function Home() {
  const [identifiers, setIdentifiers] = useState<Value[]>([]);
  const [numbers, setNumbers] = useState<Value[]>([]);
  const [result, setResult] = useState<ResultValue[]>([]);
  const [code, setCode] = useState<string[]>([]);
  const [errorMesage, setErrorMesage] = useState<string>("");

  function isLetter(char: string): boolean {
    return /^[a-zA-Z]$/.test(char);
  }

  function isDigit(char: string): boolean {
    return /^\d$/.test(char);
  }

  function isValidIdentifier(identifier: string): boolean {
    if (identifier.length === 1) {
      return false;
    }

    return true;
  }

  function isServiceWords(identifier: string) {
    if (serviceWords.find((item) => item.value === identifier)) {
      return true;
    }
    return false;
  }
  function isDelimiters(identifier: string) {
    if (separators.find((item) => item.value === identifier)) {
      return true;
    }
    return false;
  }

  // function isIdentifier(identifier: string) {
  //   if (isLetter(identifier[0])) {
  //     for (const char of identifier) {
  //       if (isLetter(char) && isDigit(char)) {
  //         return true;
  //       }
  //     }
  //   }
  //   if (isValidIdentifier(identifier)) {
  //     return identifier;
  //   }

  //   return false;
  // }

  // Функция для фильтрации символов
  function filterCharacters(chars: string[]) {
    const identifiers: Value[] = [];
    const delimiters: Value[] = [];
    const keywords: Value[] = [];
    const numbers: Value[] = [];
    const allElements: Value[] = [];
    let errorMessage = "";
    const variantsErrorMessage = {
      noIdentifier: "Обнаружено недопустимое имя идентификатора!",
      noIdentifierLength:
        "Неккоректная запись идентификатора, Идентификатор должен содержать более одного символа!",
      noExitProgram:
        "Неккоректный выход из программы, после end ожидалась '.' ",
    };

    let currentIdentifier = "";
    let isExit = false;
    let isError = false;
    let flagEnd = false;
    let id = 0;
    let insideBlock = false;
    let openBraceCount = 0;
    for (let i = 0; i < chars.length; i++) {
      let isBlocked = isError || isExit ? true : false;

      const char = chars[i];
      if (!flagEnd && !isBlocked && !insideBlock && char === "{") {
        delimiters.push({ value: "{", id });

        insideBlock = true; // Входим в блок
        openBraceCount++;
        id++;
        currentIdentifier = "";
      } else if (insideBlock && char === "}") {
        if (insideBlock) {
          openBraceCount--;
          insideBlock = false;
        }
        delimiters.push({ value: "}", id });
        id++;
        currentIdentifier = "";

        // if (openBraceCount === 0) {
        //   throw new Error(
        //     "Обнаружена закрывающая фигурная скобка без соответствующей открывающей!"
        //   );
        // }
      } else if (insideBlock) {
        currentIdentifier += char;
        if (currentIdentifier.includes("end.")) {
          errorMessage = "Обнаружено слово 'end.' внутри фигурных скобок!";
          isExit = true;
        }
        // throw new Error("Обнаружено слово 'end' внутри фигурных скобок!");
      } else if (!isBlocked && !insideBlock) {
        // Игнорируем если внутри блока
        if (isLetter(char) || isDigit(char)) {
          currentIdentifier += char;
        } else {
          const resultServiceWords = isServiceWords(currentIdentifier);
          const resultValidIdentifier = isValidIdentifier(currentIdentifier);

          if (resultServiceWords) {
            if (!flagEnd) {
              keywords.push({ value: currentIdentifier, id });
              id++;
              if (currentIdentifier === "end") {
                console.log(currentIdentifier);
                flagEnd = true;
              }
              currentIdentifier = "";
            } else {
              errorMessage = variantsErrorMessage.noExitProgram;
              isError = true;
            }

            console.log(1);
          } else if (isLetter(currentIdentifier[0]) && !resultValidIdentifier) {
            currentIdentifier = "";
            errorMessage = variantsErrorMessage.noIdentifierLength;

            console.log(2);
            isError = true;
          } else if (isLetter(currentIdentifier[0])) {
            if (!flagEnd) {
              identifiers.push({ value: currentIdentifier, id });
              id++;
              currentIdentifier = "";
            } else {
              errorMessage = variantsErrorMessage.noExitProgram;
              isError = true;
            }
            console.log(3);

            // написать функцию которая проверяет currentIdentifier на число
          } else if (isDigit(currentIdentifier[0])) {
            if (!flagEnd) {
              numbers.push({ value: currentIdentifier, id });
              id++;
              currentIdentifier = "";
            } else {
              errorMessage = variantsErrorMessage.noExitProgram;
              isError = true;
            }
            console.log(4);
          }
          // } else {
          //   // identifiers.push(currentIdentifier);
          //   currentIdentifier = "";
          // }

          if (isDelimiters(char)) {
            if (flagEnd) {
              if (char === ".") {
                console.log("Выход");
                delimiters.push({ value: char, id });
                id++;
                isExit = true;
              } else {
                errorMessage = variantsErrorMessage.noExitProgram;

                isError = true;
              }
            } else {
              delimiters.push({ value: char, id });
              id++;
            }
          }
        }
      }
    }

    if (openBraceCount > 0) {
      errorMessage =
        "Обнаружены открытые фигурные скобки без соответствующих закрывающих!";

      isError = true;
      // throw new Error(
      //   "Обнаружены открытые фигурные скобки без соответствующих закрывающих!"
      // );
    }

    allElements.push(...identifiers, ...delimiters, ...keywords, ...numbers);
    allElements.sort((a, b) => a.id - b.id);

    return {
      identifiers,
      delimiters,
      keywords,
      numbers,
      allElements,
      errorMessage,
    };
  }

  function createIdMapping(
    obj: analysisResult
  ): { idTable: number; idToTable: number }[] {
    const result: { idTable: number; idToTable: number }[] = [];

    // Проходим по allElements и создаем нужный массив
    for (const element of obj.allElements) {
      if (obj.keywords.some((item) => item.id === element.id)) {
        result.push({
          idTable: 1,
          idToTable: serviceWords.findIndex((a) => a.value === element.value),
        });
      } else if (obj.delimiters.some((item) => item.id === element.id)) {
        result.push({
          idTable: 2,
          idToTable: separators.findIndex((a) => a.value === element.value),
        });
      } else if (obj.identifiers.some((item) => item.id === element.id)) {
        result.push({
          idTable: 3,
          idToTable: obj.identifiers.findIndex((a) => a.id === element.id),
        });
      } else if (obj.numbers.some((item) => item.id === element.id)) {
        result.push({
          idTable: 4,
          idToTable: obj.numbers.findIndex((a) => a.id === element.id),
        });
      }
    }

    return result;
  }

  const analysis = (value: string[]) => {
    const filteredCharacters = filterCharacters(value);
    console.log("filteredCharacters: ", filteredCharacters);

    if (filteredCharacters) {
      setIdentifiers([...filteredCharacters?.identifiers]);
      setNumbers([...filteredCharacters?.numbers]);
      const sortedCharacters = createIdMapping(filteredCharacters);

      setResult([...sortedCharacters] as ResultValue[]);
      setErrorMesage(filteredCharacters.errorMessage);
    }
  };

  const onChangeCode = (values: string) => {
    const value = values.split("");

    setCode(value);
  };

  return (
    <div>
      <Container>
        <div className="flex gap-2">
          <TableValues
            title="Cлужебные слова"
            values={serviceWords}
            indexTable={1}
          />
          <TableValues
            title="Ограничители"
            values={separators}
            indexTable={2}
          />
          <TableValues
            title="Идентификаторы"
            values={identifiers}
            indexTable={3}
          />
          <TableValues title="Числа" values={numbers} indexTable={4} />
        </div>
        <div className="w-1/2">
          <Button onClick={() => analysis(code)}>Начать</Button>
        </div>
        <div className="flex gap-4 w-full">
          <TextareaCode onChangeCode={onChangeCode} />
          <TextareaResult result={result} errorMessage={errorMesage} />
        </div>
      </Container>
    </div>
  );
}
