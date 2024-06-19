import path from "path";
import fs from "fs";
import { BaseScan } from "./base";
import { ExplorerInterface, EthGetSourceCodeInterface } from "./explorer-service";
import JSZip from 'jszip';

export class SuiScanClient extends BaseScan implements ExplorerInterface {
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
        let results: any = this.generateDefaultResult()
        let sourceInput: any = {
            sources: {},
        }

        // Move to source folder
        Object.entries(data as Record<string, string>).forEach(([key, value]) => {
            const filePath = this.appendExtension(path.join("sources", key))
            sourceInput.sources[filePath] = {
                content: value,
            }
        })

        const tomlPath = path.resolve('./public/sample', 'move.toml');
        const content: string = fs.readFileSync(tomlPath).toString();
        sourceInput.sources["Move.toml"] = {
            content: content
        }

        results.SourceCode = `${JSON.stringify(sourceInput)}`

        // Using studio
        const api = "https://api.welldonestudio.io/compiler/sui/verifications?network=testnet&packageId=0xa26ed098438ab05122f4e2b6902946df1d001f61e77d69e587b6064f0a907bd3"
        const response = await fetch(api)
        const info = await response.json()
        console.log(info.verifiedSrcUrl)
        if (info.verifiedSrcUrl) {
            const response = await fetch(info.verifiedSrcUrl)

            const blob = await response.blob();

            // Convert Blob to ArrayBuffer for JSZip
            const arrayBuffer = await blob.arrayBuffer();
            console.log(arrayBuffer)

            const zip = await JSZip.loadAsync(arrayBuffer);

            // Process the files in the ZIP
            zip.forEach((relativePath, file) => {
                file.async("string").then((content) => {
                    sourceInput.sources[relativePath] = {
                        content: content
                    }
                });
            });
        }


        return {
            status: "1",
            message: "OK",
            result: [results],
        }
    }
}