import { Value } from "@/@types/value";

export const matchArray = (
  tokens: Value[],
  position: number,
  value: string[]
): boolean => {
  const token = tokens[position];
  return value.includes(token.value.toLocaleLowerCase());
};
