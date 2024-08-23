"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { Title } from "../../core/components/title"
import { useMove } from "../move-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SuiObjectData } from "@mysten/sui/client"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { useLogger } from "@/components/core/providers/logger-provider"
import { ObjectCard } from "./object-card"
import { getObjectExplorer } from "@/lib/chains/explorer"

interface LoadObjectProps extends React.HTMLAttributes<HTMLDivElement> { }

export function LoadObject({ className }: LoadObjectProps) {
    const client = useSuiClient();
    const logger = useLogger()

    const [loadingObject, setLoadingObject] = useState<boolean>(false)
    const [objectId, setObjectId] = useState<string>("")

    const [objects, setObjects] = useState<{ [key: string]: SuiObjectData }>({} as { [key: string]: SuiObjectData })

    const doObjectLoad = async () => {
        // logger.info(`Loading object: ${objectId}`)
        const results: { data: SuiObjectData } = await client.call('sui_getObject', [objectId,
            {
                showContent: true,
                showOwner: true,
                showType: true,
            }
        ]);

        const data = results.data
        if (!data || !data.content) {
            throw new Error("No Object found")
        }

        if (data.content?.dataType !== "moveObject") {
            throw new Error(`Invalid object type: ${data.content?.dataType}`)
        }

        setObjects({
            ...objects,
            [objectId]: data
        })
        console.log(data)

        const chains = await client.getChainIdentifier();
        const chainId = parseInt(chains, 16).toString()
        logger.success(<div>
            Objected loaded at {" "}
            <a className="underline" href={getObjectExplorer(chainId, objectId)} target="_blank">
                {objectId}
            </a>
        </div>)
    }

    const handleObjectLoad = async () => {
        try {
            setLoadingObject(true)
            await doObjectLoad();
        } catch (e: any) {
            logger.error(e.message || "Error loading digest")
            console.error(e)
        } finally {
            setLoadingObject(false)
        }
    }

    const removeObject = (key: string) => {
        if (objects.hasOwnProperty(key)) {
            delete objects[key]
            setObjects({ ...objects })
        }
    }
    return <div className={cn("px-2 pb-4", className)}>
        <Title text="Objects" />

        <div className="flex items-center my-2 gap-2">
            <Button
                size="sm"
                onClick={handleObjectLoad}
                variant="default"
                disabled={!objectId || loadingObject}
            >
                {loadingObject ? "..." : "Import"}
            </Button>

            <Input
                className="h-9 rounded-md px-3"
                placeholder="Object ID"
                value={objectId}
                onChange={(e) => setObjectId(e.target.value)}
            />
        </div>

        <div className="flex flex-col gap-2">
            {objects && Object.entries(objects).map(([obj, value], index) =>
                <ObjectCard key={index} object={value} onClosed={() => removeObject(obj)} />)}
        </div>
    </div>
}
