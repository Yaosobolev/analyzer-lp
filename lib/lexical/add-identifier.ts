import { StateLexixal } from "@/@types/lexical";
import { isIdentifier } from "./is-identifier";
import { variantsErrorMessage } from "../constants";

export const addIdentifier = (state: StateLexixal) => {
  if (isIdentifier(state.currentIdentifier)) {
    state.identifiers.push({
      value: state.currentIdentifier,
      id: state.id,
    });
    state.id++;
    state.currentIdentifier = "";
  } else {
    state.errorMessage =
      variantsErrorMessage.noIdentifier + ` "${state.currentIdentifier}"`;
    state.currentIdentifier = "";
    state.isError = true;
  }
};
