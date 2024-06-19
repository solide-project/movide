import { execSync } from "child_process";

export interface CompilerOutput {
    modules: string[],
    dependencies: string[],
    digest: Uint8Array[]
}

export const compile = async (sourcePath: string, toml: string = "") => {
    // Using different environment
    // const [, compiledModules] = execSync(
    //     `sui client switch --env m2 && \
    //     sui move build --dump-bytecode-as-base64 --path ${sourcePath}`,
    //     { encoding: 'utf-8' }
    // ).split("\n");

    if (toml.startsWith("/")) {
        toml = toml.slice(1);
    }
    if (toml.toLocaleLowerCase().endsWith("/move.toml")) {
        toml = toml.slice(0, -9);
    }

    // console.log(`sui move build --dump-bytecode-as-base64 --path ${sourcePath}/${toml}`);
    const compiledModules = execSync(
        `sui move build --dump-bytecode-as-base64 --path ${sourcePath}/${toml}`,
        { encoding: 'utf-8' }
    );

    const output: CompilerOutput = JSON.parse(compiledModules);
    return output;
}