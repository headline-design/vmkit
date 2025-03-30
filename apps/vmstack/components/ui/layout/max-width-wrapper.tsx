import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const MaxWidthWrapper = ({
  className,
  children,
  preClassName,
}: {
  className?: string;
  children: ReactNode;
  preClassName?: any;
}) => {
  return (
    <div
      className={cn(
        className,
        ` mx-auto w-full max-w-screen-xl px-4 lg:px-6`,
        preClassName
      )}
    >
      {children}
    </div>
  );
}

export default MaxWidthWrapper;