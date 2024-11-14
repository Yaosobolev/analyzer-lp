import { useState } from "react";

export const useCodeFormatter = () => {
  const [code, setCode] = useState<string[]>([]);

  const onChangeCode = (values: string) => {
    const value = values
      .split("\n")
      .map((line) => line.trim() + " ")
      .join("\n")
      .split("");

    setCode(value);
  };

  return { code, onChangeCode };
};
