import { IDESettings } from "@/components/core/components/ide-settings"
import { Title } from "@/components/core/components/title"
import { SelectNetwork } from "@/components/move/settings/select-network"
import { TomlPathInput } from "./toml-path-input"


interface MoveSettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MoveSettings({ className }: MoveSettingsProps) {
    return <IDESettings>
        <Title text="Test Settings" />
        <SelectNetwork />

        <TomlPathInput />
    </IDESettings>
}