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
import { CopyText } from "@/components/core/components/copy-text";

interface ObjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
    object: SuiObjectData,
    onClosed?: () => void
}

export function ObjectCard({ object, onClosed }: ObjectCardProps) {
    return <CollapsibleChevron name={object.objectId} onClosed={onClosed}>
        <Card className="border-none bg-transparent">
            <CardHeader className="p-0 m-0 my-2">
                {/* <CardTitle className="truncate">{object.objectId}</CardTitle> */}
                <div className="flex gap-2 flex-wrap">
                    <ObjectBadge title="Version" value={object.version} />
                    <ObjectBadge title="Digest" value={object.digest} />
                    {object.type &&
                        <ObjectBadge title="Type" value={object.type} />}
                </div>
            </CardHeader>
            <CardContent className="p-0 m-0 my-2">
                {Object.entries(toMoveObject(object).fields).map(([key, value], index) => {
                    return <div className="my-1" key={index}>
                        <div className="font-bold text-primary my-1">{key}</div>
                        <div className="break-words	">{JSON.stringify(value)}</div>
                    </div>
                })}
            </CardContent>
        </Card>
    </CollapsibleChevron>
}

const ObjectBadge = ({ title, value }: { title: string, value: string }) => {
    return <div className="inline-flex items-center w-fit overflow-auto gap-2 px-2.5 py-0.5 text-sm font-semibold transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm">
        <div className="text-primary">{title}</div>
        <div className="truncate text-wrap">{value}</div>
        <CopyText payload={value} />
    </div>
}