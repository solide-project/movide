export const getNetworkNameByConfig = (network: string) => {
    switch (network) {
        case "testnet":
            return "Sui Testnet";
        case "devnet":
            return "Sui Devnet";
        case "mainnet":
            return "Sui Mainnet";
        case "m2":
            return "Movement M2";
        default:
            return "Unsupported Network";
    }
}

export const getIconByConfig = (network: string) => {
    switch (network) {
        case "m2":
            return "/icons/movement.svg";
        default:
            return "/icons/sui.svg";
    }
}