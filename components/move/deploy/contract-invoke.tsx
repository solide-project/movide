import { Button } from "@/components/ui/button";
import {
    ConnectButton,
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
    useSuiClientContext,
    useSwitchAccount
} from "@mysten/dapp-kit";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { useMove } from "../move-provider";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/components/core/providers/logger-provider";
import { SuiMoveNormalizedFunction, SuiMoveNormalizedModule, SuiMoveNormalizedType, SuiObjectChange, SuiTransactionBlock, SuiTransactionBlockResponse } from "@mysten/sui/client";

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const { output } = useMove();
    const logger = useLogger();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const ctx = useSuiClientContext();
    const client = useSuiClient();
    const account = useCurrentAccount();

    const [digest, setDigest] = useState('');
    const [packageAddress, setPackageAddress] = useState<string>("");
    const [packageContract, setPackageContract] = useState<MoveModule>({} as MoveModule);

    useEffect(() => {
        (async () => {
            if (!digest) {
                logger.info("Digest is empty")
                return
            }

            const data = await getPackageByDigest(digest);
            setPackageAddress(data?.packageId || "")
        })
    }, [digest])

    const handleDeploy = async () => {
        console.log("Deploying contract...")

        const tx = new Transaction();
        const [upgradeCap] = await tx.publish({
            modules: output.modules,
            dependencies: output.dependencies,
        });
        tx.transferObjects([upgradeCap], account?.address || "")

        signAndExecuteTransaction({ transaction: tx, chain: 'sui:devnet', }, {
            onSuccess: async (result) => {
                console.log('executed transaction', result);
                setDigest(result.digest);
                const data = await getPackageByDigest(result.digest);
                setPackageAddress(data?.packageId || "")
            },
        });
    }

    const loadObject = async () => {
        try {
            const chains = await client.getChainIdentifier();
            console.log(chains, parseInt(chains, 16))
            const data: MoveModule = await client.call('sui_getNormalizedMoveModulesByPackage', [packageAddress]);

            const keys = Object.keys(data)
            console.log(data)
            setPackageContract(data);
            // const response = await fetch(`https://fullnode.devnet.sui.io/`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         jsonrpc: '2.0',
            //         id: 1,
            //         method: 'sui_getNormalizedMoveModulesByPackage',
            //         params: [packageAddress],
            //     }),
            // });

            // const data = await response.json();
            // console.log(data)
        } catch (e) {
            logger.error("Error loading object")
            console.error(e)
        }
    }

    const getPackageByDigest = async (digest: string) => {
        try {
            const data: SuiTransactionBlockResponse = await client.call('sui_getTransactionBlock', [digest,
                {
                    "showInput": true,
                    "showEffects": true,
                    "showEvents": true,
                    "showBalanceChanges": true,
                    "showObjectChanges": true
                }
            ]);

            const published = data.objectChanges?.filter((change) => change.type === 'published').pop();

            if (!published) {
                throw new Error("No published package found")
            }

            return published.type === 'published' ? published : null;
        } catch (e: any) {
            logger.error(e.message || "Error loading digest")
            console.error(e)
        }
    }

    const parseArgs = (pkg: string, abi: SuiMoveNormalizedFunction) => {
        const params: { index: number, type: string }[] = []
        abi.parameters.forEach((param, index) => {
            if (typeof param.valueOf() === "string") {
                const data = param.valueOf() as TypeSingle
                params.push({
                    index,
                    type: data,
                })
            }

            if (param.valueOf().hasOwnProperty("MutableReference")) {
                const data = ((param.valueOf() as any).MutableReference as any).Struct as TypeStruct;

                if (data.module === "tx_context") {
                } else if (data.module === pkg) {
                    params.push({
                        index,
                        type: "module",
                    })
                }
            }

            if (param.valueOf().hasOwnProperty("Reference")) {
                const data = ((param.valueOf() as any).Reference as any).Struct as TypeStruct;

                if (data.module === "tx_context") {
                } else if (data.module === pkg) {
                    params.push({
                        index,
                        type: "module",
                    })
                }
            }
        })

        return params
    }

    const [blockResponse, setBlockResponse] = useState<{ [key: string]: SuiTransactionBlockResponse }>({} as any)

    const invokeContract = async (pkg: string, method: string, abi: SuiMoveNormalizedFunction) => {
        const target = `${packageAddress}::${pkg}::${method}`;
        const tx = new Transaction();

        const params = contractArguments[target] || []
        // const args = Object.keys(params).map(key => params[key]);
        const args: TransactionArgument[] = []
        const inputs = parseArgs(pkg, abi)
        inputs.forEach((input, index) => {
            console.log(input, params[index])
            if (input.type === "module") {
                args.push(tx.object(params[index]))
            } else if (input.type === "U8") {
                args.push(tx.pure.u8(params[index]))
            } else if (input.type === "U16") {
                args.push(tx.pure.u16(params[index]))
            } else if (input.type === "U32") {
                args.push(tx.pure.u32(params[index]))
            } else if (input.type === "U64") {
                args.push(tx.pure.u64(params[index]))
            } else if (input.type === "U128") {
                args.push(tx.pure.u128(params[index]))
            }
        })

        console.log(target, args)

        tx.moveCall({
            arguments: args,
            target,
        });

        signAndExecuteTransaction({ transaction: tx, }, {
            onSuccess: async ({ digest }) => {
                const tx = await client
                    .waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    })
                const objectId = tx.effects?.created?.[0]?.reference?.objectId;

                console.log(objectId, tx)
                const results = { ...blockResponse }
                results[method] = tx
                setBlockResponse(results)
                logger.info(`Transaction Digest: ${digest}`)
            },
            onError: (error) => {
                console.error(error)
            }
        });
    }

    const [contractArguments, setContractArguments] = useState<{
        [key: string]: { [key: string]: any }
    }>({})

    const handleArgumentChange = (
        pkg: string,
        method: string,
        name: number,
        value: string
    ) => {
        const target = `${packageAddress}::${pkg}::${method}`;

        const newArgs = { ...contractArguments }

        if (!newArgs.hasOwnProperty(target)) {
            newArgs[target] = {}
        }

        newArgs[target][name] = value
        setContractArguments(newArgs)
    }


    return <div>
        <ConnectButton />

        {digest && <div>
            Digest: {digest}
        </div>}

        <div className="flex">
            <Button
                size="sm"
                onClick={handleDeploy}
                variant="default"
                disabled={!output.modules}
            >
                Deploy
            </Button>

            <Button
                size="sm"
                onClick={loadObject}
                variant="default"
                disabled={!packageAddress}
            >
                Load Package
            </Button>

            <Button
                size="sm"
                onClick={() => getPackageByDigest(packageAddress)}
                variant="default"
                disabled={!packageAddress}
            >
                Load Digest
            </Button>
        </div>

        <Input
            className="h-9 rounded-md px-3"
            placeholder="Package Address"
            value={packageAddress}
            onChange={(e) => setPackageAddress(e.target.value)}
        />

        <div>
            {packageContract ?
                <div>
                    {Object.entries(packageContract).map(([pkg, value]) => {
                        return <div key={pkg}>
                            {Object.entries(value.exposedFunctions).map(([method, abi]) => {
                                return <div key={method}>
                                    <Button
                                        size="sm"
                                        disabled={false}
                                        onClick={() => invokeContract(pkg, method, abi)}
                                    >
                                        {`${method} ( ${abi.parameters && abi.parameters.length > 0 ? "..." : ""} )`}
                                    </Button>
                                    {/* {JSON.stringify(abi)} */}
                                    {parseArgs(pkg, abi).map((param, index) => {
                                        return <div key={index} className="my-2">
                                            {/* {<RenderArg module={pkg} param={param} onChange={(e) => handleArgumentChange(
                                                pkg, method, index, e.target.value
                                            )} />} */}
                                            <Input placeholder={param.type} onChange={(e) => handleArgumentChange(
                                                pkg, method, index, e.target.value
                                            )} />
                                        </div>
                                    })}

                                    {blockResponse[method] && <div>
                                        {JSON.stringify(blockResponse[method])}
                                    </div>}
                                </div>
                            })}
                        </div>
                    })}
                </div>
                : <div>Deploy or Load Package to interact</div>}
        </div>
    </div>
}

interface MoveModule {
    [key: string]: SuiMoveNormalizedModule;
}

type TypeSingle = 'Bool' | 'U8' | 'U16' | 'U32' | 'U64' | 'U128' | 'U256' | 'Address' | 'Signer';
interface TypeStruct {
    address: string;
    module: string;
    name: string;
    typeArguments: SuiMoveNormalizedType[];
}

export interface RenderArgProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    param: SuiMoveNormalizedType,
    module: string,
}