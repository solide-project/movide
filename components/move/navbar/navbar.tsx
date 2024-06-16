"use client"

import { NavItemCode } from "@/components/core/navbar/nav-item-code"
import { NavItemContent } from "@/components/core/navbar/nav-item-content"
import { NavItemEditor } from "@/components/core/navbar/nav-item-editor"
import { NavItemFile } from "@/components/core/navbar/nav-item-file"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"

import { NavItemConsole } from "@/components/core/navbar/nav-item-console"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MoveSettings } from "@/components/move/settings/settings"
import { NavItemDownloader } from "@/components/move/navbar/nav-item-downloader"
import { SelectedNetwork } from "@/components/move/navbar/selected-network"
import { NavItemObject } from "@/components/move/navbar/nav-item-object"

interface MoveNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
    url: string,
    bytecodeId?: string,
}

export function MoveNavBar({
    url,
    bytecodeId
}: MoveNavBarProps) {
    return (
        <div className="flex h-full flex-col gap-y-2 rounded-lg bg-grayscale-025 px-2 py-4">
            <NavTooltipItem tooltip="File Explorer">
                <NavItemFile />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Build & Deploy">
                <NavItemCode />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Object">
                <NavItemObject />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Editor">
                <NavItemEditor />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Console">
                <NavItemConsole />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Source">
                <NavItemContent url={url} />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Download Smart Contract">
                <NavItemDownloader />
            </NavTooltipItem>

            <div className="mt-auto flex flex-col items-center gap-2">
                {/* {bytecodeId && <NavItemBytecode id={bytecodeId} />} */}
                <SelectedNetwork />
                <NavItemTheme />
                <MoveSettings />
            </div>
        </div>
    )
}


const NavTooltipItem = ({ children, tooltip }: { children: React.ReactNode, tooltip: string }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild={true}>
                <div>
                    {children}
                </div>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}