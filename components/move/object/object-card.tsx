import { toMoveObject } from "@/lib/move/interface";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SuiObjectData } from "@mysten/sui/client";
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron";
import { buttonVariants } from "@/components/ui/button";
import { CrossIcon } from "lucide-react";

interface ObjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
    object: SuiObjectData
}

export function ObjectCard({ object }: ObjectCardProps) {
    return <CollapsibleChevron name={object.objectId}>
        <Card className="border-none">
            <CardHeader>
                <CardTitle className="truncate">{object.objectId}</CardTitle>
                <CardDescription>Version: {object.version}</CardDescription>
            </CardHeader>
            <CardContent className="my-0">
                {Object.entries(toMoveObject(object).fields).map(([key, value], index) => {
                    return <div className="my-1" key={index}>
                        <div className="font-bold">{key}</div>
                        <div className="break-words	">{JSON.stringify(value)}</div>
                    </div>
                })}
            </CardContent>
        </Card>
    </CollapsibleChevron>
}