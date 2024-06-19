import path from "path";
import fs from "fs";
import { BaseScan } from "./base";
import { ExplorerInterface, EthGetSourceCodeInterface, generateSourceCodeError } from "./explorer-service";
import JSZip from 'jszip';

export class WellDoneClient extends BaseScan implements ExplorerInterface {
    constructor(chainId: string, apiKey?: string) {
        super(chainId, apiKey)
    }

    async getSourceCode(address: string): Promise<EthGetSourceCodeInterface> {
        let data = await this.call(address)
        if (data.status === "0") {
            return data
        }

        return await this.convert(data, address)
    }

    async convert(
        data: any,      // Record<string, string>
        address: string
    ): Promise<EthGetSourceCodeInterface> {
        if (!data || !data.verifiedSrcUrl) {
            return generateSourceCodeError("Contract is not verified")
        }

        let results: any = this.generateDefaultResult()
        let sourceInput: any = {
            sources: {},
        }

        const response = await fetch(data.verifiedSrcUrl)
        const blob = await response.blob();

        const arrayBuffer = await blob.arrayBuffer();

        const zip = await JSZip.loadAsync(arrayBuffer);
        for (const relativePath in zip.files) {
            // Skip directories
            if (relativePath.endsWith("/") ||
                relativePath.includes(".git/") ||
                relativePath.startsWith("node_modules")) {
                continue
            }
            const file = zip.files[relativePath];
            const content = await file.async("string")

            sourceInput.sources[relativePath] = {
                content: content
            }
        };

        results.SourceCode = `${JSON.stringify(sourceInput)}`

        return {
            status: "1",
            message: "OK",
            result: [results],
        }
    }
}