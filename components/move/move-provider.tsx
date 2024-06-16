"use client"

import { CompilerOutput } from "@/lib/move/compiler"
import { CompileError } from "@/lib/move/error"
import React, { createContext, useContext, useEffect, useState } from "react"

export const MoveProvider = ({ children }: MoveProviderProps) => {
    const [output, setOutput] = useState<CompilerOutput>({} as CompilerOutput)
    const [errors, setErrors] = useState<CompileError>({} as CompileError)

    useEffect(() => {
    }, [])

    const resetBuild = () => {
        setOutput({} as CompilerOutput)
    }

    return (
        <MoveContext.Provider
            value={{
                resetBuild,
                output,
                setOutput,
                errors,
                setErrors,
            }}
        >
            {children}
        </MoveContext.Provider>
    )
}

interface MoveProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const MoveContext = createContext({
    resetBuild: () => { },
    output: {} as CompilerOutput,
    setOutput: (output: CompilerOutput) => { },
    errors: {} as CompileError,
    setErrors: (errors: CompileError) => { },
})

export const useMove = () => useContext(MoveContext)