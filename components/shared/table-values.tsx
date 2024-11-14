import { Value } from "@/@types/value";
import { ScrollArea, Separator } from "@/components/ui";

import { cn } from "@/lib/utils";

interface Props {
  values: Value[] | { idToTable: number; value: string }[];
  title: string;
  indexTable: number;

  className?: string;
}
// для этого сделать тип { idToTable: number; value: string }[]

export const TableValues: React.FC<Props> = ({
  values,
  title,
  indexTable,
  className,
}) => {
  const sortedValues = values.filter(
    (item, index, self) =>
      self.findIndex((t) => t.value === item.value) === index
  );

  return (
    <ScrollArea className={cn("h-72 w-48 rounded-md border", className)}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          {title} ({indexTable})
        </h4>
        {sortedValues.map((item, index) => (
          <div key={index}>
            <div className="text-sm">
              <span>{index + 1} </span>
              {item.value === "\n" ? "\\n" : item.value}
            </div>
            {index !== values.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
