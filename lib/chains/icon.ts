import { ChainID } from "./chain-id";

export const getIconByChainId = (network: string) => {
    switch (network) {
        case ChainID.MOVEMENT_DEVNET:
        case ChainID.MOVEMENT_BAKU:
            return "/icons/movement.svg";
        default:
            return "/icons/sui.svg";
    }
}