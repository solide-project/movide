export interface ExplorerInterface {
    chainId: string
    getSourceCodeEndpoint(address: string): string
    getSourceCode(address: string): Promise<EthGetSourceCodeInterface>
}

export interface EthGetSourceCodeInterface {
    status: string
    message: string
    result:
    | ContractInfo[]
    | string
}

export interface ContractInfo {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;

    // This is addon for Solide
    BytcodeContract?: string;        // This is the id of the contract provided by Solide
}

export const generateSourceCodeError = (
    ...messages: string[]
): EthGetSourceCodeInterface => ({
    status: "0",
    message: "NOTOK",
    result: messages.join(", "),
})