import { Value } from "@/@types/value";

export const match = (
  tokens: Value[],
  position: number,
  value: string,
  type?: string
): boolean => {
  const token = tokens[position];
  return (
    (type !== undefined && value === type) ||
    token?.value.toLocaleLowerCase() === value.toLocaleLowerCase()
  );
};
