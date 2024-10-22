import { Label, Textarea } from "../ui";

interface Props {
  onChangeCode: (value: string) => void;
}

export const TextareaCode: React.FC<Props> = ({ onChangeCode }) => {
  return (
    <div className="w-full">
      <Label htmlFor="message" className="">
        Блок кода
      </Label>
      <Textarea
        className="min-h-48"
        onChange={(e) => onChangeCode(e.target.value)}
      />
    </div>
  );
};
