import { getScanner } from "./scanner";

export const getSourceCode = async (chain: string, address: string) => {
    const scanner = getScanner(chain);

    if (!scanner) {
        throw new Error("Chain may not be supported")
    }
    return await scanner.getSourceCode(address)
}