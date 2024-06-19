import { ChainID } from "@/lib/chains"
import { ExplorerInterface } from "./explorer-service"
import { WellDoneClient } from "./welldone"

export const getScanner = (chainId: string, apiKey: string = ""): ExplorerInterface | undefined => {
    switch (chainId) {
        case ChainID.SUI_MAINNET:
        case ChainID.SUI_DEVNET:
        case ChainID.SUI_TESTNET:
            return new WellDoneClient(chainId, apiKey)
    }
}