"use client"

import { useSuiClientContext } from "@mysten/dapp-kit";
import { buttonVariants } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLogger } from "@/components/core/providers/logger-provider";
import { getNetworkNameByConfig } from "@/lib/chains";

interface SelectNetworkProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SelectNetwork({ className }: SelectNetworkProps) {
    const ctx = useSuiClientContext();
    const logger = useLogger()

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<any>("")

    // useEffect(() => {
    //     console.log(ctx.network)
    // }, [ctx.network])

    useEffect(() => {
        setValue(ctx.network)
    }, [])

    return <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger className={cn(buttonVariants({ variant: "default" }))}>
            {value ? getNetworkNameByConfig(value) : "Select Network"}
        </PopoverTrigger>
        <PopoverContent className="p-0">
            <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                <CommandEmpty>No framework found.</CommandEmpty>
                <ScrollArea className="h-[200px]">
                    <CommandGroup>
                        <CommandList>
                            {Object.keys(ctx.networks || []).map((network: string, index: number) => (
                                <CommandItem
                                    key={index}
                                    value={network}
                                    onSelect={(currentValue: string) => {
                                        ctx.selectNetwork(currentValue)
                                        setValue(currentValue)
                                        setOpen(false)
                                        logger.info(`Selected network: ${getNetworkNameByConfig(currentValue)}`)
                                    }}
                                >
                                    {getNetworkNameByConfig(network)}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </ScrollArea>
            </Command>
        </PopoverContent>
    </Popover>
}