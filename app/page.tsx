"use client";

import { Button } from "@/components/ui";
import { Container, TableValues, TextareaCode } from "@/components/shared";
import { TextareaResult } from "@/components/shared/textarea-result";
import { separators, keywords } from "@/lib/constants";
import { useState } from "react";

import { ResultValue, Value } from "@/@types/value";
import {
  createIdMapping,
  filterCharacters,
  parseSemantical,
  parseSyntax,
} from "@/lib";
import { useCodeFormatter } from "@/hooks";

export interface analysisResult {
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
  const [errorMesage, setErrorMesage] = useState<string>("");

  const { code, onChangeCode } = useCodeFormatter();

  // Сделать хук
  const analysis = (value: string[]) => {
    const filteredCharacters = filterCharacters(value);

    if (filteredCharacters) {
      setIdentifiers([...filteredCharacters?.identifiers]);
      setNumbers([...filteredCharacters?.numbers]);
      const sortedCharacters = createIdMapping(filteredCharacters);

      setResult([...sortedCharacters] as ResultValue[]);
      setErrorMesage(filteredCharacters.errorMessage);

      // Вызов синтаксического анализатора
      if (filteredCharacters.errorMessage === "") {
        const syntaxResult = parseSyntax(
          filteredCharacters.allElements,
          sortedCharacters
        );
        if (syntaxResult?.success) {
          const semanticalResult = parseSemantical(
            filteredCharacters.allElements,
            sortedCharacters
          );
          console.log("semanticalResult: ", semanticalResult);

          if (semanticalResult.success) {
          } else {
            setErrorMesage(String(semanticalResult.errorMessage));
          }
        } else {
          setErrorMesage(String(syntaxResult?.errorMessage));
        }
      }
    }
  };

  return (
    <Container>
      <div className="flex gap-2 flex-wrap">
        <TableValues title="Cлужебные слова" values={keywords} indexTable={1} />
        <TableValues title="Ограничители" values={separators} indexTable={2} />
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
  );
}
