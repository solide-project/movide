"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface EVMSelectedChainWarningProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function EVMSelectedChainWarning({}: EVMSelectedChainWarningProps) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger>
        <Button size="icon" variant="ghost">
          <AlertTriangle color="orange" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        Couldn&apos;t found Ethereum injection. Please install Metamask or
        Collect Wallet
      </HoverCardContent>
    </HoverCard>
  )
}
