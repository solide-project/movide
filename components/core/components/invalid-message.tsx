import { cn } from "@/lib/utils"

interface InvalidMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InvalidMessage({ children, className }: InvalidMessageProps) {
  return (
    <div
      className={cn(
        "flex h-32 items-center justify-center space-x-2 text-center text-xs md:text-sm lg:text-base",
        className
      )}
    >
      {children}
    </div>
  )
}