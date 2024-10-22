"use client";

import { Button } from "@/components/ui";
import { Container, TableValues, TextareaCode } from "@/components/shared";
import { TextareaResult } from "@/components/shared/textarea-result";
import { figures, letters, separators, serviceWords } from "@/lib/constants";
import { useState } from "react";
import {
  formattingValues,
  isSeparator,
  isServiceWord,
  isValidNumber,
  isValidWord,
} from "@/lib";
import { ResultValue, Value } from "@/@types/value";

export default function Home() {
  const [identifiers, setIdentifiers] = useState<Value[]>([]);
  const [numbers, setNumbers] = useState<Value[]>([]);
  const [result, setResult] = useState<ResultValue[]>([]);
  const [code, setCode] = useState<string[]>([]);

  function isLetter(char: string): boolean {
    return /^[a-zA-Z]$/.test(char);
  }

  function isDigit(char: string): boolean {
    return /^\d$/.test(char);
  }

  function isValidIdentifier(identifier: string): boolean {
    if (identifier.length === 1) {
      return true;
    }

    return false;
  }

  function isServiceWords(identifier: string) {
    if (serviceWords.find((item) => item.value === identifier)) {
      return true;
    }
    return false;
  }

  function isIdentifier(identifier: string) {
    if (isLetter(identifier[0])) {
      for (const char of identifier) {
        if (isLetter(char) && isDigit(char)) {
          return true;
        }
      }
    }
    if (isValidIdentifier(identifier)) {
      return identifier;
    }

    return false;
  }

  // Функция для фильтрации символов
  function filterCharacters(chars: string[]) {
    const identifiers = [];
    const delimiters = [];
    const keywords = [];
    const numbers = [];

    let currentIdentifier = "";
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (isLetter(char) || isDigit(char)) {
        currentIdentifier += char;
      } else {
        const resultServiceWords = isServiceWords(currentIdentifier);
        const resultValidIdentifier = isValidIdentifier(currentIdentifier);

        if (resultServiceWords) {
          keywords.push(currentIdentifier);
          currentIdentifier = "";
        } else if (resultValidIdentifier) {
          currentIdentifier = "";

          return;
        } else if (isLetter(currentIdentifier[0])) {
          identifiers.push(currentIdentifier);
          currentIdentifier = "";
        } else {
          // identifiers.push(currentIdentifier);
          currentIdentifier = "";
        }
      }
    }

    return {
      identifiers,
      delimiters,
      keywords,
      numbers,
    };
  }

  // function filterCharacters(chars, criteria) {
  //   const { identifiers, numbers, delimiters, keywords } = criteria;

  //   // Фильтрация по идентификаторам
  //   const validIdentifier = (char) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(char);

  //   // Фильтрация по числам&lt;br&gt;
  //   const validNumber = (char) => /^[0-9]$/.test(char);

  //   // Фильтрация по ограничителям
  //   const validDelimiter = (char) => delimiters.includes(char);

  //   // Фильтрация по ключевым словам
  //   const validKeyword = (char) => keywords.includes(char);

  //   return chars.filter((char) => {
  //     return (
  //       (identifiers && validIdentifier(char)) ||
  //       (numbers && validNumber(char)) ||
  //       (delimiters && validDelimiter(char)) ||
  //       (keywords && validKeyword(char))
  //     );
  //   });
  // }

  const analysis = (value: string[]) => {
    const result = filterCharacters(value);
    console.log("result: ", result);
    // const filtered = filterCharacters(value, criteria);
    // console.log("filtered: ", filtered);
    let index = 0;
    const lettersAndNumbers = [...letters, ...figures];
    // const startsWithValidLetter = letters.some((letter) =>
    //   word.startsWith(letter)
    // );

    // const chars = word.value.split("");

    // const allValidChars = [...chars].every((char) =>
    //   lettersAndNumbers.includes(char)
    // );
    // const serviceWord = isServiceWord(word);

    //   return startsWithValidLetter && allValidChars;
    value.forEach((char) => {
      const isLetter = letters.includes(char);
      if (isLetter) {
        const newIdentifier: Value = {
          id: index++,
          value: char,
        };
      }
    });
  };

  // const handleCode = (value: Value[]) => {
  //   const filteredWords = value.filter(isValidWord);
  //   const filteredNumbers = value.filter(isValidNumber);
  //   const filteredServiceWord = value
  //     .map(isServiceWord)
  //     .filter((item) => item !== undefined);
  //   const filteredSeparator = value
  //     .map(isSeparator)
  //     .filter((item) => item !== undefined);

  //   setIdentifiers(filteredWords);
  //   setNumbers(filteredNumbers);

  //   const formattedWords = formattingValues(filteredWords, 3);
  //   const formattedNumbers = formattingValues(filteredNumbers, 4);
  //   const formattedServiceWord = formattingValues(filteredServiceWord, 1, true);
  //   const formattedSeparator = formattingValues(
  //     filteredSeparator as ConstantValue[],
  //     2,
  //     true
  //   );

  //   const sortedValues = [
  //     ...formattedWords,
  //     ...formattedNumbers,
  //     ...formattedServiceWord,
  //     ...formattedSeparator,
  //   ].sort((a, b) => a.id - b.id);

  //   setResult(sortedValues);
  // };

  const onChangeCode = (values: string) => {
    const value = values.split("");

    // const value = values.split(" ");

    // console.log("isSeparators: ", isSeparators);
    // const formattedValues = value.flatMap((item, index) => {
    //   let word = [
    //     {
    //       id: index,
    //       value: item,
    //     },
    //   ];
    //   console.log("word: ", word);

    //   const chars = item.split("").filter(isSeparator);

    //   if (chars.length > 0) {
    //     word = [...chars].map((char, j) => {
    //       return {
    //         id: index + j,
    //         value: char,
    //       };
    //     });
    //   }
    //   console.log("word: ", word);

    //   return word;
    // });

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
          <TextareaResult result={result} />
        </div>
      </Container>
    </div>
  );
}
