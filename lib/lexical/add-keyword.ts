import { StateLexixal } from "@/@types/lexical";

export const addKeyword = (state: StateLexixal) => {
  if (state.currentIdentifier.toLocaleLowerCase() === "end.") {
    state.isExit = true;
  }
  state.keywords.push({ value: state.currentIdentifier, id: state.id });
  state.id++;
  state.currentIdentifier = "";
};
