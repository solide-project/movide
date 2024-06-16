"use client"

import { cn } from "@/lib/utils"

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
}

export function Title({ className, text }: TitleProps) {
  return (
    <div
      className={cn(
        "py-2 text-center font-semibold text-grayscale-350",
        className
      )}
    >
      {text}
    </div>
  )
}
