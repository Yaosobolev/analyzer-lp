import { Value } from "@/@types/value";
import { match } from "..";

export const consume = (
  tokens: Value[],
  position: number,
  value: string
): number => {
  if (match(tokens, position, value)) {
    return position + 1;
  } else {
    throw new Error(`Ожидалось "${value}" ${tokens[position].value}`);
  }
};
