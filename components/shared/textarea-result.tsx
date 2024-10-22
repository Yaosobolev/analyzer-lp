import { ResultValue } from "@/@types/value";
import { Label, Textarea } from "../ui";

interface Props {
  result: ResultValue[];
}

export const TextareaResult: React.FC<Props> = ({ result }) => {
  return (
    <div className="w-full">
      <Label htmlFor="message" className="">
        Результат
      </Label>
      <Textarea
        className="min-h-48"
        value={result.map((el) => `(${el.idTable}, ${el.idToTable})`)}
      />
    </div>
  );
};
