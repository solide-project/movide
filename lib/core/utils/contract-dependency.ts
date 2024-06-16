import { ContractPaths } from "./paths"

export interface ContractDependency {
    fileContents: string
    originalContents?: string
    paths: ContractPaths
}