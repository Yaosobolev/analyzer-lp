import { StateLexixal } from "@/@types/lexical";
import { variantsErrorMessage } from "../constants";

export const handleInsideBlock = (char: string, state: StateLexixal) => {
  state.currentIdentifier += char;
  if (state.currentIdentifier.toLocaleLowerCase().includes("end.")) {
    state.errorMessage = variantsErrorMessage.noValueInsideBraces;
    state.isError = true;
  }
};
