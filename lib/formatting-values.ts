import { ConstantValue, Value } from "@/@types/value";

export const formattingValues = (
  values: Value[] | ConstantValue[],
  idTable: number,
  isConstants?: boolean
) => {
  return values.map((item, index) => {
    return {
      ...item,
      idTable,
      idToTable: isConstants ? (item as ConstantValue).idToTable : index + 1,
    };
  });
};
