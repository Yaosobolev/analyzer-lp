import { Value } from "@/@types/value";
import { figures, letters } from "./constants";
import { isServiceWord } from "./is-service-words";

export const isValidWord = (word: Value) => {
  const lettersAndNumbers = [...letters, ...figures];
  const startsWithValidLetter = letters.some((letter) =>
    word.value.startsWith(letter)
  );

  const chars = word.value.split("");

  const allValidChars = [...chars].every((char) =>
    lettersAndNumbers.includes(char)
  );
  const serviceWord = isServiceWord(word);

  //   return startsWithValidLetter && allValidChars;
  return startsWithValidLetter && allValidChars && !serviceWord;
};
