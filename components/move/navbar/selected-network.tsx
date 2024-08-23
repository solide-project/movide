"use client"

import Image from "next/image"
import * as React from "react"
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Button, buttonVariants } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils";

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SelectedNetworkProps extends React.HTMLAttributes<HTMLDivElement> { }

// const chains = await client.getChainIdentifier();
// console.log(chains, parseInt(chains, 16))
export function SelectedNetwork({ }: SelectedNetworkProps) {
    // const client = useSuiClient();
    // React.useEffect(() => {
    //     (async () => {
    //         const chains = await client.getChainIdentifier();
    //         console.log("Chain ID", chains, parseInt(chains, 16))
    //     })()
    // }, [])

    const ctx = useSuiClientContext();

    const getNetworkName = (network: string) => {
        switch (network) {
            case "testnet":
                return "Sui Testnet";
            case "devnet":
                return "Sui Devnet";
            case "mainnet":
                return "Sui Mainnet";
            case "m2":
                return "Movement M2";
            case "baku":
                return "Movement Baku";
            default:
                return "Unsupported Network";
        }
    }

    const getIconById = (network: string) => {
        switch (network) {
            case "m2":
            case "baku":
                return "/icons/movement.svg";
            default:
                return "/icons/sui.svg";
        }
    }

    return <HoverCard>
        <HoverCardTrigger>
            <Image
                width={50}
                height={50}
                alt={ctx.network}
                src={getIconById(ctx.network)}
                className={cn(
                    buttonVariants({ size: "icon", variant: "link" }),
                    "h-5 w-5 cursor-pointer sm:h-8 sm:w-8"
                )}
            />
        </HoverCardTrigger>
        <HoverCardContent>
            {getNetworkName(ctx.network) || "Unsupported Network"}
        </HoverCardContent>
    </HoverCard>
}