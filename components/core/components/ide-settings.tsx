import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IDESettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function IDESettings({ children }: IDESettingsProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default", size: "icon" }))}
      >
        <Settings />
      </DialogTrigger>
      <DialogContent className="overflow-y-auto border-none bg-grayscale-025 shadow-none">
        <DialogHeader>
          <div className="text-center text-xl font-semibold">Settings</div>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
