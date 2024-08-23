"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Delete } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface CollapsibleChevronProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  onClosed?: () => void
}

export function CollapsibleChevron({
  name = "Metadata",
  onClosed,
  className,
  children,
}: CollapsibleChevronProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("my-1 gap-2", className)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <div className="truncate">{name}</div>
        <div className="flex space-x-2">
          <div
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
          {onClosed && (
            <div
              className={buttonVariants({ variant: "secondary", size: "icon" })}
              onClick={onClosed}
            >
              <Delete />
            </div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="">{children}</CollapsibleContent>
    </Collapsible>
  )
}
