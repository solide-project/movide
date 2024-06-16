import { execSync } from "child_process";

export interface CompilerOutput {
    modules: string[],
    dependencies: string[],
    digest: Uint8Array[]
}

export const compile = async (sourcePath: string) => {
    // Using different environment
    const [, compiledModules] = execSync(
        `sui client switch --env m2 && \
        sui move build --dump-bytecode-as-base64 --path ${sourcePath}`,
        { encoding: 'utf-8' }
    ).split("\n");

    // const compiledModules = execSync(
    //     `sui move build --dump-bytecode-as-base64 --path ${tempProjectSourcesPath}`,
    //     { encoding: 'utf-8' }
    // );

    const output: CompilerOutput = JSON.parse(compiledModules);
    return output;
}