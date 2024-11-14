import { Value } from "./value";

export interface StateLexixal {
  identifiers: Value[];
  delimiters: Value[];
  keywords: Value[];
  numbers: Value[];
  allElements: Value[];
  currentIdentifier: string;
  errorMessage: string;
  isExit: boolean;
  isError: boolean;
  id: number;
  insideBlock: boolean;
}
