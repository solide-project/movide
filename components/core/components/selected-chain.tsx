"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SelectedChainProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  src: string
}

export function SelectedChain({ name, src }: SelectedChainProps) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger>
        <Image
          width={50}
          height={50}
          alt={"Network Icon"}
          loader={() => src}
          src={src}
          // src={getIconByChainId(chainId.toString())}
          className={cn(
            buttonVariants({ size: "icon", variant: "none" }),
            "size-5 cursor-pointer sm:size-8"
          )}
        />
      </HoverCardTrigger>
      <HoverCardContent>{name || "Unsupported Network"}</HoverCardContent>
    </HoverCard>
  )
}
