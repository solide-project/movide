"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ConsoleLogger } from "@/components/core/console"
import { FileTree } from "@/components/core/file-tree"
import { IDE } from "@/components/core/ide"
import { IDEHeader } from "@/components/core/ide-header"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"
import {
    CODE_KEY,
    CONSOLE_KEY,
    EDITOR_KEY,
    FILE_KEY,
    useNav,
} from "@/components/core/providers/navbar-provider"
import { BuildDeploy } from "@/components/move/deploy/build-deploy"
import { MoveNavBar } from "@/components/move/navbar/navbar"
import { useMove } from "@/components/move/move-provider"
import { OBJECT_KEY } from "@/components/move/navbar/nav-item-object"
import { LoadObject } from "@/components/move/object/load-object"
import { CompileInput, parseInput } from "@/lib/move/input"
import { CompilerOutput } from "@/lib/move/compiler"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface MoveIDEProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Entire GitHub URL or an contract address
     */
    url?: string
    /**
     * Chain ID of contract address, should only be used when smart contract is address
     */
    chainId?: string
    title?: string
    content: string
    version?: string
    bytecodeId?: string
}

export function MoveIDE({
    url,
    chainId,
    title,
    content,
    version,
    bytecodeId,
}: MoveIDEProps) {
    const [input, setInput] = React.useState<any>({})

    const fs = useFileSystem()
    const ide = useEditor()
    const logger = useLogger()
    const move = useMove()

    const { setNavItemActive, isNavItemActive } = useNav()

    React.useEffect(() => {
        ; (async () => {
            setNavItemActive(EDITOR_KEY, true)
            setNavItemActive(FILE_KEY, true)
            setNavItemActive(CONSOLE_KEY, true)

            console.log("content", content)
            let input: CompileInput = parseInput(content)
            console.log("input", input)
            const entryFile = await fs.initAndFoundEntry(input.sources, title || "")
            if (entryFile) {
                ide.selectFile(entryFile)
            }

            logger.info("Welcome to Movide IDE")
        })()
    }, [])

    const [compiling, setCompiling] = React.useState<boolean>(false)
    const handleCompile = async () => {
        const start = performance.now()
        logger.info("Compiling ...")
        setCompiling(true)

        try {
            await doCompile()
        } catch (error: any) {
            logger.error(error)
        }

        const end = performance.now()
        logger.info(`Compiled in ${end - start} ms.`)
        setCompiling(false)

        setNavItemActive(CODE_KEY, true)
    }

    const doCompile = async () => {
        console.log("TODO Compiling ...")

        const sources = fs.generateSources()
        const source: any = { sources }
        const body = { input: source }
        console.log(body)

        const response = await fetch(`/api/compile`, {
            method: "POST",
            // body: formData,
            body: JSON.stringify(body),
        })


        if (!response.ok) {
            const data = (await response.json()) as any // CompileError

            logger.error(`Compiled with ${data.details.length} errors.`)
            // setCompilingState({ errors: data, })
            return
        }

        const data = await response.json()
        console.log(data)
        move.setOutput(data.output as CompilerOutput)
    }


    return (
        <div className="min-w-screen max-w-screen flex max-h-screen min-h-screen">
            <div className="py-2 pl-2">
                <MoveNavBar url={""} bytecodeId={bytecodeId} />
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-w-screen max-w-screen max-h-screen min-h-screen"
            >
                <ResizablePanel
                    defaultSize={30}
                    minSize={25}
                    className={cn({
                        hidden: !(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)),
                    })}
                >
                    <div className="flex max-h-screen w-full flex-col gap-y-2 overflow-y-auto p-2">
                        {isNavItemActive(FILE_KEY) && (
                            <FileTree className="rounded-lg bg-grayscale-025 pb-4" />)}
                        {isNavItemActive(CODE_KEY) && (
                            <BuildDeploy className="rounded-lg bg-grayscale-025" />)}
                        {isNavItemActive(OBJECT_KEY) && (
                            <LoadObject className="rounded-lg bg-grayscale-025" />)}
                    </div>
                </ResizablePanel>
                {(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)) && (
                    <ResizableHandle withHandle />
                )}
                <ResizablePanel defaultSize={70} minSize={5}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel
                            defaultSize={75}
                            minSize={5}
                            className={cn("relative", {
                                hidden: !isNavItemActive(EDITOR_KEY),
                            })}
                        >
                            {isNavItemActive(EDITOR_KEY) && (
                                <>
                                    <IDEHeader />
                                    <IDE />
                                    <Button
                                        className="absolute"
                                        style={{ bottom: "16px", right: "16px" }}
                                        size="sm"
                                        onClick={handleCompile}
                                        disabled={compiling}
                                    >
                                        {compiling ? "Compiling ..." : "Compile"}
                                    </Button>
                                </>
                            )}
                        </ResizablePanel>
                        {isNavItemActive(EDITOR_KEY) && isNavItemActive(CONSOLE_KEY) && (
                            <ResizableHandle withHandle />
                        )}
                        <ResizablePanel
                            defaultSize={25}
                            minSize={5}
                            className={cn(
                                "m-2 !overflow-y-auto rounded-lg bg-grayscale-025",
                                { hidden: !isNavItemActive(CONSOLE_KEY) }
                            )}
                        >
                            <ConsoleLogger className="p-3" />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}