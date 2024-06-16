import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Title } from "./title"

interface IDESettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function IDESettings({ children, className }: IDESettingsProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default", size: "icon" }))}
      >
        <Settings />
      </DialogTrigger>
      <DialogContent className="overflow-y-auto border-none bg-grayscale-025 shadow-none">
        <DialogHeader>
          <Title text="Settings" />
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
