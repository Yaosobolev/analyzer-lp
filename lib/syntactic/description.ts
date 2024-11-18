import { Value, ValueMapping } from "@/@types/value";
import { consume } from "./consume";
import { listIdentifiers } from "./list-identifiers";
import { consumeType } from "./consume-type";

export const description = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
) => {
  if (tokens.find((item) => item.value.toLocaleLowerCase().includes("begin"))) {
    while (tokens[position].value.toLocaleLowerCase() !== "begin") {
      position = listIdentifiers(tokens, tokensMapping, position);
      position = consume(tokens, position, ":");
      position = consumeType(tokens, position, ["int", "float", "bool"]);
      position = consume(tokens, position, ";");
    }
  }

  return position;
};
