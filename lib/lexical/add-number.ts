import { StateLexixal } from "@/@types/lexical";
import {
  isBynarial,
  isDecimal,
  isExponential,
  isHexadecimal,
  isOctal,
} from "@/lib";
import { variantsErrorMessage } from "../constants";

export const addNumber = (state: StateLexixal) => {
  if (state.currentIdentifier === ".") {
    state.errorMessage =
      variantsErrorMessage.noChar + `"${state.currentIdentifier}"`;
    state.isError = true;
  } else if (isBynarial(state.currentIdentifier)) {
    const decimalValue = parseInt(state.currentIdentifier.slice(0, -1), 2);
    state.numbers.push({ value: decimalValue.toString(), id: state.id });
    state.id++;
  } else if (isOctal(state.currentIdentifier)) {
    const decimalValue = parseInt(state.currentIdentifier.slice(0, -1), 8);
    state.numbers.push({ value: decimalValue.toString(), id: state.id });
    state.id++;
  } else if (isDecimal(state.currentIdentifier)) {
    if (state.currentIdentifier.startsWith(".")) {
      state.currentIdentifier = "0" + state.currentIdentifier;
    }
    state.numbers.push({ value: state.currentIdentifier, id: state.id });
    state.id++;
  } else if (isHexadecimal(state.currentIdentifier)) {
    const decimalValue = parseInt(state.currentIdentifier.slice(0, -1), 16);
    state.numbers.push({ value: decimalValue.toString(), id: state.id });
    state.id++;
  } else if (isExponential(state.currentIdentifier)) {
    if (state.currentIdentifier.startsWith(".")) {
      state.currentIdentifier = "0" + state.currentIdentifier;
    }
    state.numbers.push({ value: state.currentIdentifier, id: state.id });
    state.id++;
  } else {
    state.errorMessage =
      variantsErrorMessage.noChar + `"${state.currentIdentifier}"`;
    state.isError = true;
  }
  state.currentIdentifier = "";
};
