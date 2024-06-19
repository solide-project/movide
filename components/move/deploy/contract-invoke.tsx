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
import { useSuiHooks } from "@/lib/move/hook";
import { MoveModule, TypeSingle, TypeStruct } from "@/lib/move/interface";

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const { output } = useMove();
    const logger = useLogger();
    const { client, account, getNormalizedMoveModulesByPackage } = useSuiHooks();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [digest, setDigest] = useState('');
    const [packageAddress, setPackageAddress] = useState<string>("");
    const [packageContract, setPackageContract] = useState<MoveModule>({} as MoveModule);

    const [deploying, setDeploying] = useState<boolean>(false);
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
        try {
            setDeploying(true)
            await doDeploy();
        } catch (e: any) {
            if (e.message === "Invalid Sui address") {
                e.message === "Invalid Sui address, Please connect to a valid Sui network"
            }
            logger.error(e.message || "Error deploying contract")

            console.error(e)
        } finally {
            setDeploying(false)
        }
    }

    const doDeploy = async () => {
        logger.info("Deploying contract...")
        const tx = new Transaction();
        const [upgradeCap] = await tx.publish({
            modules: output.modules,
            dependencies: output.dependencies,
        });
        tx.transferObjects([upgradeCap], account?.address || "")

        signAndExecuteTransaction({ transaction: tx, chain: 'sui:devnet', }, {
            onSuccess: async (result) => {
                // Setting digest
                setDigest(result.digest);
                logger.info(`Digest: ${result.digest}`)

                // Fetching package
                const data = await getPackageByDigest(result.digest);
                setPackageAddress(data?.packageId || "")
                logger.success(`Package deploy with id: ${data?.packageId || ""}`)

                // Fetching package ABI
                if (data?.packageId) {
                    const data = await getNormalizedMoveModulesByPackage(packageAddress)
                    setPackageContract(data);
                }
            },
        });
    }

    const handleLoadPackage = async () => {
        try {
            const data = await getNormalizedMoveModulesByPackage(packageAddress)
            setPackageContract(data);
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

    const parseArgs = (packageName: string, abi: SuiMoveNormalizedFunction) => {
        const params: { index: number, type: string }[] = []
        abi.parameters.forEach((param, index) => {
            if (typeof param.valueOf() === "string") {
                params.push({ index, type: param.valueOf() as TypeSingle, })
                return;
            }

            const value = param.valueOf() as any;
            if (value.hasOwnProperty("MutableReference")) {
                const data = value.MutableReference.Struct as TypeStruct;

                // Note we are skipping the tx_context
                if (data.module === packageName) {
                    params.push({ index, type: "module", })
                }
                return;
            }

            if (value.hasOwnProperty("Reference")) {
                const data = value.Reference.Struct as TypeStruct;

                // Note we are skipping the tx_context
                if (data.module === packageName) {
                    params.push({ index, type: "module", })
                }
                return;

            }
        })

        return params
    }

    const [blockResponse, setBlockResponse] = useState<{ [key: string]: SuiTransactionBlockResponse }>({} as any)

    const handleInvoke = async (pkg: string, method: string, abi: SuiMoveNormalizedFunction) => {
        try {
            await doInvoke(pkg, method, abi)
        } catch (e) {
            logger.error("Error invoking contract")
            console.error(e)
        }
    }

    const doInvoke = async (pkg: string, method: string, abi: SuiMoveNormalizedFunction) => {
        const target = `${packageAddress}::${pkg}::${method}`;
        const tx = new Transaction();

        const params = contractArguments[target] || []
        const args: TransactionArgument[] = []
        parseArgs(pkg, abi)
            .forEach((input, index) => {
                // console.log(input, params[index])
                switch (input.type) {
                    case "module":
                        args.push(tx.object(params[index]));
                        break;
                    case "U8":
                        args.push(tx.pure.u8(params[index]));
                        break;
                    case "U16":
                        args.push(tx.pure.u16(params[index]));
                        break;
                    case "U32":
                        args.push(tx.pure.u32(params[index]));
                        break;
                    case "U64":
                        args.push(tx.pure.u64(params[index]));
                        break;
                    case "U128":
                        args.push(tx.pure.u128(params[index]));
                        break;
                    default:
                        break;
                }
            })

        tx.moveCall({
            arguments: args,
            target,
        });

        logger.info(`Invoking contract: ${target}`)
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

                if (objectId) {
                    logger.info(`Object Created: ${objectId}`)
                }

                const results = { ...blockResponse }
                results[method] = tx
                setBlockResponse(results)
                logger.info(`Transaction Digest: ${digest}`)
            },
            onError: (error) => {
                console.error(error)
                logger.error(`Invoking contract: ${target}`)
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
        <div className="flex items-center justify-center my-2">
            <ConnectButton />
        </div>

        <div className="flex">
            <Button
                size="sm"
                onClick={handleDeploy}
                variant="default"
                disabled={!output.modules && deploying}
            >
                {deploying ? "Deploying ..." : "Deploy"}
            </Button>

            <Button
                size="sm"
                onClick={handleLoadPackage}
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
                                    <Button size="sm" disabled={false}
                                        onClick={() => handleInvoke(pkg, method, abi)}
                                    >
                                        {`${method} ( ${abi.parameters && abi.parameters.length > 0 ? "..." : ""} )`}
                                    </Button>
                                    {/* {JSON.stringify(abi)} */}
                                    {parseArgs(pkg, abi).map((param, index) => {
                                        return <div key={index} className="my-2">
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