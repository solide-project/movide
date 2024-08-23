import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.SUI_MAINNET]: "https://suiscan.xyz/mainnet",
    [ChainID.SUI_TESTNET]: "https://suiscan.xyz/testnet",
    [ChainID.SUI_DEVNET]: "https://suiscan.xyz/devnet",
    [ChainID.MOVEMENT_DEVNET]: "https://sui.devnet.m2.movementlabs.xyz:443",
    [ChainID.MOVEMENT_BAKU]: "https://explorer.devnet.baku.movementlabs.xyz",
}

export const getExplorer = (network: string): string => data[network] || ""

export const getObjectExplorer = (network: string, contract: string): string => {
    const explorer = getExplorer(network)
    let addressPath = ""

    switch (network) {
        case ChainID.MOVEMENT_DEVNET:
        case ChainID.MOVEMENT_BAKU:
            addressPath = `object/${contract}?network=devnet`
            break
        default:
            addressPath = `object/${contract}`
            break
    }

    return `${explorer}/${addressPath}`
}

export const getDigestExplorer = (network: string, contract: string): string => {
    const explorer = getExplorer(network)
    let addressPath = ""

    switch (network) {
        case ChainID.MOVEMENT_DEVNET:
        case ChainID.MOVEMENT_BAKU:
            addressPath = `txblock/${contract}?network=devnet`
            break
        default:
            addressPath = `tx/${contract}`
            break
    }

    return `${explorer}/${addressPath}`
}
