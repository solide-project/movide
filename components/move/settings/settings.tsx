import { IDESettings } from "@/components/core/components/ide-settings"
import { SelectNetwork } from "@/components/move/settings/select-network"
import { TomlPathInput } from "@/components/move/settings/toml-path-input"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"


interface MoveSettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MoveSettings({ className }: MoveSettingsProps) {
    return <IDESettings>
        <div className="flex items-center justify-between">
            <div className="font-semibold">Mode</div>
            <NavItemTheme />
        </div>

        <div className="flex items-center justify-between">
            <div className="font-semibold">Chain</div>
            <SelectNetwork />
        </div>

        <div className="flex items-center justify-between">
            <div className="font-semibold">Toml Path</div>
            <TomlPathInput />
        </div>
    </IDESettings>
}