import { Value, ValueMapping } from "@/@types/value";
import { consume } from "./consume";
import { description } from "./description";

const filterTokens = (tokens: Value[]): Value[] => {
  return tokens.filter((token) => token.value !== "\n");
};

const filterTokensMapping = (tokens: ValueMapping[]): ValueMapping[] => {
  return tokens.filter((token) => token.idTable !== 2 || token.idToTable !== 7);
};

export const program = (
  tokens: Value[],
  position: number,
  tokensMapping: ValueMapping[]
) => {
  const filteredTokens = filterTokens(tokens);
  const filteredTokensMapping = filterTokensMapping(tokensMapping);

  position = consume(filteredTokens, position, "program");
  position = consume(filteredTokens, position, "var");
  position = description(filteredTokens, position, filteredTokensMapping); // Разбор Opis
  position = consume(filteredTokens, position, "begin");
  // position = sOper(tokens, position); // Разбор SOper
  position = consume(tokens, tokens.length - 1, "end.");
  return { position };
};
