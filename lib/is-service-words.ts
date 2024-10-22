import { Value } from "@/@types/value";
import { serviceWords } from "./constants";

export const isServiceWord = (serviceWord: Value) => {
  const allValidChars = [...serviceWords]
    .map((item) => {
      return {
        ...item,
        id: serviceWord.id,
      };
    })
    .find((service) => service.value === serviceWord.value);

  return allValidChars;
};
