import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.SUI_MAINNET]: "SUI Mainnet",
    [ChainID.SUI_TESTNET]: "SUI Testnet",
    [ChainID.SUI_DEVNET]: "SUI Devnet",
    [ChainID.MOVEMENT_DEVNET]: "Movement M2",
}

export const getNetworkNameFromChainID = (network: string): string =>
    data[network] || ""