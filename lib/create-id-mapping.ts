import { analysisResult } from "@/app/page";
import { separators, keywords } from "./constants";

export function createIdMapping(
  obj: analysisResult
): { idTable: number; idToTable: number }[] {
  const result: { idTable: number; idToTable: number }[] = [];

  const uniqueIdentifiers = obj.identifiers.filter(
    (item, index, self) =>
      self.findIndex((t) => t.value === item.value) === index
  );
  const uniqueNumbers = obj.numbers.filter(
    (item, index, self) =>
      self.findIndex((t) => t.value === item.value) === index
  );

  // Определение таблицы и индекса по элементу
  for (const element of obj.allElements) {
    if (obj.keywords.some((item) => item.id === element.id)) {
      result.push({
        idTable: 1,
        idToTable: keywords.findIndex(
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
        idToTable: uniqueIdentifiers.findIndex(
          (a) => a.value === element.value
        ),
      });
    } else if (obj.numbers.some((item) => item.id === element.id)) {
      result.push({
        idTable: 4,
        idToTable: uniqueNumbers.findIndex((a) => a.value === element.value),
      });
    }
  }

  return result;
}
