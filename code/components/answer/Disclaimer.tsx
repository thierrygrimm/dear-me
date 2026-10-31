import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type Props = {
  children?: string;
  className?: string;
};

export function Disclaimer({ children, className }: Props) {
  return (
    <p className={cn("dm-small dm-muted", className)}>
      {children ?? copy.answer.disclaimer}
    </p>
  );
}
