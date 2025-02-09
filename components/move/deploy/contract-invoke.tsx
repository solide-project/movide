import { Button } from "@/components/ui/button";
import {
    ConnectButton,
    useSignAndExecuteTransaction
} from "@mysten/dapp-kit";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { useMove } from "../move-provider";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/components/core/providers/logger-provider";
import { SuiMoveNormalizedFunction, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useSuiHooks } from "@/lib/move/hook";
import { MoveModule, TypeSingle, TypeStruct } from "@/lib/move/interface";
import { useMoveHook } from "./hook-move";
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Title } from "@/components/core/components/title";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getObjectExplorer } from "@/lib/chains";
import { getDigestExplorer } from "@/lib/chains/explorer";

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const { output } = useMove();
    const logger = useLogger();
    const moveHook = useMoveHook();
    const { client, account, getNormalizedMoveModulesByPackage } = useSuiHooks();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [digest, setDigest] = useState('');
    const [packageAddress, setPackageAddress] = useState<string>("");

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

        signAndExecuteTransaction({
            transaction: tx,
            //chain: 'sui:baku',
        }, {
            onSuccess: async (result) => {
                setDigest(result.digest);

                const chains = await client.getChainIdentifier();
                const chainId = parseInt(chains, 16).toString()

                logger.info(<div className="flex gap-2">Transaction Digest: {" "}
                    <a className="underline" href={getDigestExplorer(chainId, result.digest)} target="_blank">
                        {result.digest}
                    </a>
                </div>)

                // Fetching package
                const data = await getPackageByDigest(result.digest);
                setPackageAddress(data?.packageId || "")
                logger.success(`Contract deployed at: ${data?.packageId || ""}`)

                // Fetching package ABI
                if (data?.packageId) {
                    const packageAddress = data?.packageId
                    const pkg = await getNormalizedMoveModulesByPackage(packageAddress)
                    if (pkg) {
                        moveHook.setContract(packageAddress, pkg)
                    }
                }
            },
            onError: async (result) => {
                console.log(result)
                logger.error(`Contract Deployment Failed. Make sure you switch to the correct network in IDE Settings`)
            }
        });
    }

    const handleLoadPackage = async () => {
        try {
            const packageMove = await getNormalizedMoveModulesByPackage(packageAddress)
            if (packageMove) {
                logger.success(`Contract deployed at ${packageAddress}`)
                moveHook.setContract(packageAddress, packageMove)
                setPackageAddress("")
            }
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
    const [isInvoking, setIsInvoking] = useState<boolean>(false)

    const handleInvoke = async (packageId: string, module: string,
        method: string, abi: SuiMoveNormalizedFunction) => {
        try {
            setIsInvoking(true)
            await doInvoke(packageId, module, method, abi)
        } catch (e) {
            logger.error("Error invoking contract")
            console.error(e)

            await postInvoke()
        }
        // finally {
        //     await postInvoke()
        // }
    }

    const postInvoke = async () => {
        await removeSelectPackage()
        setIsInvoking(false)
    }

    const doInvoke = async (packageId: string, module: string,
        method: string, abi: SuiMoveNormalizedFunction) => {
        const target = `${packageId}::${module}::${method}`;
        const tx = new Transaction();

        const params = contractArguments[target] || []
        const args: TransactionArgument[] = []
        parseArgs(module, abi)
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

        logger.info(
            <div className="flex gap-2">
                <ArrowRight size={18} /> <div>{`${packageId.slice(0, 8)}...${packageAddress.slice(-5)}::${module}::${method}`}</div>
            </div>)

        signAndExecuteTransaction({ transaction: tx, }, {
            onSuccess: async ({ digest }) => {
                const tx = await client
                    .waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    })

                console.log(tx)
                const chains = await client.getChainIdentifier();
                const chainId = parseInt(chains, 16).toString()

                const objectId = tx.effects?.created?.[0]?.reference?.objectId;
                if (objectId) {
                    logger.info(<div className="flex gap-2">
                        <ArrowLeft size={18} />Objected Created: {" "}
                        <a className="underline" href={getObjectExplorer(chainId, objectId)} target="_blank">
                            {objectId}
                        </a>
                    </div>)
                }

                const results = { ...blockResponse }
                results[method] = tx
                setBlockResponse(results)
                logger.info(<div className="flex gap-2">Transaction Digest: {" "}
                    <a className="underline" href={getDigestExplorer(chainId, digest)} target="_blank">
                        {digest}
                    </a>
                </div>)

                postInvoke()
            },
            onError: (error) => {
                console.error(error.message)
                logger.error(error.message)

                postInvoke()
            }
        });
    }

    const [contractArguments, setContractArguments] = useState<{
        [target: string]: { [parameter: string]: any }
    }>({})

    const handleArgumentChange = (
        packageId: string,
        module: string,
        method: string,
        name: number,
        value: string
    ) => {
        const target = `${packageId}::${module}::${method}`;

        const newArgs = { ...contractArguments }

        if (!newArgs.hasOwnProperty(target)) {
            newArgs[target] = {}
        }

        newArgs[target][name] = value
        setContractArguments(newArgs)
    }

    /**
     * Give something like 0x12345...::counter::create
     * contractAddress = 0x12345...
     * module = counter
     * method = create
     */
    const [selectedContractAddress, setSelectedContractAddress] =
        useState<string>("")
    const [selectedModule, setSelectedModule] =
        useState<string>("")
    const [selectedAbiMethod, setSelectedAbiMethod] =
        useState<string>("")
    const [selectedAbiParameter, setSelectedAbiParameter] =
        useState<SuiMoveNormalizedFunction | null>(null)

    const selectPackage = async (packageId: string, module: string, method: string, abi: SuiMoveNormalizedFunction) => {
        setSelectedContractAddress(packageId)
        setSelectedModule(module)
        setSelectedAbiMethod(method)
        setSelectedAbiParameter(abi)
    }

    const removeSelectPackage = async () => {
        setSelectedContractAddress("")
        setSelectedModule("")
        setSelectedAbiMethod("")
        setSelectedAbiParameter(null)
    }

    const handleRemoveContract = async (key: string) => {
        moveHook.removeContract(key)
    }

    return <div>
        <div className="flex items-center justify-center my-2">
            <ConnectButton />
        </div>

        <div className="flex gap-2 my-2">
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

        <Title text="Deployed Contracts" />
        {Object.entries(moveHook.contracts).map(([packageId, val], index) => {
            return (
                <CollapsibleChevron
                    key={index}
                    name={packageId}
                    onClosed={() => handleRemoveContract(packageId)}
                >
                    <div>
                        {Object.entries(val).map(([module, value]) => {
                            return <div className="flex flex-wrap gap-2" key={module}>
                                {Object.entries(value.exposedFunctions).map(([method, abi]) => {
                                    return <Button key={method}
                                        size="sm" disabled={false}
                                        onClick={() => selectPackage(packageId, module, method, abi)}
                                    >
                                        {method}
                                    </Button>
                                })}
                            </div>
                        })}
                    </div>
                </CollapsibleChevron>
            )
        })}

        <Dialog
            open={!!selectedAbiParameter}
            onOpenChange={removeSelectPackage}
        >
            <DialogContent className="max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedAbiMethod}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {selectedAbiParameter && selectedAbiMethod && (
                    <>
                        {parseArgs(selectedModule, selectedAbiParameter).map((param, index) => {
                            return <div key={index} className="my-2">
                                <Input placeholder={param.type} onChange={(e) => handleArgumentChange(
                                    selectedContractAddress, selectedModule, selectedAbiMethod, index, e.target.value
                                )} />
                            </div>
                        })}

                        <Button onClick={() => handleInvoke(
                            selectedContractAddress, selectedModule, selectedAbiMethod, selectedAbiParameter)}
                            disabled={isInvoking}
                        >
                            {isInvoking
                                ? "Invoking..." : "Invoke"}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>

        {/* <div>
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
        </div> */}
    </div >
}