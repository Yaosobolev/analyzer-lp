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
    if (
      serviceWords.find((item) => {
        return (
          item.value.toLocaleLowerCase() === identifier.toLocaleLowerCase()
        );
      })
    ) {
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
      noDigit: "Обнаружено недопустимое число!",
      noIdentifierLength:
        "Неккоректная запись идентификатора, Идентификатор должен содержать более одного символа!",
      noExitProgram:
        "Неккоректный выход из программы, после end ожидалась '.' ",
      noPoint:
        "Некорректный разделитель. Найдена одиночная точка '.' без соответствующего значения перед ней.",

      noChar: "Обнаружено недопустимое значение - ",
    };

    let currentIdentifier = "";
    let isExit = false;
    let isError = false;
    // let flagEnd = false;
    let id = 0;
    let insideBlock = false;
    let openBraceCount = 0;
    for (let i = 0; i < chars.length; i++) {
      const isBlocked = isError || isExit ? true : false;

      const char = chars[i];

      if (!isBlocked && !insideBlock && char === "{") {
        insideBlock = true; // Входим в блок
        openBraceCount++;
        currentIdentifier = "";
      } else if (insideBlock && char === "}") {
        if (insideBlock) {
          openBraceCount--;
          insideBlock = false;
        }
        currentIdentifier = "";
      } else if (insideBlock) {
        currentIdentifier += char;
        if (currentIdentifier.includes("end.")) {
          errorMessage = "Обнаружено слово 'end.' внутри фигурных скобок!";
          isExit = true;
        }
      } else if (!isBlocked && !insideBlock) {
        if (
          !isLetter(char) &&
          !isDigit(char) &&
          !isDelimiters(char) &&
          char !== " " &&
          char !== "." &&
          char !== "+" &&
          char !== "-"
        ) {
          errorMessage = variantsErrorMessage.noChar + `"${char}"`;
          isError = true;
        }
        // Игнорируем если внутри блока
        if (
          isLetter(char) ||
          isDigit(char) ||
          char === "." ||
          char === "+" ||
          char === "-"
        ) {
          currentIdentifier += char;
        } else {
          const resultServiceWords = isServiceWords(currentIdentifier);
          const resultValidIdentifier = isValidIdentifier(currentIdentifier);

          if (resultServiceWords) {
            if (currentIdentifier === "end.") {
              isExit = true;
            }
            keywords.push({ value: currentIdentifier, id });
            id++;
            currentIdentifier = "";
            console.log(1);
          } else if (isLetter(currentIdentifier[0]) && !resultValidIdentifier) {
            currentIdentifier = "";
            errorMessage = variantsErrorMessage.noIdentifierLength;
            console.log(2);
            isError = true;
          } else if (isLetter(currentIdentifier[0])) {
            // if (currentIdentifier === "end") {
            // console.log("222222222");
            // flagEnd = true;
            // }
            if (/^[a-zA-Z0-9]+$/.test(currentIdentifier)) {
              identifiers.push({ value: currentIdentifier, id });
              id++;
              currentIdentifier = "";

              console.log(3);
            } else {
              errorMessage =
                variantsErrorMessage.noIdentifier + ` "${currentIdentifier}"`;
              currentIdentifier = "";
              isError = true;
            }
            // написать функцию которая проверяет currentIdentifier на число
          } else if (
            isDigit(currentIdentifier[0]) ||
            currentIdentifier[0] === "."
          ) {
            if (currentIdentifier === ".") {
              errorMessage =
                variantsErrorMessage.noChar + `"${currentIdentifier}"`;
              currentIdentifier = "";
              isError = true;
            } else if (/^[01]+[bB]$/.test(currentIdentifier)) {
              console.log("2b"); // binary +
              const decimalValue = parseInt(currentIdentifier.slice(0, -1), 2);
              numbers.push({ value: decimalValue.toString(), id });
              id++;
              currentIdentifier = "";
            } else if (/^[0-7]+[Oo]$/.test(currentIdentifier)) {
              console.log("8"); // octal +
              const decimalValue = parseInt(currentIdentifier.slice(0, -1), 8);
              numbers.push({ value: decimalValue.toString(), id });
              id++;
              currentIdentifier = "";
            } else if (
              /^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)$/.test(currentIdentifier)
            ) {
              if (currentIdentifier.startsWith(".")) {
                currentIdentifier = "0" + currentIdentifier;
              }
              console.log("10"); // decimal +
              numbers.push({ value: currentIdentifier, id });
              id++;
              currentIdentifier = "";
            } else if (/^[0-9a-fA-F]+[Hh]$/.test(currentIdentifier)) {
              console.log("16"); // hexadecimal
              const decimalValue = parseInt(currentIdentifier.slice(0, -1), 16);
              numbers.push({ value: decimalValue.toString(), id });
              id++;
              currentIdentifier = "";
            } else if (
              /^[0-9]+\.?[0-9]*[eE][+-]?[0-9]+$/.test(currentIdentifier)
            ) {
              console.log("E"); // exponential
              numbers.push({ value: currentIdentifier, id });
              id++;
              currentIdentifier = "";
            } else {
              errorMessage =
                variantsErrorMessage.noDigit + ` "${currentIdentifier}"`;
              currentIdentifier = "";
              isError = true;
            }
            // numbers.push({ value: currentIdentifier, id });
            // id++;
            // currentIdentifier = "";
            console.log(4);
          }
          if (isDelimiters(char)) {
            console.log(5);
            delimiters.push({ value: char, id });
            id++;
          }
          if (currentIdentifier.includes(".")) {
            errorMessage =
              variantsErrorMessage.noChar + `"${currentIdentifier}1"`;
            currentIdentifier = "";
            isError = true;
          }
          if (currentIdentifier.includes("+")) {
            errorMessage =
              variantsErrorMessage.noChar + `"${currentIdentifier}2"`;
            currentIdentifier = "";
            isError = true;
          }
          if (currentIdentifier.includes("+")) {
            errorMessage =
              variantsErrorMessage.noChar + `"${currentIdentifier}3"`;
            currentIdentifier = "";
            isError = true;
          }
        }
      }
    }

    if (openBraceCount > 0) {
      errorMessage =
        "Обнаружены открытые фигурные скобки без соответствующих закрывающих!";
      isError = true;
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

    for (const element of obj.allElements) {
      if (obj.keywords.some((item) => item.id === element.id)) {
        result.push({
          idTable: 1,
          idToTable: serviceWords.findIndex(
            (a) =>
              a.value.toLocaleLowerCase() === element.value.toLocaleLowerCase()
          ),
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

    if (filteredCharacters) {
      setIdentifiers([...filteredCharacters?.identifiers]);
      setNumbers([...filteredCharacters?.numbers]);
      const sortedCharacters = createIdMapping(filteredCharacters);

      setResult([...sortedCharacters] as ResultValue[]);
      setErrorMesage(filteredCharacters.errorMessage);
    }
  };

  const onChangeCode = (values: string) => {
    const value = values
      .split("\n")
      .map((line) => line.trim() + " ")
      .join("\n")
      .split("");

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
