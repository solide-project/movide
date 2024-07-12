import {
    ContextMenuItem,
    ContextMenuSubTrigger,
} from "@/components/ui/context-menu"

const menuClass = "p-0 py-1 px-2"
export const FileTreeContextMenuSubTrigger = ({ children, ...props }: any) => {
    return <ContextMenuSubTrigger className={menuClass} {...props}>
        {children}
    </ContextMenuSubTrigger>
}

export const FileTreeContextMenuItem = ({ children, ...props }: any) => {
    return <ContextMenuItem className={menuClass} {...props}>
        {children}
    </ContextMenuItem>
}