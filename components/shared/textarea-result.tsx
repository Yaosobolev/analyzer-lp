import { ResultValue } from "@/@types/value";
import { Label, Textarea } from "../ui";

interface Props {
  result: ResultValue[] | string;
  errorMessage?: string;
  title: string;
  type?: number;
}

export const TextareaResult: React.FC<Props> = ({
  result,
  errorMessage,
  title,
  type,
}) => {
  const resultMap =
    typeof result === "string"
      ? result.length > 0
        ? result
            .split("\n")
            .map((el, index) => `${index}: ${el} \n`)
            .join("")
        : ""
      : result.map((el) => `(${el.idTable}, ${el.idToTable + 1})`);

  return (
    <div className="w-full">
      <Label htmlFor="message" className="">
        {title}
      </Label>
      <Textarea
        className="min-h-48"
        readOnly
        value={
          type === 1
            ? errorMessage && errorMessage.length > 1
              ? errorMessage
              : resultMap
            : resultMap
        }
      />
    </div>
  );
};
