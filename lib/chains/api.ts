import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.SUI_MAINNET]: "https://api.welldonestudio.io/compiler/sui/verifications",
    [ChainID.SUI_DEVNET]: "https://api.welldonestudio.io/compiler/sui/verifications",
    [ChainID.SUI_TESTNET]: "https://api.welldonestudio.io/compiler/sui/verifications",
    [ChainID.MOVEMENT_DEVNET]: "",
}

export const getAPI = (network: string): string => data[network] || ""