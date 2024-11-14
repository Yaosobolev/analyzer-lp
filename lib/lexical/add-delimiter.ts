import { StateLexixal } from "@/@types/lexical";

export const addDelimiter = (char: string, state: StateLexixal) => {
  state.delimiters.push({ value: char, id: state.id });
  state.id++;
};
