import { Value, ValueMapping } from "@/@types/value";
import { consume } from "./consume";
import { listIdentifiers } from "./list-identifiers";
import { consumeArray } from "./consume-array";
import _ from "lodash";

export const description = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[],
  identifiers: Value[]
) => {
  const identifierLocal: Value[] = _.cloneDeep(identifiers);

  if (tokens.find((item) => item.value.toLocaleLowerCase().includes("begin"))) {
    while (tokens[position].value.toLocaleLowerCase() !== "begin") {
      const { identifierList: newIdentifierList, position: newPosition } =
        listIdentifiers(tokens, tokensMapping, position, identifierLocal);
      identifierLocal.unshift(...newIdentifierList);
      position = newPosition;

      position = consume(tokens, position, ":");
      const type = (position = consumeArray(tokens, position, [
        "int",
        "float",
        "bool",
      ]));

      identifierLocal.map((item) => {
        if (newIdentifierList.find((element) => element.id === item.id)) {
          item.type = tokens[type - 1].value;
        }
      });

      position = consume(tokens, position, ";");
    }
  }

  return { position, identifiers: _.uniqBy(identifierLocal, "value") };
};
