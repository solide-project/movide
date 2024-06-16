export interface CompileInput {
    language: "Move"
    settings?: {
        outputSelection: any
        optimizer: any
        evmVersion: string
        metadata: any
        libraries: any
        remappings: any
        metadataHash: string
    }
    sources: {
        [key: string]: CompileSource
    }
}

export interface CompileSource {
    content: string
}

/**
 * convert string to CompilerInput
 * @param content
 * @returns
 */
export const parseInput = (content: string) => {
    try {
        const input = JSON.parse(content)
        return input
    } catch (error) {

    }

    try {
        const input = JSON.parse(content.slice(1, -1))
        return input
    } catch (error) {
        return undefined
    }
}