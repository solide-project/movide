import { Trash } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu"

export const FileTreeContextMenuSubTrigger = ({
  className,
  children,
  ...props
}: any) => (
  <ContextMenuSubTrigger className={cn("p-0 px-2 py-1", className)} {...props}>
    {children}
  </ContextMenuSubTrigger>
)

export const FileTreeContextMenuItem = ({
  className,
  children,
  ...props
}: any) => (
  <ContextMenuItem className={cn("p-0 px-2 py-1", className)} {...props}>
    {children}
  </ContextMenuItem>
)

export const DeleteFileContextMenuItem = ({
  className,
  children,
  ...props
}: any) => (
  <FileTreeContextMenuItem className="hover:cursor-pointer" {...props}>
    Delete
    <ContextMenuShortcut>
      <Trash size={14} />
    </ContextMenuShortcut>
  </FileTreeContextMenuItem>
)
