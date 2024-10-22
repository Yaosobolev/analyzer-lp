import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-2 ",
        className
      )}
    >
      <div className="flex flex-col gap-3 max-w-[900px]">{children}</div>
    </div>
  );
};
