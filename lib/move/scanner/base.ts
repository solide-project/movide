import { ChainID, getAPI } from "@/lib/chains"
import { ContractInfo, EthGetSourceCodeInterface } from "./explorer-service"

/**
 * Base of Etherscan implementation, other scanner will have these overrides
 */
export class BaseScan {
    chainId: string
    apiKey: string

    constructor(chainId: string, apiKey?: string) {
        this.chainId = chainId
        this.apiKey = apiKey || ""
    }

    //#region getSoureCode implementation
    getSourceCodeEndpoint(address: string): string {
        switch (this.chainId) {
            case ChainID.SUI_MAINNET:
                return `?network=mainnet&packageId=${address}`
            case ChainID.SUI_DEVNET:
                return `?network=devnet&packageId=${address}`
            case ChainID.SUI_TESTNET:
                return `?network=testnet&packageId=${address}`
            default:
                return `/${address}`
        }
    }

    getsourcecodeURL(address: string): string {
        const apiUrl: string = getAPI(this.chainId)
        if (!apiUrl) {
            return ""
        }

        let uri = `${apiUrl}/${this.getSourceCodeEndpoint(address)}`
        // const apiKey = getAPIKey(this.chainId)
        if (this.apiKey) {
            uri = uri.concat(`&apikey=${this.apiKey}`)
        }

        return uri
    }

    async call(address: string): Promise<any> {
        const apiUrl: string = this.getsourcecodeURL(address)
        console.log(apiUrl)
        if (!apiUrl) {
            return generateSourceCodeError("API Endpoint not found")
        }

        // console.log(apiUrl)
        const response = await fetch(apiUrl)
        if (!response || !response.ok) {
            return generateSourceCodeError("Error fetching contract")
        }

        let data = (await response.json()) as EthGetSourceCodeInterface
        return data
    }

    async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
        let data: EthGetSourceCodeInterface = await this.call(address)
        if (data.status === "0") {
            return data
        }

        return data
    }
    //#endregion

    //#region utils

    /**
     * Append a given extension to string if it doesn't already have it.
     * Sometimes we want to turn the contract source into a .sol path
     * @param payload
     * @param extension
     * @returns
     */
    appendExtension = (payload: string, extension: string = ".move"): string => {
        if (!payload.endsWith(extension)) {
            return payload.concat(extension)
        }

        return payload
    }

    generateDefaultResult = (): ContractInfo => {
        return {
            SourceCode: "",
            ABI: "",
            ContractName: "",
            CompilerVersion: "",
            OptimizationUsed: "",
            Runs: "",
            ConstructorArguments: "",
            EVMVersion: "",
            Library: "",
            LicenseType: "",
            Proxy: "",
            Implementation: "",
            SwarmSource: "",
        }
    }
    //#endregion
}

export const generateSourceCodeError = (
    ...messages: string[]
): EthGetSourceCodeInterface => ({
    status: "0",
    message: "NOTOK",
    result: messages.join(", "),
})