"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface CollapsibleChevronProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export function CollapsibleChevron({
    name = "Metadata",
    className,
    children,
}: CollapsibleChevronProps) {
    const [isOpen, setIsOpen] = useState(false)

    return <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("my-1 gap-2", className)}>
        <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div className="truncate">{name}</div>
            <div className={buttonVariants({ variant: "secondary", size: "icon" })}>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="">{children}</CollapsibleContent>
    </ Collapsible>
}