import { Value } from "@/@types/value";
import { figures } from "./constants";

export const isValidNumber = (numbers: Value) => {
  const chars = numbers.value.split("");

  const allValidChars =
    chars.length > 0 && [...chars].every((char) => figures.includes(char));

  return allValidChars;
};
