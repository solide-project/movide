"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"

import {
    ChainID,
    getIconByChainId,
    getNetworkNameFromChainID,
} from "@/lib/chains"
import { cn } from "@/lib/utils"
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

import { ScrollArea } from "../ui/scroll-area"

interface SelectChainProps extends React.HTMLAttributes<HTMLDivElement> {
    handleOnChange?: (value: string) => void
}

export function SelectChain({ handleOnChange }: SelectChainProps) {
    const params = useParams()

    const [open, setOpen] = useState(false)

    let chain = params.chain as string
    if (!(Object.values(ChainID) as string[]).includes(chain)) {
        chain = ChainID.MOVEMENT_BAKU
    }

    const [value, setValue] = useState<string>(chain)

    useEffect(() => {
        handleOnChange && handleOnChange(value)
    }, [value])

    const chainList = Object.entries(ChainID).map(([_, value]) => ({
        value: value.toString(),
        label: getNetworkNameFromChainID(value),
    }))

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger className={buttonVariants({ variant: "ghost" })}>
                <Image
                    width={36}
                    height={36}
                    alt={getNetworkNameFromChainID(value)}
                    loader={() => getIconByChainId(value)}
                    src={getIconByChainId(value)}
                    className={cn("size-6 cursor-pointer border-none")}
                />
                <div>{value && getNetworkNameFromChainID(value)}</div>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search chain..." />
                    <CommandEmpty>No chain found.</CommandEmpty>
                    <ScrollArea>
                        <CommandGroup>
                            <CommandList className="max-h-[256px] overflow-auto">
                                {chainList && chainList.map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        value={getNetworkNameFromChainID(framework.value)}
                                        onSelect={(currentValue) => {
                                            setValue(framework.value)
                                            handleOnChange && handleOnChange(framework.value)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 size-4",
                                                value === framework.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
