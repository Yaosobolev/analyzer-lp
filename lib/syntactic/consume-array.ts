import { Value } from "@/@types/value";

export const consumeArray = (
  tokens: Value[],
  position: number,
  value: string[]
): number => {
  if (value.includes(tokens[position].value.toLocaleLowerCase())) {
    return position + 1;
  } else {
    throw new Error(
      `Ожидалось "${value}" в позиции ${position}, но найдена "${tokens[position].value}"`
    );
  }
};
