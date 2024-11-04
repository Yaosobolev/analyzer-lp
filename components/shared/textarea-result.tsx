import { ResultValue } from "@/@types/value";
import { Label, Textarea } from "../ui";

interface Props {
  result: ResultValue[];
  errorMessage?: string;
}

export const TextareaResult: React.FC<Props> = ({ result, errorMessage }) => {
  // console.log("result: ", result);
  return (
    <div className="w-full">
      <Label htmlFor="message" className="">
        Результат
      </Label>
      <Textarea
        className="min-h-48"
        value={
          errorMessage && errorMessage.length > 1
            ? errorMessage
            : result.map((el) => `(${el.idTable}, ${el.idToTable + 1})`)
        }
      />
    </div>
  );
};
