import { MoveModule } from "@/lib/move/interface"
import { useState } from "react"

export interface DeployedContracts {
    [key: string]: MoveModule
}

export interface InvokeParam {
    method: string
    args: any[]
    value?: string
    gas?: string
}



export const useMoveHook = () => {
    const [contracts, setContracts] = useState<DeployedContracts>({})

    const invoke = async () => {

    }

    const setContract = async (key: string, module: MoveModule) => {
        setContracts({
            ...contracts,
            [key]: module
        })
    }

    const removeContract = (contractAddress: string) => {
        if (contracts.hasOwnProperty(contractAddress)) {
            delete contracts[contractAddress]
            setContracts({ ...contracts })
        }
    }

    return {
        contracts,
        setContract,
        removeContract,
        invoke,
    }
}   