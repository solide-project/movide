import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.SUI_MAINNET]: "https://suiscan.xyz/mainnet",
    [ChainID.SUI_TESTNET]: "https://suiscan.xyz/testnet",
    [ChainID.SUI_DEVNET]: "https://suiscan.xyz/devnet",
    [ChainID.MOVEMENT_DEVNET]: "https://explorer.sui.devnet.m2.movementlabs.xyz",
}

export const getExplorer = (network: string): string => data[network] || ""

export const getObjectExplorer = (network: string, contract: string): string => {
    const explorer = getExplorer(network)
    let addressPath = ""

    switch (network) {
        case ChainID.MOVEMENT_DEVNET:
            addressPath = `object/${contract}?network=devnet`
            break
        default:
            addressPath = `object/${contract}`
            break
    }

    return `${explorer}/${addressPath}`
}