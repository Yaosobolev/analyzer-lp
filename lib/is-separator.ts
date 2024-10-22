import { Value } from "@/@types/value";
import { separators } from "./constants";

export const isSeparator = (separator: Value | string) => {
  // console.log("separator: ", separator);
  if (typeof separator === "object") {
    return [...separators]
      .map((item) => {
        return {
          ...item,
          id: separator.id,
        };
      })
      .find((service) => service.value === separator.value);
  }
  // console.log(
  //   "[...separators].find((item) => item.value === separator);: ",
  //   [...separators].find((item) => item.value === separator)
  // );
  const result = [...separators].find((item) => item.value === separator);
  return result;
};
