const data: { [key: string]: string } = {
    ["mainnet"]: "Sui Mainnet",
    ["testnet"]: "Sui Testnet",
    ["devnet"]: "Sui Devnet",
    ["m2"]: "Movement M2",
    ["baku"]: "Movement Baku",
}

export const getNetworkNameByConfig = (network: string) => data[network] || ""

export const getIconByConfig = (network: string) => {
    console.log(network)
    switch (network) {
        case "m2":
        case "baku":
            return "/icons/movement.svg";
        default:
            return "/icons/sui.svg";
    }
}