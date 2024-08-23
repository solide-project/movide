import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.SUI_MAINNET]: "Sui Mainnet",
    [ChainID.SUI_TESTNET]: "Sui Testnet",
    [ChainID.SUI_DEVNET]: "Sui Devnet",
    [ChainID.MOVEMENT_DEVNET]: "Movement M2",
    [ChainID.MOVEMENT_BAKU]: "Movement Baku",
}

export const getNetworkNameFromChainID = (network: string): string =>
    data[network] || ""