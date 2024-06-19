import { InvalidMessage } from "@/components/core/components/invalid-message"
import { MoveProvider } from "@/components/move/move-provider"
import { MoveIDE } from "@/components/move/ide"
import { getSourceCode } from "@/lib/move/source";

export default async function Page({
    params,
}: {
    params: { chain: string; address: string }
}) {
    const data = await getSourceCode(
        params.chain,
        params.address
    )

    if (typeof data.result === "string") {
        return (
            <InvalidMessage>
                {data.result} {JSON.stringify(data)}
            </InvalidMessage>
        )
    }

    return <MoveProvider>
        <MoveIDE
            url={params.address}
            chainId={params.chain}
            title={data.result[0].ContractName}
            content={data.result[0].SourceCode}
            version={data.result[0].CompilerVersion}
            bytecodeId={data.result[0].BytcodeContract}
        />
    </MoveProvider>
}